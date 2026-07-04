import { describe, it, expect } from "vitest";
import { summarizeJobStatusCounts, summarizeWorkerHealth } from "../src/utils/metrics.js";

describe("metrics helpers", () => {
  it("summarizes job statuses into a count map", () => {
    const summary = summarizeJobStatusCounts([
      { status: "queued", count: 3 },
      { status: "completed", count: 8 },
    ]);

    expect(summary).toEqual({ queued: 3, completed: 8 });
  });

  it("summarizes worker health counts", () => {
    const summary = summarizeWorkerHealth([{ is_healthy: true }, { is_healthy: false }, { is_healthy: true }]);

    expect(summary).toEqual({ healthyWorkers: 2, staleWorkers: 1 });
  });
});
