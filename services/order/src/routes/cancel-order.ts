import { requireAuthentication } from "@shbooks/common";
import { Request, Response, Router } from "express";

const updateBookRouter = Router();

updateBookRouter.post(
  "/api/orders/:id",
  requireAuthentication,
  async (request: Request, response: Response) => {
    response.send({});
  }
);

// let eventPublisher: EventPublisher;

// const publishEvent = async (event: OrderCanceled) => {
//   eventPublisher ||= new EventPublisher(NatsClientWrapper.instance.natsClient);

//   await eventPublisher.publish(event);
// };

export default updateBookRouter;
