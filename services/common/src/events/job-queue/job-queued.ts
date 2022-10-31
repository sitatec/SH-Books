import { JsonObject } from "../../types";
import { Event } from "../event";
import { EventChannel } from "../event-channel";

export interface Job {
  type: string;
  data: JsonObject;
}

export class JobQueued implements Event {
  readonly channel = EventChannel.JobQueued;
  constructor(public data: Job) {}
}
