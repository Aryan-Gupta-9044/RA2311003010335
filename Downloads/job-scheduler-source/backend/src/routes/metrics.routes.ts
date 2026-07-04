import { Router } from "express";
import { pool } from "../db/pool.js";
import { asyncHandler } from "../utils/errors.js";
import { requireAuth } from "../middleware/auth.js";
import { summarizeJobStatusCounts, summarizeWorkerHealth } from "../utils/metrics.js";

export const metricsRouter = Router();
metricsRouter.use(requireAuth);

metricsRouter.get(
  "/metrics",
  asyncHandler(async (_req, res) => {
    const [orgs, projects, queues, jobs, workers, dlq] = await Promise.all([
      pool.query(`SELECT count(*)::int AS count FROM organizations`),
      pool.query(`SELECT count(*)::int AS count FROM projects`),
      pool.query(`SELECT count(*)::int AS count FROM queues`),
      pool.query(`SELECT status, count(*)::int AS count FROM jobs GROUP BY status`),
      pool.query(`SELECT id, last_seen_at, (now() - last_seen_at) < interval '20 seconds' AS is_healthy FROM workers`),
      pool.query(`SELECT count(*)::int AS count FROM dead_letter_queue`),
    ]);

    const jobStatuses = summarizeJobStatusCounts(jobs.rows);
    const workerHealth = summarizeWorkerHealth(workers.rows);

    res.json({
      data: {
        counts: {
          organizations: orgs.rows[0].count,
          projects: projects.rows[0].count,
          queues: queues.rows[0].count,
          jobs: jobs.rows.reduce((sum: number, row: any) => sum + Number(row.count), 0),
          workers: workers.rows.length,
          deadLetters: dlq.rows[0].count,
        },
        jobStatuses,
        workerHealth,
      },
    });
  })
);
