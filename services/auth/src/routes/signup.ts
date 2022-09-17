import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "@shbooks/common";
import User from "../models/user";
import { strongPasswordValidator } from "../utils/input-validators";
import { emailValidator } from "@shbooks/common";
import { requestValidator } from "@shbooks/common";
import { setUserJWTCookie } from "../security/jwt-cookie";

const router = Router();

router.post(
  "/api/users/signup",
  emailValidator(),
  strongPasswordValidator(),
  requestValidator,
  async (request: Request, response: Response) => {
    const { email, password } = request.body;
    const emailAlreadyInUse = await User.exists({ email });
    if (emailAlreadyInUse) {
      throw new BadRequestError(`Email ${email} already in use`);
    }
    const createdUser = await User.insert({ email, password });
    setUserJWTCookie(request, createdUser);
    response.status(StatusCodes.CREATED).send(createdUser);
  }
);

export default router;
