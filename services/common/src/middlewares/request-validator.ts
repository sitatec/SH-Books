import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { InputValidationError } from "../errors/input-validation-error";

export const requestValidator = (
  request: Request,
  _: Response,
  next: NextFunction
) => {
  const result = validationResult(request);
  if (!result.isEmpty()) {
    throw new InputValidationError(result.array());
  }
  next();
};
