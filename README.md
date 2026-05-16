# BILLET.

> AI-powered job application tracker with a retro editorial aesthetic.

Billet helps you run your job search like an operation — track every application through a visual Kanban pipeline, prep for interviews with AI-generated questions, analyse your resume against job descriptions, and pull emails straight from Gmail. No spreadsheets. No chaos.

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

Create a `.env` file in the root:

```env
# Database
DATABASE_URL="your-supabase-session-pooler-url"
DIRECT_URL="your-supabase-direct-url"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Groq AI
GROQ_API_KEY="your-groq-api-key"
```

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
```

---

## Deployment

The app is deployed on Vercel. The build command is:

```bash
prisma generate && next build
```

Make sure all environment variables from `.env` are added to your Vercel project settings before deploying.

---

## Browser Extension

The companion extension supports Firefox and Edge. It auto-fills application details from major job boards into Billet with one click.

Source lives in `/extension`. To load it locally:

1. Go to `about:debugging` (Firefox) or `edge://extensions` (Edge)
2. Enable Developer Mode
3. Load Unpacked → select the `/extension` folder

---

## License

MIT — do whatever you want with it.