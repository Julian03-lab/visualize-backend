import { Router } from "express";
import * as timelapseController from "../controllers/timelapseController";

const timelapseRouter = Router();

timelapseRouter.post("/", timelapseController.createTimelapse);

export default timelapseRouter;
