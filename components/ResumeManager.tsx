"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { trpc } from "@/utils/trpc";

// ─── Types ────────────────────────────────────────────────────────────────────

type ResumeItem = {
  id: string;
  label: string;
  fileName: string | null;
  updatedAt: Date | string;
};

type ResumeRowProps = {
  resume: ResumeItem;
  isBusy: boolean;
  onReplace: (id: string, file: File) => void;
  onRename: (resume: ResumeItem) => void;
  onDelete: (resume: ResumeItem) => void;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_RESUMES = 10;
const NEW_RESUME_ID = "new";
const SUGGESTED_LABELS = ["Main", "Short version", "Detailed", "Entry level"];
const ACCEPTED_TYPES = ".pdf,.docx,.md,.txt";

const TRIGGER_CLASS =
  "h-10 px-4 bg-retro-teal text-white border-2 border-retro-border font-bold retro-button-shadow hover:bg-retro-teal/90 transition-all text-sm uppercase tracking-wider whitespace-nowrap";

const BUTTON_CLASS =
  "px-4 py-2 bg-white border-4 border-retro-border font-bold uppercase tracking-wider text-sm retro-button-shadow hover:bg-retro-yellow transition-all";

const SMALL_BUTTON_CLASS =
  "px-3 py-1 bg-white border-2 border-retro-border font-bold uppercase tracking-wider text-xs hover:bg-retro-yellow disabled:opacity-50 transition-all cursor-pointer";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function parseResumeFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/resume/parse", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Failed to read file");
  }

  return data.text;
}

function getFileStem(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "");
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ResumeRow({
  resume,
  isBusy,
  onReplace,
  onRename,
  onDelete,
}: ResumeRowProps) {
  return (
    <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-2 border-retro-border p-4">
      <div className="min-w-0">
        <p className="font-bold text-retro-border break-words">
          {resume.label}
        </p>
        <p className="text-xs text-retro-border/60 break-all">
          {resume.fileName ?? "Pasted text"} · Updated{" "}
          {format(new Date(resume.updatedAt), "MMM d, yyyy")}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 shrink-0">
        <label className={SMALL_BUTTON_CLASS}>
          {isBusy ? "Working..." : "Replace"}
          <input
            type="file"
            accept={ACCEPTED_TYPES}
            disabled={isBusy}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) onReplace(resume.id, file);
            }}
          />
        </label>
        <button
          onClick={() => onRename(resume)}
          disabled={isBusy}
          className={SMALL_BUTTON_CLASS}
        >
          Rename
        </button>
        <button
          onClick={() => onDelete(resume)}
          disabled={isBusy}
          className={SMALL_BUTTON_CLASS}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function ResumeManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const utils = trpc.useUtils();
  const { data: resumes = [] } = trpc.resume.list.useQuery();

  const createResume = trpc.resume.create.useMutation();
  const updateResume = trpc.resume.update.useMutation();
  const removeResume = trpc.resume.remove.useMutation();

  const isAtLimit = resumes.length >= MAX_RESUMES;
  const isBusy = busyId !== null;

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const runAction = async (id: string, action: () => Promise<unknown>) => {
    setBusyId(id);
    setError(null);
    try {
      await action();
      await utils.resume.list.invalidate();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleAdd = (file: File) =>
    runAction(NEW_RESUME_ID, async () => {
      const content = await parseResumeFile(file);
      await createResume.mutateAsync({
        label: label.trim() || getFileStem(file.name).slice(0, 40),
        content,
        fileName: file.name,
      });
      setLabel("");
    });

  const handleReplace = (id: string, file: File) =>
    runAction(id, async () => {
      const content = await parseResumeFile(file);
      await updateResume.mutateAsync({ id, content, fileName: file.name });
    });

  const handleRename = (resume: ResumeItem) => {
    const next = window.prompt("New name for this resume", resume.label)?.trim();
    if (!next || next === resume.label) return;
    runAction(resume.id, () =>
      updateResume.mutateAsync({ id: resume.id, label: next }),
    );
  };

  const handleDelete = (resume: ResumeItem) => {
    if (!confirm(`Delete "${resume.label}"? This cannot be undone.`)) return;
    runAction(resume.id, () => removeResume.mutateAsync({ id: resume.id }));
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={TRIGGER_CLASS}>
        Resumes ({resumes.length})
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white border-4 border-retro-border retro-card-shadow w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b-2 border-retro-border pb-4 mb-6">
              <div>
                <h2 className="font-serif text-2xl font-bold uppercase tracking-wider text-retro-border">
                  My Resumes
                </h2>
                <p className="text-xs text-retro-border/60 mt-1">
                  {resumes.length} of {MAX_RESUMES} saved. Pick one when you
                  analyze an application.
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={SMALL_BUTTON_CLASS}
              >
                Close
              </button>
            </div>

            {error && (
              <p className="bg-retro-orange/20 border-2 border-retro-border p-3 mb-6 text-sm font-bold text-retro-border">
                {error}
              </p>
            )}

            {resumes.length === 0 ? (
              <p className="text-sm text-retro-border/70 text-center mb-6">
                No saved resumes yet. Add your first one below.
              </p>
            ) : (
              <ul className="space-y-3 mb-8">
                {resumes.map((resume) => (
                  <ResumeRow
                    key={resume.id}
                    resume={resume}
                    isBusy={busyId === resume.id}
                    onReplace={handleReplace}
                    onRename={handleRename}
                    onDelete={handleDelete}
                  />
                ))}
              </ul>
            )}

            <div className="border-4 border-retro-border p-4">
              <h3 className="font-serif text-base font-bold uppercase tracking-wider text-retro-border mb-4">
                Add a resume
              </h3>

              <label className="block text-xs font-bold tracking-[0.2em] uppercase text-retro-border/60 mb-2">
                Name
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                maxLength={40}
                placeholder="e.g. Main CV, Sales roles, Teaching"
                className="w-full px-4 py-2 border-4 border-retro-border outline-none focus:border-primary mb-3"
              />

              <div className="flex flex-wrap gap-2 mb-4">
                {SUGGESTED_LABELS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setLabel(suggestion)}
                    className={SMALL_BUTTON_CLASS}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <label
                className={`${BUTTON_CLASS} inline-block cursor-pointer ${
                  isBusy || isAtLimit ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {busyId === NEW_RESUME_ID
                  ? "Reading..."
                  : "Choose file and save"}
                <input
                  type="file"
                  accept={ACCEPTED_TYPES}
                  disabled={isBusy || isAtLimit}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (file) handleAdd(file);
                  }}
                />
              </label>

              <p className="text-xs text-retro-border/60 mt-3">
                PDF, DOCX, MD or TXT, up to 4MB. Scanned PDFs without text
                can&apos;t be read.
                {isAtLimit && " You have reached the limit. Delete one first."}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export { ResumeManager };
