import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad-request-error";
import User, { UserDocument } from "../models/user";
import jwt from "jsonwebtoken";
import {
  emailValidator,
  passwordValidator,
  validateRequest,
} from "../utils/input-validators";

const router = Router();

router.post(
  "/api/users/signup",
  emailValidator(),
  passwordValidator(),
  async (request: Request, response: Response) => {
    validateRequest(request);
    const { email, password } = request.body;
    const emailAlreadyInUse = await User.exists({ email });
    if (emailAlreadyInUse) {
      throw new BadRequestError(`Email ${email} already in use`);
    }
    const createdUser = await User.insert({ email, password });
    setCookie(request, createdUser);
    response.status(StatusCodes.CREATED).send(createdUser);
  }
);

const setCookie = (request: Request, user: UserDocument) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_KEY!
  );
  request.session = { jwt: token };
}

export default router;
