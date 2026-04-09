import { z } from 'zod';
import { router, procedure } from '../_core/trpc';
import * as db from '../db';

const statusEnum = z.enum(['initiated', 'syncing', 'completed', 'failed']);

export const syncRouter = router({
  recordHistory: procedure
    .input(
      z.object({
        capsuleId: z.number().int().positive(),
        sourcePlatform: z.string().min(1),
        targetPlatform: z.string().min(1),
        plvMetric: z.string().optional(),
        status: statusEnum,
        errorMessage: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const record = await db.recordSyncHistory({
        capsuleId: input.capsuleId,
        sourcePlatform: input.sourcePlatform,
        targetPlatform: input.targetPlatform,
        plvMetric: input.plvMetric ?? null,
        status: input.status,
        errorMessage: input.errorMessage ?? null,
      });
      return { success: true, record };
    }),

  getHistory: procedure
    .input(z.object({ capsuleId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const history = await db.getSyncHistoryByCapsule(input.capsuleId);
      return {
        total: history.length,
        history: history.map((h) => ({
          id: h.id,
          capsuleId: h.capsuleId,
          sourcePlatform: h.sourcePlatform,
          targetPlatform: h.targetPlatform,
          plvMetric: h.plvMetric,
          status: h.status,
          errorMessage: h.errorMessage,
          timestamp: h.timestamp,
        })),
      };
    }),

  getMetrics: procedure
    .input(z.object({ capsuleId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const history = await db.getSyncHistoryByCapsule(input.capsuleId);
      const totalSyncs = history.length;
      const successfulSyncs = history.filter((h) => h.status === 'completed').length;
      const failedSyncs = history.filter((h) => h.status === 'failed').length;
      const successRate = totalSyncs > 0 ? successfulSyncs / totalSyncs : 0;

      const plvValues = history
        .map((h) => (h.plvMetric ? parseFloat(h.plvMetric) : null))
        .filter((v): v is number => v !== null && !isNaN(v));

      const averagePLV =
        plvValues.length > 0
          ? plvValues.reduce((a, b) => a + b, 0) / plvValues.length
          : 0;

      let entrainmentStatus: 'OPTIMAL' | 'GOOD' | 'DEGRADED';
      if (averagePLV > 0.9) {
        entrainmentStatus = 'OPTIMAL';
      } else if (averagePLV > 0.7) {
        entrainmentStatus = 'GOOD';
      } else {
        entrainmentStatus = 'DEGRADED';
      }

      return {
        totalSyncs,
        successfulSyncs,
        failedSyncs,
        successRate,
        averagePLV,
        plvMetrics: plvValues,
        entrainmentStatus,
      };
    }),

  getAuditTrail: procedure
    .input(z.object({ capsuleId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const history = await db.getSyncHistoryByCapsule(input.capsuleId);
      const sorted = [...history].sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      );
      return {
        capsuleId: input.capsuleId,
        total: sorted.length,
        entries: sorted.map((h, idx) => ({
          sequence: idx + 1,
          id: h.id,
          timestamp: h.timestamp,
          event: `SYNC_${h.status.toUpperCase()}`,
          description: `${h.sourcePlatform} → ${h.targetPlatform}: ${h.status}`,
          entrainmentDetail: h.plvMetric ? `PLV=${h.plvMetric}` : null,
          errorMessage: h.errorMessage,
        })),
      };
    }),
});
