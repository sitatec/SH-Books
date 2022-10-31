import { Request, Response, Router } from "express";
import {
  BadRequestError,
  Book,
  ensureNotEmpty,
  EventPublisher,
  JobQueued,
  JobType,
  NatsClientWrapper,
  NotFoundError,
  OrderPlaced,
  OrderReservationTimeElapsed,
  OrderStatus,
  requestValidator,
  requireAuthentication,
} from "@shbooks/common";
import { StatusCodes } from "http-status-codes";
import OrderCollection, { OrderDocument } from "../models/order";
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
    const order = await OrderCollection.insert({
      userId: request.currentUser!.id,
      status: OrderStatus.Placed,
      book: book as Book,
    });
    await publishEvents(order);
    response.status(StatusCodes.CREATED).send(order);
  }
);

const publishEvents = async (order: OrderDocument) => {
  const orderJson = order.toModel();
  await Promise.all([
    publishEvent(new OrderPlaced(orderJson)),
    publishEvent(
      new JobQueued({
        type: JobType.ScheduleEvent,
        processAt: getOrderExpirationDate(),
        payload:  new OrderReservationTimeElapsed(orderJson),
      })
    ),
  ]);
};

const getOrderExpirationDate = () => {
  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + EXPIRATION_WINDOW_IN_MINUTES);
  return expiration;
};

let eventPublisher: EventPublisher;

const publishEvent = (event: OrderPlaced | JobQueued) => {
  eventPublisher ||= new EventPublisher(NatsClientWrapper.instance.natsClient);

  return eventPublisher.publish(event);
};

export default router;
