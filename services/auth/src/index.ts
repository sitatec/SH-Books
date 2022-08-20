import Express from "express";

const app = Express();

app.use(Express.json());

app.get('/api/users/currentuser', (request, response) => {
  response.send('Hi there!');
});

app.listen(8080, () => {
  console.log("Listening on 8080!");
});
