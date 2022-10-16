import { Request, Response, Router } from "express";
import {
  BadRequestError,
  Book,
  ensureNotEmpty,
  NotFoundError,
  OrderStatus,
  requestValidator,
  requireAuthentication,
} from "@shbooks/common";
import { StatusCodes } from "http-status-codes";
import OrderCollection from "../models/order";
import BookCollection from "../models/book";

const EXPIRATION_WINDOW_IN_MINUTES = 3;

const router = Router();

router.post(
  "/api/orders",
  requireAuthentication,
  ensureNotEmpty("bookId"),
  requestValidator,
  async (request: Request, response: Response) => {
    const { bookId } = request.body;

    const book = await BookCollection.findById(bookId);
    if (!book) {
      throw new NotFoundError();
    }
    const isReserved = await book.isReserved();
    if (isReserved) {
      throw new BadRequestError("Book is already reserved");
    }
    const expiration = new Date();
    expiration.setMinutes(
      expiration.getMinutes() + EXPIRATION_WINDOW_IN_MINUTES
    );
    const order = await OrderCollection.insert({
      userId: request.currentUser!.id,
      status: OrderStatus.Placed,
      expiresAt: expiration,
      book: book as Book,
    });

    // TODO: Publish an event saying that an order was created

    response.status(StatusCodes.CREATED).send(order);
  }
);

// let eventPublisher: EventPublisher;

// const publishEvent = async (event: OrderPlaced) => {
//   eventPublisher ||= new EventPublisher(
//     NatsClientWrapper.instance.natsClient
//   );

//   await eventPublisher.publish(event);
// }

export default router;
