import { Router } from "express";
import { currentUserExtractor } from "../middlewares/current-user-extractor";

const router = Router();

router.get("/api/users/currentuser", currentUserExtractor, (request, response) => {
  response.send({currentUser: request.currentUser || null});
});

export default router;
