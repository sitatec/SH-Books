import {
  BookUpdated,
  ensureNotEmpty,
  EventPublisher,
  NatsClientWrapper,
  NotFoundError,
  requestValidator,
  requireAuthentication,
  UnauthorizedError,
} from "@shbooks/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import BookCollection from "../models/book";

const updateBookRouter = Router();
const eventPublisher = new EventPublisher(
  NatsClientWrapper.instance.natsClient
);

updateBookRouter.put(
  "/api/books/:id",
  requireAuthentication,
  ensureNotEmpty("title", "description", "imageUrl", "authorName"),
  body("price").isFloat({ gt: 0 }),
  requestValidator,
  async (request: Request, response: Response) => {
    const book = await BookCollection.findById(request.params.id);
    if (!book) {
      throw new NotFoundError();
    }
    if (book.sellerId != request.currentUser!.id) {
      throw new UnauthorizedError();
    }
    book.set(request.body);
    await book.save();
    await eventPublisher.publish(new BookUpdated(book.toBookModel()));
    response.send(book);
  }
);

export default updateBookRouter;
