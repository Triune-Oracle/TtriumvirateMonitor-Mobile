import { router } from './_core/trpc';
import { syncRouter } from './routers/syncRouter';
import { leaseRouter } from './routers/leaseRouter';

export const appRouter = router({
  sync: syncRouter,
  lease: leaseRouter,
});

export type AppRouter = typeof appRouter;
