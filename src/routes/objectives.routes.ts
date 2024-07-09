import { Router } from "express";
import * as objectivesController from "../controllers/objectivesController";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken";

const objectivesRouter = Router();

objectivesRouter.delete(
  "/:objectiveId",
  verifyFirebaseToken,
  objectivesController.deleteObjective
);

export default objectivesRouter;
