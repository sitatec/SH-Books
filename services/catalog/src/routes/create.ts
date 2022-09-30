import { Request, Response, Router } from "express";
import {
  ensureNotEmpty,
  requestValidator,
  requireAuthentication,
} from "@shbooks/common";
import { StatusCodes } from "http-status-codes";
import { body } from "express-validator";
import BookCollection, { Book } from "../models/book";

const router = Router();

router.post(
  "/api/books",
  requireAuthentication,
  ensureNotEmpty("title", "description", "imageUrl"),
  body("price").isFloat({ gt: 0 }),
  requestValidator,
  async (request: Request, response: Response) => {
    const data: Book = request.body;
    data.sellerId = request.currentUser!.id;
    const book = await BookCollection.insert(data);
    response.status(StatusCodes.CREATED).send(book);
  }
);

export default router;
