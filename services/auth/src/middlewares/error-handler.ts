import { NextFunction, Request, Response } from "express";
import HttpError from "../errors/http-error";
import { StatusCodes } from "http-status-codes";
import { HttpErrorResponse } from "../types";

const errorHandler = (
  error: Error,
  _: Request,
  response: Response,
  __: NextFunction
) => {
  console.error(error.message);
  if (error instanceof HttpError) {
    return response.status(error.statusCode).send(error.toHttpErrorResponse());
  }
  const statusCode = (error as any).status ?? StatusCodes.INTERNAL_SERVER_ERROR;
  const isInvalidInputFormat =
    error instanceof SyntaxError && statusCode === StatusCodes.BAD_REQUEST;
  const errorResponse : HttpErrorResponse = {
    status: isInvalidInputFormat ? "invalid-input-format" : "server-error",
    errors: [{ message: error.message }],
  };
  response.status(statusCode).send(errorResponse);
};

export default errorHandler;
