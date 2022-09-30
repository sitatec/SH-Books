import Express from "express";
import "express-async-errors";
import {NotFoundError, errorHandler, currentUserExtractor} from "@shbooks/common";
import cookieSession from "cookie-session";
import createBookRouter from "./routes/create";

const app = Express();
app.set("trust proxy", true);

app.use(Express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV != "test",
  })
);
app.use(currentUserExtractor);

app.use(createBookRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
