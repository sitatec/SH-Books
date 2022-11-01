import {
  EventChannel,
  EventListener,
  NatsClientWrapper,
  Order,
  OrderCanceled,
  OrderStatus,
} from "@shbooks/common";
import OrderCollection from "../../models/order";
import { EVENTS_QUEUE_GROUP_NAME } from "./queue-group-name";

export class OrderCancelledListener extends EventListener<OrderCanceled> {
  constructor(natsClient: NatsClientWrapper) {
    super(
      natsClient.natsClient,
      EventChannel.OrderCanceled,
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

    order.set({ status: OrderStatus.Canceled });
    await order.save();

    ack();
  }
}
