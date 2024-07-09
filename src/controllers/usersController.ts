import { type Request, type Response } from "express";
import * as usersService from "../services/usersService";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const result = await usersService.getAllUsers();

    res.json(result);
  } catch (error) {
    console.error("Error timelapseController: ", error);
    res.status(500).send("Error al procesar las imágenes");
  }
};
