export interface JobStatusCountRow {
  status: string;
  count: number;
}

export interface WorkerHealthRow {
  is_healthy?: boolean | string;
}

export function summarizeJobStatusCounts(rows: JobStatusCountRow[]): Record<string, number> {
  return rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = Number(row.count);
    return acc;
  }, {});
}

export function summarizeWorkerHealth(rows: WorkerHealthRow[]): { healthyWorkers: number; staleWorkers: number } {
  const healthyWorkers = rows.filter((row) => row.is_healthy === true || row.is_healthy === "true").length;
  return { healthyWorkers, staleWorkers: rows.length - healthyWorkers };
}
