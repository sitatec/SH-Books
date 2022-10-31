import { Job } from "@shbooks/common";
import { Queue } from "bullmq";

export class JobQueue {
  private static readonly _queues = new Map<string, Queue>();

  async add(job: Job) {
    let jobQueue = JobQueue._queues.get(job.type);
    if (!jobQueue) {
      jobQueue = new Queue(job.type, {
        connection: { host: process.env.REDIS_HOS },
      });
      JobQueue._queues.set(job.type, jobQueue);
    }
    await jobQueue.add(job.type, job.payload, { delay: job.delay });
  }
}
