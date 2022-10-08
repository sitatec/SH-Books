import { Router } from "express";

const router = Router();

router.get("/api/orders", async (request, response) => {
  // TODO: Add pagination, sorting, and filtering
  response.send({});
});

export default router;