"use client";
import { ApplicationForm } from "@/components/ApplicationForm";
import { KanbanBoard } from "@/components/KanbanBoard";
import { ListView } from "@/components/ListView";
import { Analytics } from "@/components/Analytics";
import { SearchBar } from "@/components/SearchBar";
import { StatsFooter } from "@/components/StatsFooter";
import { GmailImportModal } from "@/components/GmailImportModal";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type View = "kanban" | "list" | "analytics";

function HomeContent() {
  const searchParams = useSearchParams();
  const returnView = searchParams.get("view") as View | null;
  const [view, setView] = useState<View>(returnView || "kanban");
  const [activeSearch, setActiveSearch] = useState("");
  const [showGmailImport, setShowGmailImport] = useState(false);
  const [clearingDemo, setClearingDemo] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("view", view);
    window.history.replaceState({}, "", url);
  }, [view]);

  const handleClearDemo = async () => {
    setClearingDemo(true);
    try {
      const res = await fetch("/api/demo/clear", { method: "DELETE" });
      if (res.ok) {
        setShowClearConfirm(false);
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to clear demo data:", err);
    } finally {
      setClearingDemo(false);
    }
  };

  return (
    <main className="min-h-screen bg-background-light">
      <div className="max-w-300 mx-auto px-4 sm:px-6 py-6 sm:py-8">

        <header className="flex flex-col gap-6 mb-12">

          {/* Top row: title + actions */}
          <div className="w-full border-b-4 border-retro-border pb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

              {/* Title */}
              <h1 className="font-serif text-4xl font-bold tracking-tight">
                BILLET<span className="text-primary">.</span>
              </h1>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                {/* View nav */}
                <nav className="flex gap-2">
                  {(["kanban", "list", "analytics"] as View[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={`px-3 sm:px-5 py-2 bg-white border-4 border-retro-border font-serif font-bold uppercase tracking-wider text-xs sm:text-sm retro-button-shadow hover:bg-retro-yellow transition-colors ${
                        view === v ? "text-retro-border" : "text-retro-border/50"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </nav>

                <div className="hidden sm:block h-8 w-0.5 bg-retro-border/20" />

                {/* Gmail import */}
                <button
                  onClick={() => setShowGmailImport(true)}
                  className="px-3 sm:px-5 py-2 bg-retro-teal text-white border-4 border-retro-border font-serif font-bold uppercase tracking-wider text-xs sm:text-sm retro-button-shadow hover:bg-retro-teal/90 transition-all whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Import from Gmail</span>
                  <span className="sm:hidden">Gmail</span>
                </button>

                {/* Add application */}
                <ApplicationForm />

                {/* Clear demo data */}
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="px-3 sm:px-5 py-2 bg-white border-4 border-retro-border font-serif font-bold uppercase tracking-wider text-xs sm:text-sm retro-button-shadow hover:bg-retro-red/10 transition-all text-retro-red whitespace-nowrap"
                >
                  Clear Data
                </button>
              </div>
            </div>
          </div>

          {/* Search */}
          {view !== "analytics" && <SearchBar onSearch={setActiveSearch} />}
        </header>

        {view === "kanban" && <KanbanBoard searchTerm={activeSearch} />}
        {view === "list" && <ListView searchTerm={activeSearch} />}
        {view === "analytics" && <Analytics />}

        <StatsFooter />
      </div>

      {/* Gmail import modal */}
      {showGmailImport && (
        <GmailImportModal onCloseAction={() => setShowGmailImport(false)} />
      )}

      {/* Clear demo data confirm modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-4 border-retro-border retro-card-shadow p-8 max-w-md w-full">
            <h2 className="font-serif text-2xl font-bold text-retro-border mb-3 text-center">
              Clear all data?
            </h2>
            <p className="font-sans text-sm text-retro-border/70 mb-8 text-center leading-relaxed">
              This will permanently delete all applications, companies, interviews, and AI suggestions. This cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleClearDemo}
                disabled={clearingDemo}
                className="flex-1 px-4 py-3 bg-retro-red text-white border-4 border-retro-border font-serif font-bold uppercase tracking-wider text-sm retro-button-shadow hover:bg-retro-red/90 transition-all disabled:opacity-50"
              >
                {clearingDemo ? "Clearing..." : "Yes, clear everything"}
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-3 bg-white border-4 border-retro-border font-serif font-bold uppercase tracking-wider text-sm retro-button-shadow hover:bg-retro-yellow transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background-light flex items-center justify-center">
          <p className="text-retro-border font-bold text-xl">Loading...</p>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}

export default Home;