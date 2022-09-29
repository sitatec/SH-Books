import { body } from "express-validator";
import { capitalizeFirstLetter } from "./string-utils";

export const emailValidator = () => {
  return body("email").isEmail().withMessage("Invalid email");
};

export const ensureNotEmpty = (...fieldNames: string[]) => {
  return fieldNames.map((fieldName) =>
    body(fieldName)
      .trim()
      .notEmpty()
      .withMessage(`${capitalizeFirstLetter(fieldName)} is required`)
  );
};
