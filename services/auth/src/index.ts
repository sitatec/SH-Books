import Express from "express";
import "express-async-errors";
import NotFoundError from "./errors/not-found-error";
import errorHandler from "./middlewares/error-handler";
import { currentUserRouter, signInRouter, signOutRouter, signupRouter } from "./routes";

const app = Express();

app.use(Express.json());

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signInRouter);
app.use(signOutRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler)

app.listen(8080, () => {
  console.log("Listening on 8080!");
});
