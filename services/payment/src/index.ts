import { connect } from "mongoose";
import app from "./app";
import {
  ensureEnvVariablesSet,
  forceSynchronousErrorLoggin,
  NatsClientWrapper,
} from "@shbooks/common";
import { OrderPlacedListener } from "./events/listeners/order-placed-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

const startServer = async () => {
  console.log("Starting server...");
  try {
    ensureRequiredEnvVariablesSet();
    await connectMongoDB();
    await connectNatsStreamingServer();
    listenToEvents();
    app.listen(8080, () => console.log("Server started and listening on 8080"));
  } catch (error) {
    forceSynchronousErrorLoggin(); // Otherwise process may exit before logging completed
    console.error("Failed to start the server:\n", error);
    process.exit(1);
  }
};

const ensureRequiredEnvVariablesSet = () => {
  ensureEnvVariablesSet(
    "STRIPE_KEY",
    "MONGO_DB_URL",
    "NATS_CLUSTER_ID",
    "NATS_CLIENT_ID",
    "NATS_SERVER_URL"
  );
};

const connectMongoDB = async () => {
  console.log("Connecting to mongo db...");
  await connect(process.env.MONGO_DB_URL!);
  console.log("Successfully connected to mongo db");
};

const connectNatsStreamingServer = async () => {
  await NatsClientWrapper.instance.connect(
    process.env.NATS_CLUSTER_ID!,
    process.env.NATS_CLIENT_ID!,
    process.env.NATS_SERVER_URL!
  );
  process.on("SIGINT", closeNatsConnectionAndExit);
  process.on("SIGTERM", closeNatsConnectionAndExit);
};

const closeNatsConnectionAndExit = (_: any) => {
  NatsClientWrapper.instance.natsClient.close();
  process.exit();
};

const listenToEvents = () => {
  const natsClient = NatsClientWrapper.instance;
  new OrderPlacedListener(natsClient).listen();
  new OrderCancelledListener(natsClient).listen();
};

startServer();
