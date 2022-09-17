import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

/**
 * A middleware that extract a JWT from the cookies, decode the JWT to get the user data
 * and assign the data to the `request.currentUser`. Note the `request` is the express
 * `Request`.
 */
export const currentUserExtractor = (
  request: Request,
  _: Response,
  next: NextFunction
) => {
  const token = request.session?.jwt;
  if (!token) {
    return next();
  }
  try {
    const userData = jwt.verify(token, process.env.JWT_KEY!) as User;
    request.currentUser = userData;
  } catch (error) {
    console.error(error);
  }
  next();
};
