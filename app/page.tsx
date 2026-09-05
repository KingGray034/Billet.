import Link from "next/link";
import {
  LayoutGrid,
  Bot,
  FileSearch,
  Mail,
  CalendarCheck,
  BarChart2,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: <LayoutGrid className="w-6 h-6 text-white" />,
    color: "bg-retro-teal",
    label: "Kanban Board",
    description:
      "Drag applications across stages — To Apply, Applied, Screening, Interview, Offer, and more.",
  },
  {
    icon: <Bot className="w-6 h-6 text-white" />,
    color: "bg-retro-orange",
    label: "AI Interview Prep",
    description:
      "Generate role-specific interview questions powered by Llama 3.3 so you walk in ready.",
  },
  {
    icon: <FileSearch className="w-6 h-6 text-white" />,
    color: "bg-retro-purple",
    label: "Resume Analysis",
    description:
      "Upload your resume and get instant AI feedback tailored to each job description.",
  },
  {
    icon: <Mail className="w-6 h-6 text-white" />,
    color: "bg-retro-green",
    label: "Gmail Import",
    description:
      "Pull application emails straight from Gmail — no copy-pasting, no double-entry.",
  },
  {
    icon: <CalendarCheck className="w-6 h-6 text-retro-border" />,
    color: "bg-retro-yellow",
    label: "Calendar Sync",
    description:
      "Interview slots land on your Google Calendar automatically. Never miss a call.",
  },
  {
    icon: <BarChart2 className="w-6 h-6 text-white" />,
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

// ─── Page ─────────────────────────────────────────────────────────────────────

function Home() {
  return (
    <main className="min-h-screen bg-background-light font-serif overflow-x-hidden">

      {/* Nav */}
      <nav className="border-b-4 border-retro-border bg-background-light sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif font-bold text-4xl tracking-tight text-retro-border">
            BILLET<span className="text-primary">.</span>
          </Link>
          <a
            href="/api/auth/login"
            className="px-5 py-2 bg-primary text-white border-4 border-retro-border font-serif font-bold uppercase tracking-wider text-sm retro-button-shadow hover:bg-primary/90 transition-all"
          >
            Sign In →
          </a>
        </div>
      </nav>


      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-16">
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
              <a
                href="/api/auth/login"
                className="px-7 py-3 bg-primary text-white border-4 border-retro-border font-serif font-bold uppercase tracking-wider retro-button-shadow hover:bg-primary/90 transition-all text-sm"
              >
                Get Started — It's Free
              </a>
            </div>
          </div>

          {/* Mock card */}
          <div className="hidden lg:block flex-shrink-0 w-80 relative mt-4 mb-12">
            <div className="absolute top-4 left-4 w-full h-full bg-retro-teal border-4 border-retro-border" />
            <div className="absolute top-2 left-2 w-full h-full bg-retro-orange border-4 border-retro-border" />
            <div className="relative bg-white border-4 border-retro-border p-6 flex flex-col justify-between min-h-80">
              <div className="space-y-4">
                <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase font-sans">
                  Billet #58VK2H
                </span>
                <h4 className="font-serif text-xl font-bold leading-tight text-retro-border">
                  Senior Frontend Engineer
                </h4>
                <div className="space-y-2 font-sans">
                  <p className="text-sm font-medium text-retro-border flex items-baseline gap-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-retro-border/40 shrink-0">Co.</span>
                    Google
                  </p>
                  <p className="text-sm text-retro-border/70 flex items-baseline gap-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-retro-border/40 shrink-0">Loc.</span>
                    Mountain View, CA
                  </p>
                  <p className="text-sm text-retro-border/70 flex items-baseline gap-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-retro-border/40 shrink-0">Sal.</span>
                    $180k – $250k
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t-2 border-dashed border-retro-border/20 flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-retro-orange text-white border-2 border-retro-border font-serif font-bold uppercase text-xs tracking-wide whitespace-nowrap">
                  Applied
                </span>
                <span className="font-sans text-[10px] text-retro-border/50 uppercase tracking-wider text-right whitespace-nowrap">
                  Applied: Apr 1, 2024
                </span>
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
                <span key={`${rep}-${i}`} className="font-serif font-bold uppercase tracking-widest text-sm text-white flex items-center gap-12">
                  {t}
                  <span className="text-retro-yellow">✦</span>
                </span>
              )
            )
          )}
        </div>
      </div>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end gap-6 mb-12 border-b-4 border-retro-border pb-6">
          <h2 className="font-serif text-4xl font-bold text-retro-border">Everything you need.</h2>
          <p className="font-sans text-retro-border/50 pb-1 text-sm">Nothing you don't.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {features.map(({ icon, color, label, description }) => (
            <div
              key={label}
              className="border-4 border-retro-border p-6 bg-white -mt-[4px] -ml-[4px] hover:z-10 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#1a1a1a] transition-all duration-150"
            >
              <div className={`w-12 h-12 ${color} border-4 border-retro-border flex items-center justify-center mb-4`}>
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
                <h3 className="font-serif text-xl font-bold text-background-light uppercase tracking-wide mb-3">{title}</h3>
                <p className="font-sans text-sm text-background-light/60 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extension */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end gap-6 mb-12 border-b-4 border-retro-border pb-6">
          <h2 className="font-serif text-4xl font-bold text-retro-border">Save any job in one click.</h2>
          <p className="font-sans text-retro-border/50 pb-1 text-sm">Works on every major job board.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="border-4 border-retro-border bg-white p-8 -mt-[4px]">
            <div className="w-12 h-12 bg-retro-orange border-4 border-retro-border flex items-center justify-center mb-4">
              <span className="font-serif font-bold text-white text-xs">FF</span>
            </div>
            <h3 className="font-serif font-bold text-lg text-retro-border mb-2 uppercase tracking-wide">Firefox Extension</h3>
            <p className="font-sans text-sm text-retro-border/60 leading-relaxed mb-6">
              Install once, use forever. Click the extension on any job page — LinkedIn, Indeed, Glassdoor and more — and it autofills everything into Billet instantly.
            </p>
            <a
              href="https://addons.mozilla.org/en-US/firefox/addon/billet-quick-add/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-retro-orange text-white border-4 border-retro-border font-serif font-bold uppercase tracking-wider text-sm retro-button-shadow hover:bg-retro-orange/90 transition-all"
            >
              Install for Firefox →
            </a>
          </div>

          <div className="border-4 border-retro-border bg-white p-8 -mt-[4px] -ml-[4px]">
            <div className="w-12 h-12 bg-retro-teal border-4 border-retro-border flex items-center justify-center mb-4">
              <span className="font-serif font-bold text-white text-xs">ED</span>
            </div>
            <h3 className="font-serif font-bold text-lg text-retro-border mb-2 uppercase tracking-wide">Edge Extension</h3>
            <p className="font-sans text-sm text-retro-border/60 leading-relaxed mb-6">
              Same experience, built for Microsoft Edge. Autofill job details from any supported job board directly into your Billet pipeline.
            </p>
            <a
              href="https://microsoftedge.microsoft.com/addons/detail/billet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-retro-teal text-white border-4 border-retro-border font-serif font-bold uppercase tracking-wider text-sm retro-button-shadow hover:bg-retro-teal/90 transition-all"
            >
              Install for Edge →
            </a>
          </div>
        </div>

        <div className="border-4 border-retro-border border-t-0 bg-retro-yellow/30 p-6">
          <p className="font-sans text-xs text-retro-border/50 uppercase tracking-widest text-center">
            Supported: LinkedIn · Indeed · Glassdoor · ZipRecruiter · Wellfound · RemoteOK · Monster
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="border-4 border-retro-border bg-retro-yellow p-12 relative retro-card-shadow">
          <span className="absolute top-3 left-3 text-retro-border/30 font-serif text-xs">✦</span>
          <span className="absolute top-3 right-3 text-retro-border/30 font-serif text-xs">✦</span>
          <span className="absolute bottom-3 left-3 text-retro-border/30 font-serif text-xs">✦</span>
          <span className="absolute bottom-3 right-3 text-retro-border/30 font-serif text-xs">✦</span>
          <div className="text-center">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-retro-border/50 mb-4">Free. Open source. Yours.</p>
            <h2 className="font-serif text-5xl font-bold text-retro-border mb-6 leading-tight">
              Ready to take control<br />of your job search?
            </h2>
            <a
              href="/api/auth/login"
              className="inline-block px-10 py-4 bg-primary text-white border-4 border-retro-border font-serif font-bold uppercase tracking-wider retro-button-shadow hover:bg-primary/90 transition-all"
            >
              Sign In with Google — It's Free
            </a>
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
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="font-sans text-xs text-retro-border/50 hover:text-primary transition-colors uppercase tracking-wide">Privacy</Link>
            <Link href="/terms" className="font-sans text-xs text-retro-border/50 hover:text-primary transition-colors uppercase tracking-wide">Terms</Link>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

    </main>
  );
}

export default Home;