import { StatusCodes } from "http-status-codes";
import supertest from "supertest";
import app from "../../src/app";
import { signup } from "../utils";

it("Should clear cookies when user signout", async () => {
  await signup({
    id: "id",
    email: "test@test.com",
    password: "flsj34B.",
    firstName: "first",
    lastName: "last",
  });

  await supertest(app)
    .post("/api/users/signout")
    .expect(StatusCodes.OK)
    .expect("Set-Cookie", new RegExp("session=;"));
});
