import { Order } from "../../models";
import { Event } from "../event";
import { EventChannel } from "../event-channel";

export class OrderExpired implements Event {
  readonly channel = EventChannel.OrderExpired;
  constructor(public data: Order) {}
}
