import Express from "express";
import "express-async-errors";
import {NotFoundError, errorHandler, currentUserExtractor} from "@shbooks/common";
import cookieSession from "cookie-session";
import placeOrderRouter from "./routes/place-order";
import getOrderRouter from "./routes/get-order-by-id";
import listOrdersRouter from "./routes/list-orders";
import cancelOrderRouter from "./routes/cancel-order";

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

app.use(placeOrderRouter);
app.use(getOrderRouter);
app.use(listOrdersRouter);
app.use(cancelOrderRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
