import { Router } from "express";

const router = Router();

router.get("/api/users/currentuser", (request, response) => {
  response.send("Hi there!");
});

export default router;
