import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Billet",
  description: "Terms of service for Billet, the AI-powered job application tracker.",
};

const sections = [
  {
    title: "Acceptance of terms",
    body: `By using Billet, you agree to these terms. If you don't agree, don't use the app. These terms may be updated occasionally — continued use after changes means you accept the new terms.`,
  },
  {
    title: "What Billet is",
    body: `Billet is a personal job application tracking tool. It helps you organise job applications, prepare for interviews with AI-generated questions, analyse your resume, and import job-related emails from Gmail. It is provided free of charge.`,
  },
  {
    title: "Your account and data",
    body: `You are responsible for the data you enter into Billet. Do not enter sensitive personal information beyond what is necessary to track a job application. You retain ownership of all data you create. We do not claim any rights over your data.`,
  },
  {
    title: "Acceptable use",
    body: `You agree not to:

— Use Billet for any unlawful purpose
— Attempt to reverse-engineer, scrape, or overload the service
— Use the AI features to generate harmful, misleading, or fraudulent content
— Share your account with others or resell access to the service`,
  },
  {
    title: "AI-generated content",
    body: `Billet uses AI (Llama 3.3 via Groq) to generate interview questions and resume feedback. This content is provided for informational purposes only. We make no guarantees about its accuracy, completeness, or fitness for any particular purpose. Always apply your own judgement before acting on AI-generated suggestions.`,
  },
  {
    title: "Third-party services",
    body: `Billet integrates with Google (Gmail and Calendar) and uses Supabase, Groq, and Vercel to operate. Your use of these integrations is also subject to their respective terms of service. We are not responsible for the actions or availability of these third-party services.`,
  },
  {
    title: "Availability",
    body: `Billet is provided as-is. We do not guarantee uninterrupted availability. The service may be updated, changed, or discontinued at any time without notice.`,
  },
  {
    title: "Limitation of liability",
    body: `Billet is a free tool. To the maximum extent permitted by law, we are not liable for any damages arising from your use of the service, including lost opportunities, errors in AI-generated content, or data loss.`,
  },
  {
    title: "Contact",
    body: `For any questions about these terms, contact: dennis.s.favour@gmail.com`,
  },
];

function TermsPage() {
  return (
    <main className="min-h-screen bg-background-light">

      {/* Nav */}
      <nav className="border-b-4 border-retro-border bg-background-light sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif font-bold text-4xl tracking-tight text-retro-border">
            BILLET<span className="text-primary">.</span>
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2 bg-primary text-white border-4 border-retro-border font-serif font-bold uppercase tracking-wider text-sm retro-button-shadow hover:bg-primary/90 transition-all"
          >
            Open Dashboard →
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="border-b-4 border-retro-border pb-8 mb-12">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-retro-border/40 mb-4">
            Legal
          </p>
          <h1 className="font-serif text-5xl font-bold text-retro-border mb-4">
            Terms of Service
          </h1>
          <p className="font-sans text-sm text-retro-border/50">
            Last updated: April 2026
          </p>
        </div>

        {/* Intro */}
        <div className="bg-retro-yellow border-4 border-retro-border p-6 mb-12 retro-card-shadow">
          <p className="font-sans text-retro-border leading-relaxed">
            These are the terms under which Billet is offered. The short version: use it honestly,
            don't abuse it, and understand that AI-generated content is a starting point not a guarantee.
            Billet is free and open source.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-0">
          {sections.map(({ title, body }, i) => (
            <div key={title} className="border-4 border-retro-border bg-white p-8 -mt-[4px]">
              <div className="flex items-start gap-6">
                <span className="font-serif text-3xl font-bold text-primary shrink-0 w-8">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="font-serif text-xl font-bold text-retro-border uppercase tracking-wide mb-4">
                    {title}
                  </h2>
                  <div className="font-sans text-sm text-retro-border/70 leading-relaxed whitespace-pre-line">
                    {body}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Also see */}
        <div className="border-4 border-retro-border bg-white p-6 mt-0 -mt-[4px] flex items-center justify-between">
          <p className="font-sans text-sm text-retro-border/60">
            Also read our Privacy Policy for details on how your data is handled.
          </p>
          <Link
            href="/privacy"
            className="px-5 py-2 bg-white border-4 border-retro-border font-serif font-bold uppercase tracking-wider text-sm retro-button-shadow hover:bg-retro-yellow transition-all whitespace-nowrap"
          >
            Privacy Policy →
          </Link>
        </div>

        {/* Footer note */}
        <div className="mt-12 pt-8 border-t-4 border-retro-border">
          <p className="font-sans text-xs text-retro-border/40 uppercase tracking-widest text-center">
            Billet · Built with Next.js · Prisma · tRPC · Groq · Llama 3.3
          </p>
        </div>

      </div>
    </main>
  );
}

export default TermsPage;