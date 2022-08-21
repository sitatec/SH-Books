import { HttpErrorResponse } from "../types";
import HttpError from "./http-error";
import { StatusCodes } from "http-status-codes";

export default class NotFoundError extends HttpError {
  readonly statusCode = StatusCodes.NOT_FOUND;

  toHttpErrorResponse(): HttpErrorResponse {
    return {
      status: "not-found",
      errors: [{ message: this.message ?? "Resource not found" }],
    };
  }
}
