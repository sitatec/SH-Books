import { HttpErrorResponse } from "../types";
import HttpError from "./http-error";
import { StatusCodes } from "http-status-codes";

export default class BadRequestError extends HttpError {
  readonly statusCode = StatusCodes.BAD_REQUEST;

  constructor(message: string) {
    super(message);
  }

  toHttpErrorResponse(): HttpErrorResponse {
    return {
      status: "bad-request",
      errors: [{ message: this.message }],
    };
  }
}
