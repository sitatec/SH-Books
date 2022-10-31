import { JsonObject } from "../../types";
import { Event } from "../event";
import { EventChannel } from "../event-channel";

export enum JobType {
  ScheduleEvent = "schedule-event",
  SendEmail = "send-email",
  DetectUnrelatedImage = "detect-unrelated-image",
}

export interface Job {
  type: JobType;
  processAt?: Date;
  payload: JsonObject;
}

export class JobQueued implements Event {
  readonly channel = EventChannel.JobQueued;
  constructor(public data: Job) {}
}
