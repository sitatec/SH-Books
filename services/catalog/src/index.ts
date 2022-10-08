import { connect } from "mongoose";
import app from "./app";
import { ensureJwtKeyEnvVariableSet, NatsClientWrapper } from "@shbooks/common";

const startServer = async () => {
  console.log("Starting server...");
  try {
    ensureJwtKeyEnvVariableSet();
    console.log("Connecting to mongo db...");
    // TODO: put mongo connection url and nats connection strings in env variables and ensure they are set before starting the server i.e: like ensureJwtKeyEnvVariableSet()
    await connect("mongodb://catalog-db-service:27017/books");
    console.log("Successfully connected to mongo db");
    await NatsClientWrapper.instance.connect(
      "shbooks",
      "change-to-support-horizontal-scaling",
      "http://nats-service:4222"
    );
    console.log("Successfully connected to nats streaming server");
    app.listen(8080, () => console.log("Server started and listening on 8080"));
    process.on("SIGKILL", closeNatsConnectionAndExit);
    process.on("SIGTERM", closeNatsConnectionAndExit);
  } catch (error) {
    console.error("Failed to start the server:\n", error);
    process.exit(1);
  }
};

const closeNatsConnectionAndExit = () => {
  NatsClientWrapper.instance.natsClient.close();
  process.exit();
};

startServer();
