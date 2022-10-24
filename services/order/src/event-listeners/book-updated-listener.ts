import {
  Book,
  BookUpdated,
  EventChannel,
  EventListener,
  NatsClientWrapper,
  NotFoundError,
} from "@shbooks/common";
import BookCollection from "../models/book";
import { EVENTS_QUEUE_GROUP_NAME } from "./common";

export class BookUpdatedListener extends EventListener<BookUpdated> {
  constructor(natsClient: NatsClientWrapper) {
    super(
      natsClient.natsClient,
      EventChannel.BookUpdated,
      EVENTS_QUEUE_GROUP_NAME
    );
  }

  async onData(data: Book, ack: () => void): Promise<void> {
    const bookFromDb = await BookCollection.findById(data.id);
    if (!bookFromDb) {
      throw new NotFoundError(`Book with id ${data.id} not found`);
    }
    bookFromDb.set(data);
    await bookFromDb.save();
    ack();
  }
}
