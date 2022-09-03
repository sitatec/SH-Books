import { HttpErrorResponse } from "../types";
import HttpError from "./http-error";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export default class BadRequestError extends HttpError {
  readonly statusCode = StatusCodes.BAD_REQUEST;

  constructor(message: string = ReasonPhrases.BAD_REQUEST) {
    super(message);
  }

  toHttpErrorResponse(): HttpErrorResponse {
    return {
      errors: [{ message: this.message }],
    };
  }
}
