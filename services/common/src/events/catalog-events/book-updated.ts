import { Event } from "../event";
import { EventChannel } from "../event-channel";

export class BookCreated implements Event {
  readonly channel = EventChannel.BookCreated;
  constructor(
    public data: {
      id: string;
      title: string;
      description: string;
      authorName: string;
      price: number;
      imageUrl: string;
      sellerId: string;
      createdAt: Date;
    }
  ) {}
}
