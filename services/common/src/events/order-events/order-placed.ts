import { Order } from "../../models";
import { Event } from "../event";
import { EventChannel } from "../event-channel";

export class OrderPlaced implements Event {
  readonly channel = EventChannel.OrderPlaced;
  constructor(public data: Order) {}
}
