import { Router } from "express";

const router = Router();

router.get("/api/users/signout/:id", (request, response) => {
  response.send("Hi there!");
});

export default router;
