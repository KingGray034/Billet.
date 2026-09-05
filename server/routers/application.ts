import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import prisma from "../db";
import { Status } from "@prisma/client";

// ─── Constants ────────────────────────────────────────────────────────────────

const StatusValues = Object.values(Status) as [Status, ...Status[]];

const optionalUrl = z.union([z.literal(""), z.string().url()]);
const optionalEmail = z.union([z.literal(""), z.string().email()]);
const applicationId = z.object({ id: z.string() });

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function verifyOwnership(applicationId: string, userId: string) {
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { userId: true },
  });
  if (!app || app.userId !== userId) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
}

// ─── Router ───────────────────────────────────────────────────────────────────

const applicationRouter = router({
  getAll: protectedProcedure.query(({ ctx }) =>
    prisma.application.findMany({
      where: { userId: ctx.user.userId },
      include: {
        company: true,
        interviews: true,
        _count: { select: { documents: true, aiSuggestions: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ),

  getById: protectedProcedure.input(applicationId).query(async ({ input, ctx }) => {
    const app = await prisma.application.findUnique({
      where: { id: input.id },
      include: {
        company: true,
        interviews: true,
        documents: true,
        aiSuggestions: true,
      },
    });
    if (!app || app.userId !== ctx.user.userId) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    return app;
  }),

  create: protectedProcedure
    .input(
      z.object({
        position: z.string().min(1, "Position is required").max(200),
        companyName: z.string().min(1, "Company name is required").max(200),
        companyWebsite: optionalUrl,
        status: z.enum(StatusValues).optional(),
        jobDescription: z.string().max(50000).optional(),
        salary: z.string().optional(),
        location: z.string().optional(),
        contactEmail: optionalEmail.optional(),
        jobUrl: optionalUrl,
        notes: z.string().max(10000).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const company = await prisma.company.upsert({
        where: { name: input.companyName },
        update: { website: input.companyWebsite || undefined },
        create: {
          name: input.companyName,
          website: input.companyWebsite || undefined,
          userId: ctx.user.userId,
        },
      });

      return prisma.application.create({
        data: {
          position: input.position,
          companyId: company.id,
          userId: ctx.user.userId,
          status: input.status ?? Status.PENDING,
          jobDescription: input.jobDescription,
          salary: input.salary,
          location: input.location,
          contactEmail: input.contactEmail || undefined,
          jobUrl: input.jobUrl,
          notes: input.notes,
        },
        include: { company: true },
      });
    }),

  updateStatus: protectedProcedure
    .input(z.object({ id: z.string(), status: z.enum(StatusValues) }))
    .mutation(async ({ input, ctx }) => {
      await verifyOwnership(input.id, ctx.user.userId);
      return prisma.application.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        position: z.string().max(200).optional(),
        status: z.enum(StatusValues).optional(),
        jobDescription: z.string().max(50000).optional(),
        salary: z.string().optional(),
        location: z.string().optional(),
        contactEmail: z.string().email().optional(),
        jobUrl: z.string().url().optional(),
        notes: z.string().max(10000).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await verifyOwnership(input.id, ctx.user.userId);
      const { id, ...data } = input;
      return prisma.application.update({ where: { id }, data });
    }),

  delete: protectedProcedure
    .input(applicationId)
    .mutation(async ({ input, ctx }) => {
      await verifyOwnership(input.id, ctx.user.userId);
      return prisma.application.delete({ where: { id: input.id } });
    }),

  getByStatus: protectedProcedure.query(async ({ ctx }) => {
    const applications = await prisma.application.findMany({
      where: { userId: ctx.user.userId },
      include: {
        company: true,
        interviews: {
          where: { completed: false },
          orderBy: { scheduledAt: "asc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return Object.fromEntries(
      StatusValues.map((status) => [
        status,
        applications.filter((app) => app.status === status),
      ]),
    ) as Record<Status, typeof applications>;
  }),
});

export { applicationRouter };