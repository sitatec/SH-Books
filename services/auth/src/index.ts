import { connect } from "mongoose";
import app from "./app";
import {
  ensureEnvVariablesSet,
  forceSynchronousErrorLoggin,
} from "@shbooks/common";

// TODO use appropriated log levels in the entire project
// TODO add token refresh endpoint

const startServer = async () => {
  console.log("Starting server...");
  try {
    ensureEnvVariablesSet("MONGO_DB_URL");
    console.log("Connecting to mongo db...");
    // TODO: put connection url in env variable
    await connect(process.env.MONGO_DB_URL!);
    console.log("Successfully connected to mongo db.");
    app.listen(8080, () => console.log("Server started and listening on 8080"));
  } catch (error) {
    forceSynchronousErrorLoggin(); // Otherwise process may exit before logging completed
    console.error("Failed to start the server:\n", error);
    process.exit(1);
  }
};

startServer();
