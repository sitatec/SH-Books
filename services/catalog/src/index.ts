import { connect } from "mongoose";
import app from "./app";
import { ensureJwtKeyEnvVariableSet } from "@shbooks/common";

const startServer = async () => {
  console.log("Starting server...");
  try {
    ensureJwtKeyEnvVariableSet();
    console.log("Connecting to mongo db...");
    // TODO: put connection url in env variable
    await connect("mongodb://catalog-db-service:27017/books");
    console.log("Successfully connected to mongo db.");
    app.listen(8080, () => console.log("Server started and listening on 8080"));
  } catch (error) {
    console.error("Failed to start the server:\n", error);
    process.exit(1);
  }
};


startServer();
