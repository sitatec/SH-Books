import { Book } from "../../models";
import { Event } from "../event";
import { EventChannel } from "../event-channel";

export class BookCreated implements Event {
  readonly channel = EventChannel.BookCreated;
  constructor(public data: Book) {}
}
