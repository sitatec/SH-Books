import { Payment } from "../../models/payment";
import { Event } from "../event";
import { EventChannel } from "../event-channel";

export class PaymentMade implements Event {
  readonly channel = EventChannel.PaymentMade;
  constructor(public data: Payment) {}
}
