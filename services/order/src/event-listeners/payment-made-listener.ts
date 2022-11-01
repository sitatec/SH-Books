import {
  EventChannel,
  EventListener,
  NatsClientWrapper,
  OrderStatus,
  PaymentMade,
} from "@shbooks/common";
import { Payment } from "@shbooks/common/lib/models/payment";
import OrderCollection from "../models/order";
import { EVENTS_QUEUE_GROUP_NAME } from "./common";

export class PaymentMadeListener extends EventListener<PaymentMade> {
  constructor(natsClient: NatsClientWrapper) {
    super(
      natsClient.natsClient,
      EventChannel.PaymentMade,
      EVENTS_QUEUE_GROUP_NAME
    );
  }

  async onData(data: Payment, ack: () => void): Promise<void> {
    const order = await OrderCollection.findById(data.orderId);
    if(!order){
      throw new Error("Oder with id " + data.orderId + " not found");
    }
    order.status = OrderStatus.Completed;
    await order.save();
    ack();
  }
}
