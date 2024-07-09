import type { NextFunction, Response } from "express";
import { auth } from "../config/firebase";
import type { IAuthenticatedRequest } from "../types/types";

export const verifyFirebaseToken = async (
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return res
      .status(401)
      .json({ error: "No se proporcionó token de autorización" });
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;

    next();
  } catch (error) {
    console.error("Error al verificar el token:", error);
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};
