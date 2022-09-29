import { HttpErrorResponse } from "../types";
import { HttpError } from "./http-error";
import { StatusCodes } from "http-status-codes";

export class UnauthorizedError extends HttpError {
  readonly statusCode = StatusCodes.UNAUTHORIZED;

  toHttpErrorResponse(): HttpErrorResponse {
    return {
      errors: [
        {
          message:
            this.message ?? "You are not authorized to access this resource",
        },
      ],
    };
  }
}
