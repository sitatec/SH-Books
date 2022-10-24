import {
  Book,
  BookCreated,
  EventChannel,
  EventListener,
  NatsClientWrapper,
} from "@shbooks/common";
import BookCollection from "../models/book";
import { EVENTS_QUEUE_GROUP_NAME } from "./common";

export class BookCreatedListener extends EventListener<BookCreated> {
  constructor(natsClient: NatsClientWrapper) {
    super(
      natsClient.natsClient,
      EventChannel.BookCreated,
      EVENTS_QUEUE_GROUP_NAME
    );
  }

  async onData(data: Book, ack: () => void): Promise<void> {
    await BookCollection.insert(data);
    ack();
  }
}
