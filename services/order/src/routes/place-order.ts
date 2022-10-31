import { Request, Response, Router } from "express";
import {
  BadRequestError,
  Book,
  ensureNotEmpty,
  EventPublisher,
  NatsClientWrapper,
  NotFoundError,
  OrderPlaced,
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
    await publishEvent(new OrderPlaced(order.toModel()));
    response.status(StatusCodes.CREATED).send(order);
  }
);

let eventPublisher: EventPublisher;

const publishEvent = (event: OrderPlaced) => {
  eventPublisher ||= new EventPublisher(NatsClientWrapper.instance.natsClient);

  return eventPublisher.publish(event);
};

export default router;
