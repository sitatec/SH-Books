import { Router } from "express";
import BookCollection from "../models/book";

const router = Router();

router.get("/api/books", async (request, response) => {
  // TODO: Add pagination, sorting, and filtering
  const books = await BookCollection.find();
  response.send(books);
});

export default router;