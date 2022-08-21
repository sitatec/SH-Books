import { Request } from "express";
import { body, validationResult } from "express-validator";
import RequestValidationError from "../errors/request-validation-error";

export const emailValidator = () => {
  return body("email").isEmail().withMessage("Invalid email");
};

export const passwordValidator = () => {
  return body("password")
    .trim()
    .isStrongPassword({ minLength: 6 })
    .withMessage(
      "Password must contain at least 6 characters including a lowercase, a uppercase, a number and a symbol"
    );
};

export const validateRequest = (request: Request) => {
  const result = validationResult(request);
  if (!result.isEmpty()) {
    throw new RequestValidationError(result.array());
  }
};
