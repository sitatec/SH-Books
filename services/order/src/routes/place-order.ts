import { Request, Response, Router } from "express";
import {
  ensureNotEmpty,
  requestValidator,
  requireAuthentication,
} from "@shbooks/common";
import { StatusCodes } from "http-status-codes";
import { body } from "express-validator";

const router = Router();

router.post(
  "/api/orders",
  requireAuthentication,
  ensureNotEmpty("bookId"),
  requestValidator,
  async (request: Request, response: Response) => {
    response.status(StatusCodes.CREATED).send({});
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
