import { z } from 'zod';
import { router, procedure } from '../_core/trpc';
import { pool } from '../db/pool';
import { ExecutionLeaseManager } from '../services/ExecutionLeaseManager';

const leaseManager = new ExecutionLeaseManager(pool);

export const leaseRouter = router({
  acquire: procedure
    .input(
      z.object({
        proposalId: z.string().min(1),
        acquiredBy: z.string().min(1),
        durationHours: z.number().int().positive().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const lease = await leaseManager.acquireLease(
        input.proposalId,
        input.acquiredBy,
        input.durationHours
      );
      return { success: true, lease };
    }),

  release: procedure
    .input(z.object({ proposalId: z.string().min(1) }))
    .mutation(async ({ input }) => {
      await leaseManager.releaseLease(input.proposalId);
      return { success: true };
    }),

  status: procedure
    .input(z.object({ proposalId: z.string().min(1) }))
    .query(async ({ input }) => {
      return leaseManager.getLeaseStatus(input.proposalId);
    }),

  listActive: procedure.query(async () => {
    const { listActiveLeases } = await import('../db');
    return listActiveLeases(pool);
  }),

  listExpiring: procedure.query(async () => {
    const { getWarningLeases } = await import('../db');
    return getWarningLeases(pool);
  }),
});
