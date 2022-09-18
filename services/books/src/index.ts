import { connect } from "mongoose";
import app from "./app";
import { ensureJwtKeyEnvVariableSet } from "@shbooks/common";

const startServer = async () => {
  console.log("Starting server...");
  try {
    ensureJwtKeyEnvVariableSet();
    console.log("Connecting to mongo db...");
    await connect("mongodb://books-db-service:27017/books");
    console.log("Successfully connected to mongo db.");
    app.listen(443, () => console.log("Server started and listening on 443"));
  } catch (error) {
    console.error("Failed to start the server:\n", error);
    process.exit(1);
  }
};


startServer();
