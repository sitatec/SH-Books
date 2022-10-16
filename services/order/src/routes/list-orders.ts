import { Router } from "express";
import OrderCollection from "../models/order";

const router = Router();

router.get("/api/orders", async (request, response) => {
  // TODO: Add pagination, sorting, and filtering
  const orders = await OrderCollection.find({
    userId: request.currentUser!.id,
  }).populate("book");

  response.send(orders);
});

export default router;