"use client";
import Link from "next/link";

const features = [
  {
    icon: "📋",
    color: "bg-retro-teal",
    label: "Kanban Board",
    description:
      "Drag applications across stages — To Apply, Applied, Screening, Interview, Offer, and more.",
  },
  {
    icon: "🤖",
    color: "bg-retro-orange",
    label: "AI Interview Prep",
    description:
      "Generate role-specific interview questions powered by Llama 3.3 so you walk in ready.",
  },
  {
    icon: "📄",
    color: "bg-retro-purple",
    label: "Resume Analysis",
    description:
      "Upload your resume and get instant AI feedback tailored to each job description.",
  },
  {
    icon: "📧",
    color: "bg-retro-green",
    label: "Gmail Import",
    description:
      "Pull application emails straight from Gmail — no copy-pasting, no double-entry.",
  },
  {
    icon: "📅",
    color: "bg-retro-yellow border-4 border-retro-border",
    label: "Calendar Sync",
    description:
      "Interview slots land on your Google Calendar automatically. Never miss a call.",
  },
  {
    icon: "📊",
    color: "bg-retro-red",
    label: "Analytics",
    description:
      "Track response rates, pipeline velocity, and application trends at a glance.",
  },
];

const steps = [
  {
    number: "01",
    title: "Add an application",
    body: "Paste the URL, fill the form, or let the browser extension capture it automatically from any job board.",
  },
  {
    number: "02",
    title: "Track every stage",
    body: "Move cards through your pipeline. Log notes, contacts, and salary details in one place.",
  },
  {
    number: "03",
    title: "Prepare with AI",
    body: "Generate tailored interview questions and get resume feedback before every conversation.",
  },
];

function Home() {
  return (
    <main className="min-h-screen bg-background-light font-serif overflow-x-hidden">

      {/* Nav */}
      <nav className="border-b-4 border-retro-border bg-background-light sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-serif font-bold text-xl tracking-tight text-retro-border">
            BILLET<span className="text-primary">.</span>
          </span>
          <Link
            href="/dashboard"
            className="px-5 py-2 bg-primary text-white border-4 border-retro-border font-serif font-bold uppercase tracking-wider text-sm retro-button-shadow hover:bg-primary/90 transition-all"
          >
            Open Dashboard →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="flex flex-col lg:flex-row items-start gap-16">

          <div className="flex-1">
            <div className="inline-block px-4 py-1 bg-retro-teal border-4 border-retro-border text-white font-bold uppercase tracking-widest text-xs mb-8 retro-button-shadow">
              AI-Powered Job Application Tracker
            </div>

            <h1 className="font-serif text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-retro-border mb-6">
              Your job hunt,<br />
              <span className="relative inline-block">
                <span className="relative z-10">finally</span>
                <span
                  className="absolute bottom-1 left-0 right-0 h-4 bg-retro-yellow -z-0"
                  style={{ transform: "skewX(-3deg)" }}
                />
              </span>{" "}
              organised.
            </h1>

            <p className="font-sans text-retro-border/70 text-lg leading-relaxed max-w-md mb-10">
              Track applications on a Kanban board, get AI interview prep,
              analyse your resume against each role, and import emails from
              Gmail — all in one place.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="px-7 py-3 bg-primary text-white border-4 border-retro-border font-serif font-bold uppercase tracking-wider retro-button-shadow hover:bg-primary/90 transition-all text-sm"
              >
                + Add Your First Application
              </Link>
              <Link
                href="/dashboard?view=kanban"
                className="px-7 py-3 bg-white text-retro-border border-4 border-retro-border font-serif font-bold uppercase tracking-wider retro-button-shadow hover:bg-retro-yellow transition-all text-sm"
              >
                View Dashboard
              </Link>
            </div>
          </div>

          {/* Mock card stack */}
          <div className="hidden lg:block flex-shrink-0 w-80 relative mt-4 mb-12">
            <div className="absolute top-4 left-4 w-full h-full bg-retro-teal border-4 border-retro-border" />
            <div className="absolute top-2 left-2 w-full h-full bg-retro-orange border-4 border-retro-border" />
            <div className="relative bg-white border-4 border-retro-border p-6">
              <p className="font-sans text-xs font-bold text-primary uppercase tracking-widest mb-1">
                Billet #58VK2H
              </p>
              <h3 className="font-serif text-2xl font-bold text-retro-border mb-4 leading-tight">
                Senior Frontend Engineer
              </h3>
              <div className="space-y-2 text-sm font-sans text-retro-border/80">
                <p>
                  <span className="font-bold text-retro-border/40 text-xs tracking-widest uppercase mr-2">Co.</span>
                  Google
                </p>
                <p>
                  <span className="font-bold text-retro-border/40 text-xs tracking-widest uppercase mr-2">Loc.</span>
                  Mountain View, CA
                </p>
                <p>
                  <span className="font-bold text-retro-border/40 text-xs tracking-widest uppercase mr-2">Sal.</span>
                  $180k – $250k
                </p>
              </div>
              <div className="mt-5 pt-4 border-t-2 border-dashed border-retro-border/20 flex items-center justify-between">
                <span className="px-3 py-1 bg-retro-teal text-white border-2 border-retro-border font-bold uppercase text-xs">
                  Applied
                </span>
                <span className="font-sans text-xs text-retro-border/50">Apr 1, 2024</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Ticker tape */}
      <div className="border-y-4 border-retro-border bg-retro-teal py-3 overflow-hidden">
        <div className="flex gap-12 animate-[marquee_20s_linear_infinite] whitespace-nowrap w-max">
          {Array.from({ length: 3 }).flatMap((_, rep) =>
            ["KANBAN BOARD", "AI INTERVIEW PREP", "RESUME ANALYSIS", "GMAIL IMPORT", "CALENDAR SYNC", "BROWSER EXTENSION"].map(
              (t, i) => (
                <span
                  key={`${rep}-${i}`}
                  className="font-serif font-bold uppercase tracking-widest text-sm text-white flex items-center gap-12"
                >
                  {t}
                  <span className="text-retro-yellow">✦</span>
                </span>
              )
            )
          )}
        </div>
      </div>

      {/* Features grid */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end gap-6 mb-12 border-b-4 border-retro-border pb-6">
          <h2 className="font-serif text-4xl font-bold text-retro-border">
            Everything you need.
          </h2>
          <p className="font-sans text-retro-border/50 pb-1 text-sm">Nothing you don't.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {features.map(({ icon, color, label, description }) => (
            <div
              key={label}
              className="border-4 border-retro-border p-6 bg-white -mt-[4px] -ml-[4px] hover:z-10 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#1a1a1a] transition-all duration-150"
            >
              <div className={`w-12 h-12 ${color} border-4 border-retro-border flex items-center justify-center text-xl mb-4`}>
                {icon}
              </div>
              <h3 className="font-serif font-bold text-lg text-retro-border mb-2 uppercase tracking-wide">
                {label}
              </h3>
              <p className="font-sans text-sm text-retro-border/60 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-retro-border py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-serif text-4xl font-bold text-background-light mb-12 border-b-4 border-background-light/20 pb-6">
            How it works.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(({ number, title, body }) => (
              <div key={number} className="border-4 border-background-light/30 p-6">
                <p className="font-serif text-5xl font-bold text-primary mb-4">{number}</p>
                <h3 className="font-serif text-xl font-bold text-background-light uppercase tracking-wide mb-3">
                  {title}
                </h3>
                <p className="font-sans text-sm text-background-light/60 leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="border-4 border-retro-border bg-retro-yellow p-12 relative retro-card-shadow">
          <span className="absolute top-3 left-3 text-retro-border/30 font-serif text-xs">✦</span>
          <span className="absolute top-3 right-3 text-retro-border/30 font-serif text-xs">✦</span>
          <span className="absolute bottom-3 left-3 text-retro-border/30 font-serif text-xs">✦</span>
          <span className="absolute bottom-3 right-3 text-retro-border/30 font-serif text-xs">✦</span>
          <div className="text-center">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-retro-border/50 mb-4">
              Free. Open source. Yours.
            </p>
            <h2 className="font-serif text-5xl font-bold text-retro-border mb-6 leading-tight">
              Ready to take control<br />of your job search?
            </h2>
            <Link
              href="/dashboard"
              className="inline-block px-10 py-4 bg-primary text-white border-4 border-retro-border font-serif font-bold uppercase tracking-wider retro-button-shadow hover:bg-primary/90 transition-all"
            >
              Get Started — It's Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-retro-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-serif font-bold text-retro-border">
            BILLET<span className="text-primary">.</span>
          </span>
          <p className="font-sans text-xs text-retro-border/40 uppercase tracking-widest">
            Built with Next.js · Prisma · tRPC · Groq · Llama 3.3
          </p>
          <Link
            href="/dashboard"
            className="font-serif font-bold text-sm text-retro-border/50 hover:text-primary transition-colors uppercase tracking-wide"
          >
            Dashboard →
          </Link>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

    </main>
  );
}

export default Home;