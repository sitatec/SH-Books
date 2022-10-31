import {
  Book,
  BookUpdated,
  EventChannel,
  EventListener,
  NatsClientWrapper,
} from "@shbooks/common";
import BookCollection from "../models/book";
import { EVENTS_QUEUE_GROUP_NAME } from "./common";

type EventDataType = Book & { version: number };

export class BookUpdatedListener extends EventListener<BookUpdated> {
  constructor(natsClient: NatsClientWrapper) {
    super(
      natsClient.natsClient,
      EventChannel.BookUpdated,
      EVENTS_QUEUE_GROUP_NAME
    );
  }

  async onData(data: EventDataType, ack: () => void): Promise<void> {
    const bookFromDb = await BookCollection.findOne({
      _id: data.id,
      version: data.version - 1, // -1 because its  an book *Updated* event, which means the version have been already incremented by the event emitter.
    });
    if (!bookFromDb) {
      throw new Error(`Book with id ${data.id} not found`);
    }
    bookFromDb.set(data);
    await bookFromDb.save();
    ack();
  }
}
