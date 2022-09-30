import { Request, Response, Router } from "express";
import {
  ensureNotEmpty,
  requestValidator,
  requireAuthentication,
} from "@shbooks/common";
import { StatusCodes } from "http-status-codes";
import { body } from "express-validator";
import BookCollection from "../models/book";

const router = Router();

router.post(
  "/api/books",
  requireAuthentication,
  ensureNotEmpty("title", "description", "imageUrl", "sellerId"),
  body("price").isFloat({ gt: 0 }),
  requestValidator,
  async (request: Request, response: Response) => {
    const data = request.body;
    const book = await BookCollection.insert(data);
    response.status(StatusCodes.CREATED).send(book);
  }
);

export default router;
