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

type User = {
  userId: string;
  email: string;
  name: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

// ─── Component ────────────────────────────────────────────────────────────────

function HomeContent() {
  const searchParams = useSearchParams();
  const returnView = searchParams.get("view") as View | null;
  const [view, setView] = useState<View>(returnView ?? "kanban");
  const [activeSearch, setActiveSearch] = useState("");
  const [showGmailImport, setShowGmailImport] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("view", view);
    window.history.replaceState({}, "", url);
  }, [view]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => { if (data) setUser(data); });
  }, []);

  const firstName = user?.name?.split(" ")[0] ?? "";
  const greeting = `${getGreeting()}${firstName ? `, ${firstName}` : ""}`;

  return (
    <main className="min-h-screen bg-background-light">
      <div className="max-w-300 mx-auto px-4 sm:px-6 py-6 sm:py-8">

        <header className="flex flex-col gap-4 mb-8">

          {/* ── Top row ───────────────────────────────────────── */}
          <div className="w-full border-b-4 border-retro-border pb-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

              <h1 className="font-serif text-4xl font-bold tracking-tight">
                BILLET<span className="text-primary">.</span>
              </h1>

              <div className="flex flex-wrap items-center gap-3">

                {/* View toggle */}
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

                {/* Divider — separates app actions from account action */}
                <div className="hidden sm:block h-8 w-0.5 bg-retro-border/20" />

                {/* Sign out — far right, visually distinct */}
                <form action="/api/auth/logout" method="POST">
                  <button
                    type="submit"
                    className="px-3 sm:px-5 py-2 bg-white border-4 border-retro-border font-serif font-bold uppercase tracking-wider text-xs sm:text-sm retro-button-shadow hover:bg-retro-red/10 hover:text-retro-red transition-all whitespace-nowrap"
                  >
                    Sign Out
                  </button>
                </form>

              </div>
            </div>
          </div>

          {/* ── Greeting + Search ─────────────────────────────── */}
          {view !== "analytics" ? (
            <div className="flex items-center gap-6">
              <p className="font-serif text-lg text-retro-border/40 tracking-wide whitespace-nowrap">
                {greeting}
              </p>
              {/* Constrain search width so greeting has room */}
              <div className="flex-1 max-w-sm ml-auto">
                <SearchBar onSearch={setActiveSearch} />
              </div>
            </div>
          ) : (
            <p className="font-serif text-lg text-retro-border/40 tracking-wide text-center">
              {greeting}
            </p>
          )}

        </header>

        {view === "kanban" && <KanbanBoard searchTerm={activeSearch} />}
        {view === "list" && <ListView searchTerm={activeSearch} />}
        {view === "analytics" && <Analytics />}

        <StatsFooter />
      </div>

      {showGmailImport && (
        <GmailImportModal onCloseAction={() => setShowGmailImport(false)} />
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