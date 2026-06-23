export type JobStatus = "queued" | "processing" | "completed" | "failed";

export interface Job<T = unknown> {
  id: string;
  type: string;
  data: T;
  status: JobStatus;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  error?: string;
  result?: unknown;
}

type JobHandler = (job: Job<any>) => Promise<void>;

const handlers = new Map<string, JobHandler>();
const jobQueue: Job[] = [];
let isProcessing = false;

export function registerJobHandler(type: string, handler: JobHandler): void {
  handlers.set(type, handler);
}

export function enqueueJob<T>(type: string, data: T): Job<T> {
  const job: Job<T> = {
    id: crypto.randomUUID(),
    type,
    data,
    status: "queued",
    createdAt: Date.now(),
  };

  jobQueue.push(job as Job);
  processQueue();
  return job;
}

async function processQueue(): Promise<void> {
  if (isProcessing) return;
  isProcessing = true;

  while (jobQueue.length > 0) {
    const job = jobQueue.shift();
    if (!job) continue;

    const handler = handlers.get(job.type);
    if (!handler) {
      job.status = "failed";
      job.error = `No handler registered for job type: ${job.type}`;
      continue;
    }

    job.status = "processing";
    job.startedAt = Date.now();

    try {
      await handler(job);
      job.status = "completed";
      job.completedAt = Date.now();
    } catch (error) {
      job.status = "failed";
      job.error = error instanceof Error ? error.message : String(error);
      job.completedAt = Date.now();
    }
  }

  isProcessing = false;
}

export function getJobStatus(jobId: string): Job | undefined {
  return jobQueue.find((j) => j.id === jobId);
}
