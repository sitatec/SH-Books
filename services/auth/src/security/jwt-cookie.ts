import { Request } from "express";
import { UserDocument } from "../models/user";
import jwt from "jsonwebtoken";

export const setUserJWTCookie = (request: Request, user: UserDocument) => {
  return setJWTCookie(request, {
    id: user.id,
    email: user.email,
  });
};

export const setJWTCookie = (request: Request, payload: any) => {
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  request.session = { jwt: token };
};
