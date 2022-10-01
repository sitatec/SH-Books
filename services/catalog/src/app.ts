import Express from "express";
import "express-async-errors";
import {NotFoundError, errorHandler, currentUserExtractor} from "@shbooks/common";
import cookieSession from "cookie-session";
import createBookRouter from "./routes/create-book";
import getBookRouter from "./routes/get-book-by-id";
import listBooksRouter from "./routes/list-books";

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
app.use(getBookRouter);
app.use(listBooksRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
