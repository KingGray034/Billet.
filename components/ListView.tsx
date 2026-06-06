"use client";

import { trpc } from "@/utils/trpc";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type ListViewProps = {
  searchTerm?: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_BADGE_COLORS: Record<string, string> = {
  PENDING:   "bg-retro-teal text-white",
  APPLIED:   "bg-retro-orange text-white",
  SCREENING: "bg-retro-yellow text-retro-border",
  INTERVIEW: "bg-retro-purple text-white",
  OFFER:     "bg-retro-green text-white",
  REJECTED:  "bg-retro-red text-white",
};

// ─── Component ────────────────────────────────────────────────────────────────

function ListView({ searchTerm = "" }: ListViewProps) {
  const router = useRouter();
  const { data: applications, isLoading } = trpc.application.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-retro-border">Loading applications...</p>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="bg-white border-4 border-retro-border retro-card-shadow p-12 text-center">
        <p className="text-retro-border text-lg font-bold">No applications yet!</p>
      </div>
    );
  }

  const filteredApps = applications.filter((app) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return [app.position, app.company?.name, app.location, app.status, app.contactEmail, app.id?.slice(-6)]
      .filter(Boolean)
      .some((val) => String(val).toLowerCase().includes(term));
  });

  const handleRowClick = (appId: string) => {
    const params = new URLSearchParams(window.location.search);
    const currentView = params.get("view") ?? "list";
    router.push(`/application/${appId}?returnView=${currentView}`);
  };

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block bg-white border-4 border-retro-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-retro-border text-white">
              <tr>
                {["Position", "Company", "Contact", "Location", "Salary", "Status", "Applied Date"].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-retro-border">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-retro-border font-medium">
                    No applications match your search
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => handleRowClick(app.id)}
                    className="hover:bg-retro-yellow/30 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-retro-border">{app.position}</div>
                      <div className="text-xs text-retro-border/50 font-sans uppercase tracking-wider">
                        Billet #{app.id.slice(-6).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-retro-border/80">{app.company.name}</td>
                    <td className="px-6 py-4 text-retro-border/60 text-sm">{app.contactEmail || "—"}</td>
                    <td className="px-6 py-4 text-retro-border/60">{app.location || "—"}</td>
                    <td className="px-6 py-4 text-retro-border/60">{app.salary || <span className="italic text-retro-border/30">Not specified</span>}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border-2 border-retro-border ${STATUS_BADGE_COLORS[app.status] ?? "bg-white text-retro-border"}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-retro-border/60 text-sm">
                      {format(new Date(app.dateApplied), "MMM d, yyyy")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-0">
        {filteredApps.length === 0 ? (
          <div className="bg-white border-4 border-retro-border p-8 text-center">
            <p className="text-retro-border font-medium">No applications match your search</p>
          </div>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.id}
              onClick={() => handleRowClick(app.id)}
              className="bg-white border-4 border-retro-border p-5 -mt-[4px] cursor-pointer hover:bg-retro-yellow/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-serif font-bold text-retro-border leading-tight">{app.position}</p>
                  <p className="font-sans text-sm text-retro-border/60 mt-0.5">{app.company.name}</p>
                </div>
                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider border-2 border-retro-border shrink-0 ${STATUS_BADGE_COLORS[app.status] ?? "bg-white text-retro-border"}`}>
                  {app.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-retro-border/50">
                {app.location && <span>{app.location}</span>}
                {app.salary && <span>{app.salary}</span>}
                <span>{format(new Date(app.dateApplied), "MMM d, yyyy")}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export { ListView };