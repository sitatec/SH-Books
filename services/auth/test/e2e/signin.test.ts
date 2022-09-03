import { StatusCodes } from "http-status-codes";
import supertest from "supertest";
import app from "../../src/app";
import { UserType } from "../../src/models/user";

const user: UserType = {
  email: "test@test.com",
  password: "flsj34B.",
};

const signup = () => {
  return supertest(app)
    .post("/api/users/signup/")
    .send(user)
    .expect(StatusCodes.CREATED);
};

beforeAll(signup);

it("Should successfully sign in user", async () => {
  const response = await supertest(app)
    .get("/api/users/signin/")
    .send(user)
    .expect(StatusCodes.OK);

  expect(response.body).toMatchObject({ email: user.email });
  expect(response.body).toHaveProperty("id");
});

it("Should fail signing in user with invalid email", async () => {
  return supertest(app)
    .post("/api/users/singnin/")
    .send({
      email: "_invalid_email_",
      password: user.password,
    })
    .expect(StatusCodes.NOT_FOUND);
});

it("Should fail signing in user with invalid password", async () => {
  return await supertest(app)
    .post("/api/users/singnin/")
    .send({
      email: user.email,
      password: "__fake__password",
    })
    .expect(StatusCodes.NOT_FOUND);
});

it("Should fail signing in user with empty password", async () => {
  await supertest(app)
    .post("/api/users/singnin/")
    .send({ email: user.email, password: "" })
    .expect(StatusCodes.NOT_FOUND);
});

it("Should fail signing in user with missing email", async () => {
  await supertest(app)
    .post("/api/users/singnin/")
    .send({ password: user.password })
    .expect(StatusCodes.NOT_FOUND);
});

it("Should return a [bad request] response when no data is sent", async () => {
  await supertest(app)
    .post("/api/users/singnin/")
    .send({})
    .expect(StatusCodes.NOT_FOUND);
});
