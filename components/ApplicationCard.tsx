"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type Interview = { scheduledAt: Date; type: string };

type Application = {
  id: string;
  position: string;
  company: { name: string };
  dateApplied: Date;
  salary?: string | null;
  location?: string | null;
  contactEmail?: string | null;
  status: string;
  interviews?: Interview[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  PENDING:   { bg: "bg-retro-teal",   text: "text-white",        label: "To Apply"  },
  APPLIED:   { bg: "bg-retro-orange", text: "text-white",        label: "Applied"   },
  SCREENING: { bg: "bg-retro-yellow", text: "text-retro-border", label: "Screening" },
  INTERVIEW: { bg: "bg-retro-purple", text: "text-white",        label: "Interview" },
  OFFER:     { bg: "bg-retro-green",  text: "text-white",        label: "Offer"     },
  REJECTED:  { bg: "bg-retro-red",    text: "text-white",        label: "Rejected"  },
};

function getDateLabel(status: string, dateApplied: Date, interviews?: Interview[]): string {
  const date = format(new Date(dateApplied), "MMM d, yyyy").toUpperCase();

  if (status === "INTERVIEW") {
    const first = interviews?.[0];
    const round = first?.type ? parseInt(first.type.replace("Round ", ""), 10) || 1 : 1;
    const interviewDate = first?.scheduledAt
      ? format(new Date(first.scheduledAt), "MMM d, yyyy").toUpperCase()
      : date;
    return `Round ${round} · ${interviewDate}`;
  }

  const labels: Record<string, string> = {
    PENDING:   `Posted: ${date}`,
    APPLIED:   `Applied: ${date}`,
    SCREENING: `Call: ${date}`,
    OFFER:     `Offer: ${date}`,
    REJECTED:  `Closed: ${date}`,
  };

  return labels[status] ?? date;
}

// ─── Component ────────────────────────────────────────────────────────────────

function ApplicationCard({
  application,
  isRejected,
}: {
  application: Application;
  isRejected?: boolean;
}) {
  const router = useRouter();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const badge = STATUS_BADGE[application.status] ?? {
    bg: "bg-white",
    text: "text-retro-border",
    label: application.status,
  };

  const dateLabel = getDateLabel(
    application.status,
    application.dateApplied,
    application.interviews,
  );

  const handleClick = () => {
    if (!isDragging) {
      const params = new URLSearchParams(window.location.search);
      const currentView = params.get("view") ?? "kanban";
      router.push(`/application/${application.id}?returnView=${currentView}`);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`bg-white border-4 border-retro-border p-6 w-full min-h-80 flex flex-col justify-between cursor-grab active:cursor-grabbing transition-opacity ${
        isRejected ? "opacity-60" : ""
      }`}
    >
      {/* ── Body ── */}
      <div className="space-y-4">
        <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase font-sans">
          Billet #{application.id.slice(-6).toUpperCase()}
        </span>

        <h4
          className={`font-serif text-xl font-bold leading-tight text-retro-border ${
            isRejected ? "line-through" : ""
          }`}
        >
          {application.position}
        </h4>

        <div className="space-y-2 font-sans">
          <p className="text-sm font-medium text-retro-border flex items-baseline gap-2">
            <span className="text-[10px] font-bold tracking-widest uppercase text-retro-border/40 shrink-0">Co.</span>
            {application.company.name}
          </p>
          {application.location && (
            <p className="text-sm text-retro-border/70 flex items-baseline gap-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-retro-border/40 shrink-0">Loc.</span>
              {application.location}
            </p>
          )}
          {application.contactEmail && (
            <p className="text-sm text-retro-border/70 flex items-baseline gap-2 break-all">
              <span className="text-[10px] font-bold tracking-widest uppercase text-retro-border/40 shrink-0">Mail.</span>
              {application.contactEmail}
            </p>
          )}
          {application.salary ? (
            <p className="text-sm text-retro-border/70 flex items-baseline gap-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-retro-border/40 shrink-0">Sal.</span>
              {application.salary}
            </p>
          ) : (
            <p className="text-sm text-retro-border/30 italic flex items-baseline gap-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-retro-border/20 shrink-0 not-italic">Sal.</span>
              Not specified
            </p>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="pt-4 mt-4 border-t-2 border-dashed border-retro-border/20 flex items-center justify-between gap-2">
        <span
          className={`px-3 py-1 ${badge.bg} ${badge.text} border-2 border-retro-border font-serif font-bold uppercase text-xs tracking-wide`}
        >
          {badge.label}
        </span>
        <span className="font-sans text-[10px] text-retro-border/50 uppercase tracking-wider text-right">
          {dateLabel}
        </span>
      </div>
    </div>
  );
}

export { ApplicationCard };