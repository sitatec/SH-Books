import { Order } from "../../models";
import { Event } from "../event";
import { EventChannel } from "../event-channel";

export class OrderCanceled implements Event {
  readonly channel = EventChannel.OrderCanceled;
  constructor(public data: Order) {}
}
