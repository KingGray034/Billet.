import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import prisma from "../db";
import {
  analyzeResumeMatch,
  generateInterviewQuestions,
  generateCoverLetterTips,
  analyzeJobPosting,
} from "../services/ai";

// ─── Reusable Schemas ─────────────────────────────────────────────────────────

const applicationIdInput = z.object({ applicationId: z.string() });

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getApplicationOrThrow(id: string, userId: string) {
  const application = await prisma.application.findUnique({
    where: { id },
    include: { company: true },
  });

  if (!application) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  if (application.userId !== userId) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  if (!application.jobDescription) {
    throw new Error("Job description not found");
  }

  return application;
}

async function saveSuggestion(
  applicationId: string,
  type: string,
  content: unknown,
) {
  return prisma.aiSuggestion.create({
    data: {
      applicationId,
      type,
      content: JSON.stringify(content),
    },
  });
}

// ─── Router ───────────────────────────────────────────────────────────────────

const aiRouter = router({
  analyzeResume: protectedProcedure
    .input(
      applicationIdInput.extend({
        resumeText: z.string().min(50, "Resume text is too short"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const application = await getApplicationOrThrow(input.applicationId, ctx.user.userId);
      const analysis = await analyzeResumeMatch(
        input.resumeText,
        application.jobDescription!,
      );
      await saveSuggestion(input.applicationId, "resume_analysis", analysis);
      return analysis;
    }),

  generateQuestions: protectedProcedure
    .input(applicationIdInput)
    .mutation(async ({ input, ctx }) => {
      const application = await getApplicationOrThrow(input.applicationId, ctx.user.userId);
      const questions = await generateInterviewQuestions(
        application.jobDescription!,
        application.position,
      );
      await saveSuggestion(input.applicationId, "interview_questions", questions);
      return questions;
    }),

  generateCoverLetterTips: protectedProcedure
    .input(
      applicationIdInput.extend({
        userBackground: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const application = await getApplicationOrThrow(input.applicationId, ctx.user.userId);
      const tips = await generateCoverLetterTips(
        application.jobDescription!,
        application.position,
        application.company.name,
        input.userBackground,
      );
      await saveSuggestion(input.applicationId, "cover_letter_tips", tips);
      return tips;
    }),

  analyzeJobPosting: protectedProcedure
    .input(z.object({ jobDescription: z.string() }))
    .mutation(({ input }) => analyzeJobPosting(input.jobDescription)),

  deleteSuggestion: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Verify the suggestion belongs to the user via its application
      const suggestion = await prisma.aiSuggestion.findUnique({
        where: { id: input.id },
        include: { application: { select: { userId: true } } },
      });
      if (!suggestion || suggestion.application.userId !== ctx.user.userId) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return prisma.aiSuggestion.delete({ where: { id: input.id } });
    }),

  getSuggestions: protectedProcedure
    .input(applicationIdInput)
    .query(async ({ input, ctx }) => {
      // Verify ownership before returning suggestions
      const app = await prisma.application.findUnique({
        where: { id: input.applicationId },
        select: { userId: true },
      });
      if (!app || app.userId !== ctx.user.userId) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const suggestions = await prisma.aiSuggestion.findMany({
        where: { applicationId: input.applicationId },
        orderBy: { createdAt: "desc" },
      });
      return suggestions.map((s) => ({
        ...s,
        content: JSON.parse(s.content),
      }));
    }),
});

export { aiRouter };