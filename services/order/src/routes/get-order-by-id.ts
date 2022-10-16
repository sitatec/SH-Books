import { NotFoundError, UnauthorizedError } from "@shbooks/common";
import { Router } from "express";
import OrderCollection from "../models/order";

const router = Router();

router.get("/api/orders/:id", async (request, response) => {
  const { id: orderId } = request.params;
  const order = await OrderCollection.findById(orderId).populate("book");
  if (!order) {
    throw new NotFoundError();
  }
  if (order.userId !== request.currentUser!.id) {
    throw new UnauthorizedError();
  }
  response.send(order);
});

export default router;
