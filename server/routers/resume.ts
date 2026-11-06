import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import prisma from "../db";

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_RESUMES = 10;
const MAX_CONTENT_LENGTH = 20000;

// ─── Reusable Schemas ─────────────────────────────────────────────────────────

const labelSchema = z.string().trim().min(1, "Give this resume a name").max(40);

const contentSchema = z
  .string()
  .trim()
  .min(50, "Resume text is too short")
  .max(MAX_CONTENT_LENGTH, "Resume text is too long");

const fileNameSchema = z.string().max(200).optional();

const resumeSelect = {
  id: true,
  label: true,
  fileName: true,
  createdAt: true,
  updatedAt: true,
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getOwnedResumeOrThrow(id: string, userId: string) {
  const resume = await prisma.resume.findFirst({
    where: { id, userId },
    select: { id: true, label: true },
  });

  if (!resume) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Resume not found" });
  }

  return resume;
}

async function assertLabelAvailable(
  userId: string,
  label: string,
  ignoreId?: string,
) {
  const existing = await prisma.resume.findFirst({
    where: { userId, label },
    select: { id: true },
  });

  if (existing && existing.id !== ignoreId) {
    throw new TRPCError({
      code: "CONFLICT",
      message: `You already have a resume named "${label}". Use Replace on it instead.`,
    });
  }
}

// ─── Router ───────────────────────────────────────────────────────────────────

const resumeRouter = router({
  list: protectedProcedure.query(({ ctx }) =>
    prisma.resume.findMany({
      where: { userId: ctx.user.userId },
      orderBy: { updatedAt: "desc" },
      select: resumeSelect,
    }),
  ),

  create: protectedProcedure
    .input(
      z.object({
        label: labelSchema,
        content: contentSchema,
        fileName: fileNameSchema,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const count = await prisma.resume.count({
        where: { userId: ctx.user.userId },
      });

      if (count >= MAX_RESUMES) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `You can save up to ${MAX_RESUMES} resumes. Delete one to add another.`,
        });
      }

      await assertLabelAvailable(ctx.user.userId, input.label);

      return prisma.resume.create({
        data: { ...input, userId: ctx.user.userId },
        select: resumeSelect,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        label: labelSchema.optional(),
        content: contentSchema.optional(),
        fileName: fileNameSchema,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      await getOwnedResumeOrThrow(id, ctx.user.userId);

      if (data.label) {
        await assertLabelAvailable(ctx.user.userId, data.label, id);
      }

      return prisma.resume.update({
        where: { id },
        data,
        select: resumeSelect,
      });
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await getOwnedResumeOrThrow(input.id, ctx.user.userId);
      await prisma.resume.delete({ where: { id: input.id } });
      return { id: input.id };
    }),
});

export { resumeRouter };
