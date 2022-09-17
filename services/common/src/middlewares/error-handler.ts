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
  // If the request contains malformed json, the Express.json() middleware will throw an error with status field.
  const statusCode = (error as any).status ?? StatusCodes.INTERNAL_SERVER_ERROR;
  const errorResponse : HttpErrorResponse = {
    errors: [{ message: error.message }],
  };
  response.status(statusCode).send(errorResponse);
};

export default errorHandler;
