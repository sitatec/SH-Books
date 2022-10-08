import { NotFoundError } from "@shbooks/common";
import { Router } from "express";

const router = Router();

router.get("/api/orders/:id", async (request, response) => {
  response.send({});
});

export default router;
