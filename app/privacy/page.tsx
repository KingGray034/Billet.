import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Billet",
  description: "Privacy policy for Billet and the Billet browser extension.",
};

const sections = [
  {
    title: "What we collect",
    body: `When you use the Billet browser extension and click Autofill or Save, it reads the following from the current job posting page: job title, company name, location, salary (if visible), job description text, and the page URL. Nothing is collected passively or in the background — the extension only activates when you click a button.

When you connect Gmail, Billet reads job-related emails from your inbox to import application data. It does not read, store, or process any other emails.

When you connect Google Calendar, Billet creates calendar events for interview slots you choose to add. It does not read or modify any existing events.`,
  },
  {
    title: "How your data is used",
    body: `All data collected is used solely to populate your personal job application tracker. It is not sold to, shared with, or processed by any third party. Billet has no advertising model.`,
  },
  {
    title: "How your data is stored",
    body: `Your application data is stored in a personal Supabase PostgreSQL database. Google OAuth access tokens are stored in HTTP-only cookies — they are never exposed to client-side JavaScript or transmitted to third parties. Tokens expire after one hour.`,
  },
  {
    title: "Google OAuth scopes",
    body: `Billet requests the following Google scopes:

— gmail.readonly: to read job-related emails for import
— calendar.events: to create interview events on your calendar

These scopes are used only for the features described above and are not used for any other purpose.`,
  },
  {
    title: "Third-party services",
    body: `Billet uses the following third-party services to operate:

— Supabase (database hosting)
— Groq (AI inference for resume analysis and interview question generation)
— Vercel (application hosting)

None of these services receive your personal data beyond what is necessary to deliver the feature you are using.`,
  },
  {
    title: "Data deletion",
    body: `You can delete any application and its associated data directly from the dashboard. To request full deletion of your account and all associated data, contact us at the email below.`,
  },
  {
    title: "Contact",
    body: `For any questions about this privacy policy or your data, contact: dennis.s.favour@gmail.com`,
  },
];

function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="font-sans text-sm text-retro-border/50">
            Last updated: April 2026
          </p>
        </div>

        {/* Intro */}
        <div className="bg-retro-yellow border-4 border-retro-border p-6 mb-12 retro-card-shadow">
          <p className="font-sans text-retro-border leading-relaxed">
            Billet is a personal job application tracker. This policy explains what data is collected
            when you use the Billet web app and browser extension, how it is used, and how it is stored.
            The short version: your data stays yours, is never sold, and is only used to make the app work.
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

export default PrivacyPage;