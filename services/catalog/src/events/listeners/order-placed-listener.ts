import {
  BookUpdated,
  EventChannel,
  EventListener,
  NatsClientWrapper,
  Order,
  OrderPlaced,
} from "@shbooks/common";
import BookCollection from "../../models/book";
import { EVENTS_QUEUE_GROUP_NAME } from "../common";
import { publishEvent } from "../event-publisher";

export class OrderPlacedListener extends EventListener<OrderPlaced> {
  constructor(natsClient: NatsClientWrapper) {
    super(
      natsClient.natsClient,
      EventChannel.OrderPlaced,
      EVENTS_QUEUE_GROUP_NAME
    );
  }

  async onData(data: Order, ack: () => void) {
    const book = await BookCollection.findById(data.book.id);
    if (!book) {
      throw new Error("Order not found");
    }
    book.set({ orderId: data.id });
    await book.save();
    await publishEvent(new BookUpdated(book.toModel()));
    ack();
  }
}
