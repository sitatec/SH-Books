import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoDB: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_KEY = "lfFLs4gJD²8LGèls4-ZfljsGSçjsl";
  mongoDB = await MongoMemoryServer.create();
  await mongoose.connect(mongoDB.getUri());
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoDB.stop();
  await mongoose.connection.close();
});