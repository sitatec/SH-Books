import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import "./utils";

let mongoDB: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_KEY = "lfFLs4gJD²8LGèls4-ZfljsGSçjsl";
  mongoDB = await MongoMemoryServer.create();
  await mongoose.connect(mongoDB.getUri());
});

afterAll(async () => {
  if (mongoDB) {
    await mongoDB.stop();
  }
  await mongoose.connection.close();
});
