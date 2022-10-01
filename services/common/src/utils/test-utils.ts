import mongoose from "mongoose";
import { User } from "../models/user";
import jwt from "jsonwebtoken";

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

export const signup = (user: User) => {
  const jwtToken = jwt.sign(user, process.env.JWT_KEY!);
  const cookie = JSON.stringify({ jwt: jwtToken });
  const cookieBase64 = Buffer.from(cookie).toString("base64");
  return `session=${cookieBase64}`;
};

export const cleanDB = async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
};

export const generateValidMongoId = () =>
  new mongoose.Types.ObjectId().toHexString();
