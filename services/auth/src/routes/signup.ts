import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, ensureNotEmpty, User as UserType } from "@shbooks/common";
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
  ensureNotEmpty("firstName", "lastName"),
  requestValidator,
  async (request: Request, response: Response) => {
    const data: UserType= request.body;
    const emailAlreadyInUse = await User.exists({ email: data.email });
    if (emailAlreadyInUse) {
      throw new BadRequestError(`Email ${data.email} already in use`);
    }
    const createdUser = await User.insert(data);
    setUserJWTCookie(request, createdUser);
    response.status(StatusCodes.CREATED).send(createdUser);
  }
);

export default router;
