import { type Request, type Response } from "express";
import * as timelapseService from "../services/timelapseService";
import type { ICreateTimelapseRequest } from "../types/types";

export const createTimelapse = async (
  req: Request<{}, {}, ICreateTimelapseRequest>,
  res: Response
) => {
  try {
    const { imageUrls } = req.body;
    const result = await timelapseService.createAndUploadTimelapse(imageUrls);

    res.json(result);
  } catch (error) {
    console.error("Error timelapseController: ", error);
    res.status(500).send("Error al procesar las imágenes");
  }
};
