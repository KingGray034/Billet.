# BILLET.

> AI-powered job application tracker with a retro editorial aesthetic.

Billet helps you run your job search like an operation — track every application through a visual Kanban pipeline, prep for interviews with AI-generated questions, analyse your resume against job descriptions, and pull emails straight from Gmail. No spreadsheets. No chaos.

**Live app:** https://billet-ng.vercel.app

---

## Features

- **Kanban Board** — Drag applications across stages: To Apply → Applied → Screening → Interview → Offer → Rejected
- **AI Interview Prep** — Generate role-specific interview questions powered by Llama 3.3 via Groq
- **Resume Analysis** — Paste your resume, get a match score, identified gaps, and tailoring tips per job
- **Gmail Import** — Pull application emails directly from your inbox, no copy-pasting
- **Google Calendar Sync** — Interview slots added to your calendar automatically
- **Browser Extension** — Auto-capture job details from major job boards (Firefox & Edge)
- **Analytics View** — Track response rates, pipeline velocity, and application trends
- **List View** — Sortable and filterable table view of all applications

---

## Browser Extension

The Billet extension works on LinkedIn, Indeed, Glassdoor, ZipRecruiter, Wellfound, RemoteOK, and Monster. Click it on any job page to autofill and save directly to your pipeline.

- [Install for Firefox](https://addons.mozilla.org/firefox/addon/billet)
- [Install for Edge](https://microsoftedge.microsoft.com/addons/detail/billet)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| API | tRPC |
| Database | Supabase (PostgreSQL) |
| ORM | Prisma 7 |
| AI | Groq · Llama 3.3 70B |
| Auth | Google OAuth (HTTP-only cookies) |
| Styling | Tailwind CSS v4 |
| Fonts | Lora · Public Sans (Google Fonts) |
| Drag & Drop | @dnd-kit |
| Charts | Recharts |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project
- A Google Cloud project (for OAuth, Gmail API, Calendar API)
- A Groq API key

### 1. Clone the repo

```bash
git clone https://github.com/KingGray034/Billet..git
cd Billet.
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root and add your credentials. Check the services below for where to find each value:

- **Supabase** — database URL and direct URL from your project settings
- **Google Cloud** — client ID and secret from your OAuth credentials
- **Groq** — API key from console.groq.com

### 4. Run database migrations

```bash
npx prisma generate && npx prisma migrate dev
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
app/
  page.tsx                  # Landing page
  dashboard/
    page.tsx                # Kanban / List / Analytics views
  application/
    [id]/
      page.tsx              # Individual application detail + AI features
  privacy/
    page.tsx                # Privacy policy
  terms/
    page.tsx                # Terms of service
  api/
    trpc/[trpc]/            # tRPC API handler
    auth/                   # Google OAuth endpoints
components/
  ApplicationCard.tsx       # Kanban card component
  KanbanBoard.tsx           # Drag-and-drop board
  ListView.tsx              # Table view
  Analytics.tsx             # Charts and stats
  ApplicationForm.tsx       # Add application modal
  GmailImportModal.tsx      # Gmail import flow
  InterviewCalenderForm.tsx # Calendar sync form
  SearchBar.tsx             # Search/filter
  StatsFooter.tsx           # Summary stats
prisma/
  schema.prisma             # Database schema
  config.ts                 # Prisma config
extension/
  manifest.json             # Extension manifest (MV3)
  popup.html                # Extension popup UI
  popup.js                  # Extension popup logic
  content.js                # Job board data extractor
  privacy-policy.html       # Standalone privacy policy for extension stores
```

---

## Deployment

The app is deployed on Vercel. The build command is:

```bash
prisma generate && next build
```

Make sure all environment variables are added to your Vercel project settings before deploying.

---

## Legal

- [Privacy Policy](https://billet-ng.vercel.app/privacy)
- [Terms of Service](https://billet-ng.vercel.app/terms)

---

## License

MIT — do whatever you want with it.