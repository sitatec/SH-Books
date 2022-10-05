import { JsonObject } from "../types";
import { EventChannel } from "./event-channel";

export interface Event {
  channel: EventChannel;
  data: JsonObject;
}
