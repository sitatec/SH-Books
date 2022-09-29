import { StatusCodes } from "http-status-codes";
import app from "../src/app";
import { User } from "@shbooks/common";
import supertest from "supertest";


export const signup = async (user: User) => {
  const response = await supertest(app)
    .post("/api/users/signup/")
    .send(user)
    .expect(StatusCodes.CREATED);
  return response.get("Set-Cookie");
};
