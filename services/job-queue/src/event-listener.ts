import {
  EventChannel,
  EventListener as BaseEventListener,
  Job,
  JobQueued,
  NatsClientWrapper,
} from "@shbooks/common";
import { JobQueue } from "./job-queue";

export class EventListener extends BaseEventListener<JobQueued> {
  constructor(natsClient: NatsClientWrapper, private jobQueue: JobQueue) {
    super(natsClient.natsClient, EventChannel.JobQueued, "job-queue");
  }

  async onData(job: Job, ack: () => void) {
    await this.jobQueue.add(job);
    ack();
  }
}
