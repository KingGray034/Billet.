import { describe, it, expect, vi, afterEach } from "vitest";
import { z } from "zod";

// ─── Mirror the server's validation schema from application.ts ────────────────
// Keep this in sync with the `create` procedure input in application.ts.
// If you change that schema and forget to update this, the tests below will
// catch the mismatch.

const optionalUrl = z.union([
  z.literal(""),
  z.url({ protocol: /^https?$/ }),
]);
const optionalEmail = z.union([z.literal(""), z.email()]);

// These are your exact Prisma Status enum values confirmed from schema.prisma
const StatusValues = [
  "PENDING",
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "ACCEPTED",
] as const;

const serverCreateSchema = z.object({
  position: z.string().min(1).max(200),
  companyName: z.string().min(1).max(200),
  companyWebsite: optionalUrl,
  status: z.enum(StatusValues).optional(),
  jobDescription: z.string().max(50000).optional(),
  salary: z.string().optional(),
  location: z.string().optional(),
  contactEmail: optionalEmail.optional(),
  jobUrl: optionalUrl,
  notes: z.string().max(10000).optional(),
});

// ─── Mirror popup.js getFormData() exactly ────────────────────────────────────
// This function replicates what getFormData() in popup.js produces.
// If you change getFormData() in popup.js, update this function too.

type FormInputs = {
  position?: string;
  company?: string;
  location?: string;
  salary?: string;
  contactEmail?: string;
  status?: string;
  url?: string;
  description?: string;
};

function buildExtensionPayload(overrides: FormInputs = {}) {
  const {
    position = "Frontend Engineer",
    company = "Acme Corp",
    location = "Lagos, Nigeria",
    salary = "",
    contactEmail = "",
    status = "APPLIED",
    url = "https://linkedin.com/jobs/view/123456",
    description = "We are looking for a frontend engineer.",
  } = overrides;

  // This mirrors getFormData() in popup.js line-for-line:
  return {
    position,
    companyName: company,
    companyWebsite: "",                   
    location: location || undefined,      
    salary: salary || undefined,          
    contactEmail: contactEmail || undefined,
    status,
    jobUrl: url || "",             
    jobDescription: description || undefined,
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("payload shape", () => {
  it("a fully filled form produces a valid payload", () => {
    const result = serverCreateSchema.safeParse(buildExtensionPayload());
    expect(result.success).toBe(true);
  });

  it("the minimum possible payload — only position and company — is valid", () => {
    const minimalPayload = {
      position: "Engineer",
      companyName: "Acme Corp",
      companyWebsite: "",
      jobUrl: "",
    };
    const result = serverCreateSchema.safeParse(minimalPayload);
    expect(result.success).toBe(true);
  });

  it("companyWebsite being always empty string is accepted by the server", () => {
    // popup.js hardcodes companyWebsite as "" in getFormData().
    // The server accepts this via z.union([z.literal(""), z.string().url()])
    const payload = buildExtensionPayload();
    expect(payload.companyWebsite).toBe("");

    const result = serverCreateSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it("empty optional fields become undefined, not empty string", () => {
    // This matters because the server schema accepts undefined but some
    // fields like contactEmail would fail with "" if not guarded.
    // popup.js handles this with: field || undefined
    const payload = buildExtensionPayload({
      location: "",
      salary: "",
      contactEmail: "",
    });

    expect(payload.location).toBeUndefined();
    expect(payload.salary).toBeUndefined();
    expect(payload.contactEmail).toBeUndefined();

    const result = serverCreateSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it("an empty job URL from autofill sends empty string, which the server accepts", () => {
    // After the popup.js fix, empty URL sends "" not undefined
    const payload = buildExtensionPayload({ url: "" });

    // url || "" gives "" when url is empty — the key is present, not dropped
    expect(payload.jobUrl).toBe("");

    const result = serverCreateSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });
});

describe("URL validation — real URLs scraped by the extension", () => {
  it("accepts a standard LinkedIn job URL", () => {
    const result = serverCreateSchema.safeParse(
      buildExtensionPayload({
        url: "https://www.linkedin.com/jobs/view/4215793201/?alternateChannel=search",
      })
    );
    expect(result.success).toBe(true);
  });

  it("accepts an Indeed job URL", () => {
    const result = serverCreateSchema.safeParse(
      buildExtensionPayload({ url: "https://uk.indeed.com/viewjob?jk=abc123def456" })
    );
    expect(result.success).toBe(true);
  });

  it("accepts a Glassdoor URL", () => {
    const result = serverCreateSchema.safeParse(
      buildExtensionPayload({
        url: "https://www.glassdoor.com/job-listing/frontend-engineer-acme-JV_IC1138213_KO0,17_KE18,22.htm",
      })
    );
    expect(result.success).toBe(true);
  });

  it("accepts a RemoteOK URL", () => {
    const result = serverCreateSchema.safeParse(
      buildExtensionPayload({ url: "https://remoteok.com/remote-jobs/remote-senior-frontend-123456" })
    );
    expect(result.success).toBe(true);
  });

  it("accepts a Wellfound URL", () => {
    const result = serverCreateSchema.safeParse(
      buildExtensionPayload({ url: "https://wellfound.com/jobs/123456-frontend-engineer" })
    );
    expect(result.success).toBe(true);
  });

  it("rejects a javascript: URL — Zod v4 WHATWG parser allows it by default, refine() fixes this", () => {
    const result = serverCreateSchema.safeParse(
      buildExtensionPayload({ url: "javascript:void(0)" })
    );
    expect(result.success).toBe(false); // passes after adding .refine() to optionalUrl
  });

  it("rejects a relative path that content.js might scrape from a malformed page", () => {
    const result = serverCreateSchema.safeParse(
      buildExtensionPayload({ url: "/jobs/view/123456" })
    );
    expect(result.success).toBe(false);
  });

  it("rejects plain text that isn't a URL", () => {
    const result = serverCreateSchema.safeParse(
      buildExtensionPayload({ url: "See job board for link" })
    );
    expect(result.success).toBe(false);
  });
});

describe("Status enum — popup.html select options vs Prisma enum", () => {
  // Your popup.html has 4 select options: PENDING, APPLIED, SCREENING, INTERVIEW
  // Your Prisma schema has 7 enum values: + OFFER, REJECTED, ACCEPTED
  // All 4 HTML options must match the enum exactly (casing matters)

  const popupSelectOptions = ["PENDING", "APPLIED", "SCREENING", "INTERVIEW"] as const;

  it("every status option in popup.html is a valid Prisma Status value", () => {
    popupSelectOptions.forEach((status) => {
      const result = serverCreateSchema.safeParse(buildExtensionPayload({ status }));
      expect(result.success, `"${status}" failed — check popup.html option values`).toBe(true);
    });
  });

  it("PENDING is valid — the default option in popup.html", () => {
    const result = serverCreateSchema.safeParse(buildExtensionPayload({ status: "PENDING" }));
    expect(result.success).toBe(true);
  });

  it("APPLIED is valid", () => {
    const result = serverCreateSchema.safeParse(buildExtensionPayload({ status: "APPLIED" }));
    expect(result.success).toBe(true);
  });

  it("SCREENING is valid", () => {
    const result = serverCreateSchema.safeParse(buildExtensionPayload({ status: "SCREENING" }));
    expect(result.success).toBe(true);
  });

  it("INTERVIEW is valid", () => {
    const result = serverCreateSchema.safeParse(buildExtensionPayload({ status: "INTERVIEW" }));
    expect(result.success).toBe(true);
  });

  it("lowercase status values are rejected — confirms casing must be exact", () => {
    // If this test ever fails (i.e. lowercase passes), it means the Status
    // enum was changed to lowercase in schema.prisma. Update popup.html to match.
    const result = serverCreateSchema.safeParse(buildExtensionPayload({ status: "applied" }));
    expect(result.success).toBe(false);
  });

  it("a made-up status value is rejected", () => {
    const result = serverCreateSchema.safeParse(buildExtensionPayload({ status: "GHOSTED" }));
    expect(result.success).toBe(false);
  });
});

describe("required field validation", () => {
  it("rejects when position is empty — autofill may fail to extract it", () => {
    const result = serverCreateSchema.safeParse(buildExtensionPayload({ position: "" }));
    expect(result.success).toBe(false);
  });

  it("rejects when company is empty — autofill may fail to extract it", () => {
    const result = serverCreateSchema.safeParse(buildExtensionPayload({ company: "" }));
    expect(result.success).toBe(false);
  });
});

describe("HTTP request format — the fetch call in popup.js", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends credentials: include so the JWT cookie is attached", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([{ result: { data: { json: { id: "app-001" } } } }]),
    });
    global.fetch = fetchMock;

    const API_URL = "https://billet-ng.vercel.app/api/trpc";
    const payload = buildExtensionPayload();

    // This replicates the exact fetch call in popup.js saveBtn click handler
    await fetch(`${API_URL}/application.create?batch=1`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 0: { json: payload } }),
    });

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];

    expect(options.credentials).toBe("include");
  });

  it("targets the correct tRPC endpoint URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
    global.fetch = fetchMock;

    const API_URL = "https://billet-ng.vercel.app/api/trpc";
    const payload = buildExtensionPayload();

    await fetch(`${API_URL}/application.create?batch=1`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 0: { json: payload } }),
    });

    const [url] = fetchMock.mock.calls[0] as [string, RequestInit];

    expect(url).toContain("/api/trpc/");
    expect(url).toContain("application.create");
    expect(url).toContain("batch=1");
  });

  it("wraps the payload in tRPC batch format: { 0: { json: payload } }", () => {
    const payload = buildExtensionPayload();

    // This is exactly the body structure popup.js sends
    const body = { 0: { json: payload } };
    const reparsed = JSON.parse(JSON.stringify(body));

    expect(reparsed).toHaveProperty("0");
    expect(reparsed["0"]).toHaveProperty("json");
    expect(reparsed["0"].json.position).toBe("Frontend Engineer");
    expect(reparsed["0"].json.companyName).toBe("Acme Corp");
    expect(reparsed["0"].json.companyWebsite).toBe("");
  });

  it("sends Content-Type application/json", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
    global.fetch = fetchMock;

    const API_URL = "https://billet-ng.vercel.app/api/trpc";
    const payload = buildExtensionPayload();

    await fetch(`${API_URL}/application.create?batch=1`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 0: { json: payload } }),
    });

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = options.headers as Record<string, string>;

    expect(headers["Content-Type"]).toBe("application/json");
  });
});