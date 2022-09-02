import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import RequestValidationError from "../errors/request-validation-error";

export const requestValidator = (
  request: Request,
  _: Response,
  next: NextFunction
) => {
  const result = validationResult(request);
  if (!result.isEmpty()) {
    throw new RequestValidationError(result.array());
  }
  next();
};
