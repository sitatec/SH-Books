import { body } from "express-validator";

export const emailValidator = () => {
  return body("email").isEmail().withMessage("Invalid email");
};

export const strongPasswordValidator = () => {
  return body("password")
    .trim()
    .isStrongPassword({ minLength: 6 })
    .withMessage(
      "Password must contain at least 6 characters including a lowercase, a uppercase, a number and a symbol"
    );
};

export const ensureNotEmpty = (fieldName: string) => {
  return body(fieldName)
    .trim()
    .notEmpty()
    .withMessage(`${capitalizeFirstLetter(fieldName)} is required`);
};
