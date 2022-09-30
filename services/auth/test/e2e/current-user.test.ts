import { User } from "@shbooks/common";
import { StatusCodes } from "http-status-codes";
import supertest from "supertest";
import app from "../../src/app";
import { signup } from "../utils";

it("Should return logged in user", async () => {
  const user: User = {
    id: "id",
    email: "test@test.com",
    password: "flsj34B.",
    firstName: "first",
    lastName: "last",
  };
  const cookie = await signup(user);

  const response = await supertest(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .expect(StatusCodes.OK);
    
  expect(response.body.currentUser?.email).toEqual(user.email);
  expect(response.body.currentUser).toHaveProperty("id");
});

it("Should return response with currentUser equal null when no cookie is set", async () => {
  const response = await supertest(app)
    .get("/api/users/currentuser")
    .expect(StatusCodes.OK);
  
  expect(response.body.currentUser).toBeNull()
});
