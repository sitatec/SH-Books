import { Order } from "../../models";
import { Event } from "../event";
import { EventChannel } from "../event-channel";

export class OrderReservationTimeElapsed implements Event {
  readonly channel = EventChannel.OrderReservationTimeElapsed;
  constructor(public data: Order) {}
}
