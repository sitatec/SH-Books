import {
  EventChannel,
  EventListener,
  NatsClientWrapper,
  Order,
  OrderCanceled,
  OrderExpired,
  OrderStatus,
} from "@shbooks/common";
import OrderCollection from "../../models/order";
import { EVENTS_QUEUE_GROUP_NAME } from "./queue-group-name";

export class OrderExpiredListener extends EventListener<OrderExpired> {
  constructor(natsClient: NatsClientWrapper) {
    super(
      natsClient.natsClient,
      EventChannel.OrderExpired,
      EVENTS_QUEUE_GROUP_NAME
    );
  }

  async onData(data: Order & { version: number }, ack: () => void) {
    const order = await OrderCollection.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({ status: OrderStatus.Expired });
    await order.save();

    ack();
  }
}
