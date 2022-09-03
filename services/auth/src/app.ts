import Express from "express";
import "express-async-errors";
import NotFoundError from "./errors/not-found-error";
import errorHandler from "./middlewares/error-handler";
import cookieSession from "cookie-session";
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

export default app;