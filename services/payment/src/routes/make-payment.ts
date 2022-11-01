import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  ensureNotEmpty,
  requireAuthentication,
  requestValidator,
  UnauthorizedError,
  NatsClientWrapper,
  PaymentMade,
} from "@shbooks/common";
import { stripe } from "../stripe";
import OrderCollection from "../models/order";
import PaymentCollection from "../models/payment";
import { publishEvent } from "../event-publisher";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuthentication,
  ensureNotEmpty("token", "orderId"),
  requestValidator,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await OrderCollection.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new UnauthorizedError();
    }
    if (order.status === OrderStatus.Canceled) {
      throw new BadRequestError("Cannot pay for an cancelled order");
    }

    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100, // Cents
      source: token,
    });
    const payment = PaymentCollection.build({
      orderId,
      paymentGatewayId: charge.id,
    });
    await payment.save();

    await publishEvent(new PaymentMade(payment.toModel()));

    res.status(StatusCodes.CREATED).send(payment);
  }
);

export { router as createChargeRouter };
