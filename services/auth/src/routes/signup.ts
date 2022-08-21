import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  emailValidator,
  passwordValidator,
  validateRequest,
} from "../utils/input-validators";

const router = Router();

router.post(
  "/api/users/signup",
  emailValidator(),
  passwordValidator(),
  (request: Request, response: Response) => {
    const requestValidationErrors = validateRequest(request);
    if (requestValidationErrors) {
      return response
        .status(StatusCodes.BAD_REQUEST)
        .send(requestValidationErrors);
    }

    console.log("Creating a user...");

    response.send({});
  }
);

export default router;
