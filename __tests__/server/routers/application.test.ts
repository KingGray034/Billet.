import { describe, it, expect, vi, beforeEach } from "vitest";
import { TRPCError } from "@trpc/server";

// ─── Mocks ────────────────────────────────────────────────────────────────────
// These MUST be at the top before any other imports.
// Vitest hoists vi.mock() calls so they run before module loading —
// this prevents server/db.ts from trying to connect to a real database
// and prevents server/auth.ts from calling next/headers in a test env.

vi.mock("@/server/db", () => ({
  default: {
    application: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    company: {
      upsert: vi.fn(),
    },
  },
}));

vi.mock("@/server/auth", () => ({
  getCurrentUser: vi.fn(),
}));

// ─── Imports (after mocks) ────────────────────────────────────────────────────

import { applicationRouter } from "@/server/routers/application";
import { getCurrentUser } from "@/server/auth";
import prisma from "@/server/db";
import { createCallerFactory } from "@/server/trpc";

// ─── Shared test data ─────────────────────────────────────────────────────────

const MOCK_USER = {
  userId: "user-abc-123",
  email: "dennis@example.com",
  name: "Dennis",
};

const MOCK_COMPANY = {
  id: "company-xyz",
  name: "Acme Corp",
  website: null,
  industry: null,
  notes: null,
  isDemo: false,
  userId: "user-abc-123",
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

const MOCK_APPLICATION = {
  id: "app-xyz-001",
  position: "Frontend Engineer",
  companyId: "company-xyz",
  userId: "user-abc-123",
  status: "PENDING" as const,
  jobDescription: null,
  salary: null,
  location: null,
  contactEmail: null,
  jobUrl: null,
  notes: null,
  resumeVersion: null,
  coverLetter: null,
  isDemo: false,
  dateApplied: new Date("2026-01-01"),
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
  company: MOCK_COMPANY,
};

// ─── Setup ────────────────────────────────────────────────────────────────────

const createCaller = createCallerFactory(applicationRouter);

// beforeEach runs before every single test — clears all mock state so
// one test's mock return value doesn't leak into the next test
beforeEach(() => {
  vi.clearAllMocks();
  // Default state: user is authenticated. Individual tests override this where needed.
  vi.mocked(getCurrentUser).mockResolvedValue(MOCK_USER);
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("applicationRouter.create", () => {
  // ── Happy paths ─────────────────────────────────────────────────────────────

  it("creates an application with only the required fields", async () => {
    vi.mocked(prisma.company.upsert).mockResolvedValue(MOCK_COMPANY);
    vi.mocked(prisma.application.create).mockResolvedValue(MOCK_APPLICATION);

    const caller = createCaller({});

    const result = await caller.create({
      position: "Frontend Engineer",
      companyName: "Acme Corp",
      companyWebsite: "", // extension always sends empty string for this
      jobUrl: "",         // extension sends empty string when the field is blank
    });

    expect(result.id).toBe("app-xyz-001");
    expect(result.position).toBe("Frontend Engineer");
  });

  it("upserts the company using the name from the form", async () => {
    vi.mocked(prisma.company.upsert).mockResolvedValue(MOCK_COMPANY);
    vi.mocked(prisma.application.create).mockResolvedValue(MOCK_APPLICATION);

    const caller = createCaller({});

    await caller.create({
      position: "Frontend Engineer",
      companyName: "Acme Corp",
      companyWebsite: "",
      jobUrl: "",
    });

    expect(prisma.company.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { name: "Acme Corp" },
        create: expect.objectContaining({
          name: "Acme Corp",
          userId: "user-abc-123", // comes from the JWT session, not the form
        }),
      })
    );
  });

  it("writes the authenticated user's id onto the application row", async () => {
    vi.mocked(prisma.company.upsert).mockResolvedValue(MOCK_COMPANY);
    vi.mocked(prisma.application.create).mockResolvedValue(MOCK_APPLICATION);

    const caller = createCaller({});

    await caller.create({
      position: "Frontend Engineer",
      companyName: "Acme Corp",
      companyWebsite: "",
      jobUrl: "",
    });

    expect(prisma.application.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "user-abc-123",
        }),
      })
    );
  });

  it("defaults status to PENDING when the form doesn't send one", async () => {
    vi.mocked(prisma.company.upsert).mockResolvedValue(MOCK_COMPANY);
    vi.mocked(prisma.application.create).mockResolvedValue(MOCK_APPLICATION);

    const caller = createCaller({});

    await caller.create({
      position: "Frontend Engineer",
      companyName: "Acme Corp",
      companyWebsite: "",
      jobUrl: "",
      // no status field
    });

    expect(prisma.application.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: "PENDING",
        }),
      })
    );
  });

  it("creates with all optional fields when the form is fully filled", async () => {
    const fullApplication = {
      ...MOCK_APPLICATION,
      status: "APPLIED" as const,
      salary: "₦800,000/month",
      location: "Lagos, Nigeria",
      jobUrl: "https://linkedin.com/jobs/view/123456",
      jobDescription: "We are looking for a senior engineer...",
    };

    vi.mocked(prisma.company.upsert).mockResolvedValue(MOCK_COMPANY);
    vi.mocked(prisma.application.create).mockResolvedValue(fullApplication);

    const caller = createCaller({});

    await caller.create({
      position: "Senior Frontend Engineer",
      companyName: "Acme Corp",
      companyWebsite: "",
      status: "APPLIED",
      salary: "₦800,000/month",
      location: "Lagos, Nigeria",
      jobUrl: "https://linkedin.com/jobs/view/123456",
      jobDescription: "We are looking for a senior engineer...",
    });

    expect(prisma.application.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: "APPLIED",
          salary: "₦800,000/month",
          location: "Lagos, Nigeria",
        }),
      })
    );
  });

  // ── Auth failures ────────────────────────────────────────────────────────────

  it("throws UNAUTHORIZED when there is no session cookie", async () => {
    // Override the default mock — user is NOT logged in
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    const caller = createCaller({});

    await expect(
      caller.create({
        position: "Frontend Engineer",
        companyName: "Acme Corp",
        companyWebsite: "",
        jobUrl: "",
      })
    ).rejects.toThrow(TRPCError);

    // Nothing should have been written to the database
    expect(prisma.company.upsert).not.toHaveBeenCalled();
    expect(prisma.application.create).not.toHaveBeenCalled();
  });

  it("throws UNAUTHORIZED when the JWT is expired or invalid", async () => {
    // getCurrentUser returns null when jwtVerify fails (see auth.ts catch block)
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    const caller = createCaller({});

    await expect(
      caller.create({
        position: "Frontend Engineer",
        companyName: "Acme Corp",
        companyWebsite: "",
        jobUrl: "",
      })
    ).rejects.toThrow(TRPCError);

    expect(prisma.application.create).not.toHaveBeenCalled();
  });

  // ── Validation failures ──────────────────────────────────────────────────────

  it("rejects when position is an empty string", async () => {
    const caller = createCaller({});

    await expect(
      caller.create({
        position: "",
        companyName: "Acme Corp",
        companyWebsite: "",
        jobUrl: "",
      })
    ).rejects.toThrow();

    expect(prisma.application.create).not.toHaveBeenCalled();
  });

  it("rejects when company name is an empty string", async () => {
    const caller = createCaller({});

    await expect(
      caller.create({
        position: "Frontend Engineer",
        companyName: "",
        companyWebsite: "",
        jobUrl: "",
      })
    ).rejects.toThrow();

    expect(prisma.application.create).not.toHaveBeenCalled();
  });

  it("rejects a job URL that is not a valid URL and not an empty string", async () => {
    const caller = createCaller({});

    await expect(
      caller.create({
        position: "Frontend Engineer",
        companyName: "Acme Corp",
        companyWebsite: "",
        jobUrl: "not-a-real-url",
      })
    ).rejects.toThrow();

    expect(prisma.application.create).not.toHaveBeenCalled();
  });

  it("rejects a status value that doesn't exist in the Prisma enum", async () => {
    const caller = createCaller({});

    await expect(
      caller.create({
        position: "Frontend Engineer",
        companyName: "Acme Corp",
        companyWebsite: "",
        jobUrl: "",
        status: "GHOST" as any, // not a real Status value
      })
    ).rejects.toThrow();

    expect(prisma.application.create).not.toHaveBeenCalled();
  });
});