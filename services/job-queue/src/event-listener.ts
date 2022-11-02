import {
  EventChannel,
  EventListener,
  Job,
  JobQueued,
  NatsClientWrapper,
} from "@shbooks/common";
import { JobQueue } from "./job-queue";

export class JobEventListener extends EventListener<JobQueued> {
  constructor(natsClient: NatsClientWrapper, private jobQueue: JobQueue) {
    super(natsClient.natsClient, EventChannel.JobQueued, "job-queue");
  }

  async onData(job: Job, ack: () => void) {
    await this.jobQueue.add(job);
    ack();
  }
}
