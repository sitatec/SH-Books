import { HttpErrorResponse } from "../types";
import HttpError from "./http-error";
import { StatusCodes } from "http-status-codes";
import { ValidationError } from "express-validator";

export default class RequestValidationError extends HttpError {
  readonly statusCode = StatusCodes.BAD_REQUEST;

  constructor(
    private readonly validationErrors: ValidationError[],
    message?: string
  ) {
    const errorMessages = validationErrors.map((error) => error.msg);
    super(message ?? `Error(s): \n- ${errorMessages.join("\n- ")}`);
  }

  toHttpErrorResponse = (): HttpErrorResponse => {
    return { status: "invalid-input", errors: this.errors };
  };

  private get errors() {
    return this.validationErrors.map((error) => {
      return {
        message: error.msg,
        input: { key: error.param, value: error.value },
      };
    });
  }
}
