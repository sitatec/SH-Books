import { JobType } from "@shbooks/common";
import { Worker } from "bullmq";
import { publishEvent } from "./event-publisher";

export class ScheduledEventsPublisher {
  private _initialized = false;

  init() {
    if (!this._initialized) {
      new Worker(
        JobType.ScheduleEvent,
        async (job) => {
         await publishEvent(job.data);
        },
        {
          connection: {
            host: process.env.REDIS_HOST,
          },
        }
      );

      this._initialized = true;
    }
  }
}
