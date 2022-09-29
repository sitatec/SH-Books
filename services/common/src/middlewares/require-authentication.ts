import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const requireAuthentication = (
  request: Request,
  _: Response,
  next: NextFunction
) => {
  // Normally `request.currentUser` will be set by the the `currentUserExtractor`
  // middleware if the user is authenticated.
  if (!request.currentUser) {
    throw new UnauthorizedError();
  }
  next();
};
