import { Router } from "express";

const router = Router();

router.get("/api/users/signin/", (request, response) => {
  response.send("Hi there!");
});

export default router;
