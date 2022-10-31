import {
  ensureEnvVariablesSet,
  forceSynchronousErrorLoggin,
  NatsClientWrapper,
} from "@shbooks/common";
import { ScheduledEventsEmitter } from "./scheduled-events-emitter";

const startServer = async () => {
  console.log("Starting server...");
  try {
    ensureRequiredEnvVariablesSet();
    await connectNatsStreamingServer();
    initWorkers();
  } catch (error) {
    forceSynchronousErrorLoggin(); // Otherwise process may exit before logging completed
    console.error("Failed to start the server:\n", error);
    process.exit(1);
  }
};

const ensureRequiredEnvVariablesSet = () => {
  ensureEnvVariablesSet(
    "NATS_CLUSTER_ID",
    "NATS_CLIENT_ID",
    "NATS_SERVER_URL",
    "REDIS_HOST"
  );
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

const initWorkers = () => {
  new ScheduledEventsEmitter().init();
};

startServer();
