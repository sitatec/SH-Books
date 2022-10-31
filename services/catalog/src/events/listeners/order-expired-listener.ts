import {
  BookUpdated,
  EventChannel,
  EventListener,
  NatsClientWrapper,
  Order,
  OrderCanceled,
} from "@shbooks/common";
import BookCollection from "../../models/book";
import { EVENTS_QUEUE_GROUP_NAME } from "../common";
import { publishEvent } from "../event-publisher";

export class OrderExpiredListener extends EventListener<OrderCanceled> {
  constructor(natsClient: NatsClientWrapper) {
    super(
      natsClient.natsClient,
      EventChannel.OrderCanceled,
      EVENTS_QUEUE_GROUP_NAME
    );
  }

  async onData(data: Order, ack: () => void) {
    const book = await BookCollection.findById(data.book.id);
    if (!book) {
      throw new Error("Order not found");
    }
    book.set({ orderId: null });
    await book.save();
    await publishEvent(new BookUpdated(book.toModel()));
    ack();
  }
}
