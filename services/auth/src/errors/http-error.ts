import { HttpErrorResponse } from "../types";

export default abstract class HttpError extends Error {
  abstract readonly statusCode: number;

  constructor(message: string = "Something went wrong"){
    super(message);
  }

  abstract toHttpErrorResponse() : HttpErrorResponse;
}
