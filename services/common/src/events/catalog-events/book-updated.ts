import { Book } from "../../models";
import { Event } from "../event";
import { EventChannel } from "../event-channel";

export class BookCreated implements Event {
  readonly channel = EventChannel.BookUpdated;
  constructor(public data: Book) {}
}
