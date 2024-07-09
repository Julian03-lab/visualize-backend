import { Router } from "express";
import * as usersController from "../controllers/usersController";

const usersRouter = Router();

usersRouter.get("/", usersController.getUsers);

export default usersRouter;
