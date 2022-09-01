import Express from "express";
import "express-async-errors";
import NotFoundError from "./errors/not-found-error";
import errorHandler from "./middlewares/error-handler";
import cookieSession from "cookie-session";
import { connect } from "mongoose";
import {
  currentUserRouter,
  signInRouter,
  signOutRouter,
  signupRouter,
} from "./routes";

const app = Express();
app.set('trust proxy', true);

app.use(Express.json());
app.use(cookieSession({ signed: false, secure: true }));
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
    ensureRequiredEnvSet();
    console.log("Connecting to mongo db...");
    await connect("mongodb://auth-db-cluster-ip:27017/auth");
    console.log("Successfully connected to mongo db.");
    app.listen(8080, () => console.log("Server started and listening on 8080"));
  } catch (error) {
    console.error("Failed to start the server:\n", error);
    process.exit(1);
  }
};

const ensureRequiredEnvSet = () => {
  if(!process.env.JWT_KEY){
    console.error('JWT_KEY environment variable must be define!');
    process.exit(1);
  }
}

startServer();
