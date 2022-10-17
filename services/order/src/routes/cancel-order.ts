import { EventPublisher, NatsClientWrapper, NotFoundError, OrderCanceled, OrderStatus, requireAuthentication, UnauthorizedError } from "@shbooks/common";
import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import OrderCollection from "../models/order";

const updateBookRouter = Router();

updateBookRouter.delete(
  "/api/orders/:id",
  requireAuthentication,
  async (request: Request, response: Response) => {
    const { id: orderId } = request.params;
    const order = await OrderCollection.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== request.currentUser!.id) {
      throw new UnauthorizedError();
    }
    order.status = OrderStatus.Canceled;
    await order.save();
    await publishEvent(new OrderCanceled(order.toOrderModel()));
    response.send(StatusCodes.OK);
  }
);

let eventPublisher: EventPublisher;

const publishEvent = (event: OrderCanceled) => {
  eventPublisher ||= new EventPublisher(NatsClientWrapper.instance.natsClient);

  return eventPublisher.publish(event);
};

export default updateBookRouter;
