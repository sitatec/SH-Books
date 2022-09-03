import { StatusCodes } from "http-status-codes";
import supertest from "supertest";
import app from "../../src/app";
import User, { UserType } from "../../src/models/user";
import { cleanDB } from "../utils";

beforeEach(cleanDB);

it("Should successfully signup user", async () => {
  const user: UserType = {
    email: "test@test.com",
    password: "flsj34B.",
  };

  await supertest(app)
    .post("/api/users/signup/")
    .send(user)
    .expect(StatusCodes.CREATED);

  const createdUser = await User.findOne({ email: user.email });
  expect(createdUser?.password).toBeTruthy(); // if createdUser or it's password is null or undefined the test will fail
});

it("Should fail signing up user with invalid email", async () => {
  const user: UserType = {
    email: "testtest.com",
    password: "flsj34B.",
  };

  const response = await supertest(app)
    .post("/api/users/signup/")
    .send(user)
    .expect(StatusCodes.BAD_REQUEST);

  expect(response.body.errors[0].input).toEqual({
    key: "email",
    value: user.email,
  });

  const createdUser = await User.findOne({ email: user.email });
  expect(createdUser).toBeNull();
});

it("Should fail signing up user with invalid password", async () => {
  const user: UserType = {
    email: "test@test.com",
    password: "flsj34", // Not strong enough
  };

  const response = await supertest(app)
    .post("/api/users/signup/")
    .send(user)
    .expect(StatusCodes.BAD_REQUEST);

  expect(response.body.errors[0].input).toEqual({
    key: "password",
    value: user.password,
  });

  const createdUser = await User.findOne({ email: user.email });
  expect(createdUser).toBeNull();
});

it("Should fail signing up user with invalid password and email", async () => {
  const user: UserType = {
    email: "testtest.com",
    password: "flsj34", // Not strong enough
  };

  const response = await supertest(app)
    .post("/api/users/signup/")
    .send(user)
    .expect(StatusCodes.BAD_REQUEST);

  expect(response.body.errors).toContainObject({
    input: {
      key: "password",
      value: user.password,
    },
  });

  expect(response.body.errors).toContainObject({
    input: {
      key: "email",
      value: user.email,
    },
  });

  const createdUser = await User.findOne({ email: user.email });
  expect(createdUser).toBeNull();
});

it("Should fail signing up user with missing password", async () => {
  const email = "test@test.com";
  await supertest(app)
    .post("/api/users/signup/")
    .send({ email })
    .expect(StatusCodes.BAD_REQUEST);

  const createdUser = await User.findOne({ email });
  expect(createdUser).toBeNull();
});

it("Should fail signing up user with missing email", async () => {
  await supertest(app)
    .post("/api/users/signup/")
    .send({ password: "ldf545G." })
    .expect(StatusCodes.BAD_REQUEST);
});

it("Should return a [bad request] response when no data is sent", async () => {
  await supertest(app)
    .post("/api/users/signup/")
    .send({})
    .expect(StatusCodes.BAD_REQUEST);
});

it("Should not allow signing up twice with the same email", async () => {
  const signup = (expectedStatusCode: number) =>{
    return supertest(app)
    .post("/api/users/signup/")
    .send({
      email: "email@test.com",
      password: "lsfj35SG."
    })
    .expect(expectedStatusCode);
  }

  await signup(StatusCodes.CREATED);
  await signup(StatusCodes.BAD_REQUEST);
});