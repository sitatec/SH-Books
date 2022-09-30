import { NotFoundError } from "@shbooks/common";
import { Router } from "express";
import BookCollection from "../models/book";

const router = Router();

router.get("/api/books/:id", async (request, response) => {
  const book = await BookCollection.findById(request.params.id);
  if (!book) {
    throw new NotFoundError();
  }
  response.send(book);
});

export default router;
