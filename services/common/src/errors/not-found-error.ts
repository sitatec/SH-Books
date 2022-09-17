import { HttpErrorResponse } from "../types";
import { HttpError } from "./http-error";
import { StatusCodes } from "http-status-codes";

export class NotFoundError extends HttpError {
  readonly statusCode = StatusCodes.NOT_FOUND;

  toHttpErrorResponse(): HttpErrorResponse {
    return {
      errors: [{ message: this.message ?? "Resource not found" }],
    };
  }
}
