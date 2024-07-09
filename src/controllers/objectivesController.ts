import { type Response } from "express";
import * as objectivesService from "../services/objectivesServices";
import { IAuthenticatedRequest } from "../types/types";

export const deleteObjective = async (
  req: IAuthenticatedRequest,
  res: Response
) => {
  try {
    const { objectiveId } = req.params;
    const userId = req.user.uid;

    await objectivesService.deleteObjective(userId, objectiveId);

    res.json({
      success: true,
      message: `Objetivo ${objectiveId} eliminado con éxito.`,
    });
  } catch (error) {
    console.error("Error timelapseController: ", error);
    res.status(500).json({ error: "Error al eliminar el objetivo" });
  }
};
