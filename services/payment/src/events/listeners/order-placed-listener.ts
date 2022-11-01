import {
  EventChannel,
  EventListener,
  NatsClientWrapper,
  Order,
  OrderPlaced,
} from "@shbooks/common";
import OrderCollection from "../../models/order";
import { EVENTS_QUEUE_GROUP_NAME } from "./queue-group-name";

export class OrderPlacedListener extends EventListener<OrderPlaced> {
  constructor(natsClient: NatsClientWrapper) {
    super(
      natsClient.natsClient,
      EventChannel.OrderPlaced,
      EVENTS_QUEUE_GROUP_NAME
    );
  }

  async onData(data: Order & { version: number }, ack: () => void) {
    const order = OrderCollection.build({
      id: data.id,
      price: data.book.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });
    await order.save();

    ack();
  }
}
