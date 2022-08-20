import Express from "express";

const app = Express();

app.use(Express.json());

app.listen(8080, () => {
  console.log("Listening on 8080!");
});
