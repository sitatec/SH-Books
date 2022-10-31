import {
  BadRequestError,
  BookUpdated,
  ensureNotEmpty,
  NotFoundError,
  requestValidator,
  requireAuthentication,
  UnauthorizedError,
} from "@shbooks/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { publishEvent } from "../events/event-publisher";
import BookCollection from "../models/book";

const updateBookRouter = Router();

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

    if(book.orderId){
      throw new BadRequestError('Cannot update reserved a book');
    }

    if (book.sellerId != request.currentUser!.id) {
      throw new UnauthorizedError();
    }
    book.set(request.body);
    await book.save();
    await publishEvent(new BookUpdated(book.toModel()));
    response.send(book);
  }
);
