import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import app from "../src/app";
import { UserType } from "../src/models/user";
import supertest from "supertest";

expect.extend({
  // TODO test
  toContainObject(received, argument) {
    const pass = this.equals(
      received,
      expect.arrayContaining([expect.objectContaining(argument)])
    );

    const message = `expected ${this.utils.printReceived(
      received
    )} not to contain object ${this.utils.printExpected(argument)}`;

    if (pass) {
      return {
        message: () => message,
        pass: true,
      };
    } else {
      return {
        message: () => message,
        pass: false,
      };
    }
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toContainObject(expected: any): { message: () => string; pass: boolean };
    }
  }
}

export const signup = async (user: UserType) => {
  const response = await supertest(app)
    .post("/api/users/signup/")
    .send(user)
    .expect(StatusCodes.CREATED);
  return response.get("Set-Cookie");
};

export const cleanDB = async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
};
