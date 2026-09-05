import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError, z } from "zod";
import SuperJSON from "superjson";
import { getCurrentUser } from "@/server/auth";

const t = initTRPC.create({
  transformer: SuperJSON,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? z.treeifyError(error.cause) : null,
      },
    };
  },
});

// ─── Auth middleware ───────────────────────────────────────────────────────────

const isAuthed = t.middleware(async ({ next }) => {
  const user = await getCurrentUser();
  if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx: { user } });
});

// ─── Exports ──────────────────────────────────────────────────────────────────

export const router = t.router;

// No auth required, use sparingly
export const publicProcedure = t.procedure;

// Auth required, use for all application/interview/ai data
export const protectedProcedure = t.procedure.use(isAuthed);