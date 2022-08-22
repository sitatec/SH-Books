import Express from "express";
import "express-async-errors";
import NotFoundError from "./errors/not-found-error";
import errorHandler from "./middlewares/error-handler";
import {
  currentUserRouter,
  signInRouter,
  signOutRouter,
  signupRouter,
} from "./routes";
import { connect } from "mongoose";

const app = Express();

app.use(Express.json());

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signInRouter);
app.use(signOutRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const startServer = async () => {
  console.log("Starting server...");
  try {
    console.log("Connecting to mongo db...")
    await connect("mongodb://auth-db-cluster-ip:27017/auth");
    console.log("Successfully connected to mongo db.")
    app.listen(8080, () => console.log("Server started and listening on 8080"));
  } catch (error) {
    console.error("Failed to start the server:\n", error);
    process.exit(1);
  }
};

startServer();