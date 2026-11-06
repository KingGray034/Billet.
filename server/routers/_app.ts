import { router } from "../trpc";
import { applicationRouter } from "./application";
import { aiRouter } from "./ai";
import { integrationsRouter } from "./integrations";
import { interviewRouter } from "./interview";
import { resumeRouter } from "./resume";

const appRouter = router({
  application: applicationRouter,
  ai: aiRouter,
  integrations: integrationsRouter,
  interview: interviewRouter,
  resume: resumeRouter,
});

type AppRouter = typeof appRouter;

export { appRouter };
export type { AppRouter };
