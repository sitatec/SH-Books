import {
  EventChannel,
  EventListener,
  EventPublisher,
  NatsClientWrapper,
  Order,
  OrderExpired,
  OrderStatus,
} from "@shbooks/common";
import OrderCollection, { OrderDocument } from "../models/order";
import { EVENTS_QUEUE_GROUP_NAME } from "./common";

export class OrderReservationTimeElapsedListener extends EventListener<OrderExpired> {
  constructor(private natsClientWrapper: NatsClientWrapper) {
    super(
      natsClientWrapper.natsClient,
      EventChannel.OrderExpired,
      EVENTS_QUEUE_GROUP_NAME
    );
  }

  async onData(eventData: Order, ack: () => void): Promise<void> {
    const order = await OrderCollection.findById(eventData.id);
    if (!order) {
      throw new Error("Couldn't find order with id " + eventData.book.id);
    }
    if (this.canOrderExpires(order)) {
      order.status = OrderStatus.Expired;
      await order.save(); // We must not user `Promise.all` here.
      await new EventPublisher(this.natsClientWrapper.natsClient).publish(
        new OrderExpired(eventData)
      );
    }
    ack();
  }

  private canOrderExpires(order: OrderDocument) {
    return (
      order.book.orderId &&
      (order.status === OrderStatus.Placed ||
        order.status === OrderStatus.AwaitingPayment)
    );
  }
}
