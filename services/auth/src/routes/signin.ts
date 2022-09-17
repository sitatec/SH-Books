import { Router } from "express";
import { BadRequestError } from "@shbooks/common";
import { requestValidator } from "@shbooks/common";
import User from "../models/user";
import { setUserJWTCookie } from "../security/jwt-cookie";
import { verifyPassword } from "../security/password-hashing";
import { emailValidator, ensureNotEmpty } from "@shbooks/common";

const router = Router();

router.post(
  "/api/users/signin/",
  emailValidator(),
  ensureNotEmpty("email"),
  requestValidator,
  async (request, response) => {
    const { email, password } = request.body;
    const user = await User.findOne({ email });
    const isValidPassword = () => verifyPassword(password, user!.password);
    if (!user || !(await isValidPassword())) {
      throw new BadRequestError("Invalid credentials");
    }
    setUserJWTCookie(request, user);
    response.send(user);
  }
);

export default router;
