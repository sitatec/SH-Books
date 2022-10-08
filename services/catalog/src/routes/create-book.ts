import { Request, Response, Router } from "express";
import {
  ensureNotEmpty,
  requestValidator,
  requireAuthentication,
  Book,
  EventPublisher,
  NatsClientWrapper,
  BookCreated,
} from "@shbooks/common";
import { StatusCodes } from "http-status-codes";
import { body } from "express-validator";
import BookCollection from "../models/book";

const router = Router();

router.post(
  "/api/books",
  requireAuthentication,
  ensureNotEmpty("title", "description", "imageUrl", "authorName"),
  body("price").isFloat({ gt: 0 }),
  requestValidator,
  async (request: Request, response: Response) => {
    const data: Book = request.body;
    data.sellerId = request.currentUser!.id;
    // TODO: store events in a collection and remove them only when they are successfully sent.
    // And use a transaction to insert the book and the event.
    const book = await BookCollection.insert(data);
    await publishEvent(new BookCreated(book.toBookModel()));
    response.status(StatusCodes.CREATED).send(book);
  }
);

let eventPublisher: EventPublisher;

const publishEvent = async (event: BookCreated) => {
  eventPublisher ||= new EventPublisher(
    NatsClientWrapper.instance.natsClient
  );

  await eventPublisher.publish(event);
}
export default router;
