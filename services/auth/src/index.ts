import Express from "express";
import { currentUserRouter, signInRouter, signOutRouter, signupRouter } from "./routes";

const app = Express();

app.use(Express.json());

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signInRouter);
app.use(signOutRouter);

app.listen(8080, () => {
  console.log("Listening on 8080!");
});
