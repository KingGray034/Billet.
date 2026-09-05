import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import prisma from "../db";

const interviewRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        round: z.number().int().positive(),
        scheduledAt: z.date().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Verify the application belongs to this user
      const app = await prisma.application.findUnique({
        where: { id: input.applicationId },
        select: { userId: true },
      });
      if (!app || app.userId !== ctx.user.userId) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return prisma.interview.create({
        data: {
          applicationId: input.applicationId,
          type: `Round ${input.round}`,
          scheduledAt: input.scheduledAt ?? new Date(),
          completed: false,
        },
      });
    }),
});

export { interviewRouter };