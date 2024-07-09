import { Router } from "express";
import * as objectivesController from "../controllers/objectivesController";

const objectivesRouter = Router();

objectivesRouter.delete("/:objectiveId", objectivesController.deleteObjective);

export default objectivesRouter;
