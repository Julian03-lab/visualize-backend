import path from "path";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import cloudinary from "../config/cloudinary";
import {
  cleanupFiles,
  createImageList,
  getProcessedImages,
} from "../utils/fileUtils";
import type { IImageUrls, ITimelapseResult } from "../types/types";

export const createAndUploadTimelapse = async (
  imageUrls: IImageUrls
): Promise<ITimelapseResult> => {
  const outputDir = path.join(__dirname, "output");
  const outputPath = path.join(outputDir, "timelapse.mp4");
  const tempDir = path.join(__dirname, "temp");

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  try {
    const imagePaths = await getProcessedImages(imageUrls, tempDir);
    const listPath = await createImageList(imagePaths, tempDir);

    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(listPath)
        .inputOptions(["-f", "concat", "-safe", "0"])
        .inputFPS(1000 / 500)
        .outputOptions([
          "-vsync",
          "vfr",
          "-pix_fmt",
          "yuv420p",
          "-c:v",
          "libx264",
          "-framerate",
          "1000/500",
        ])
        .output(outputPath)
        .on("end", resolve)
        .on("error", reject)
        .run();
    });

    const result = await cloudinary.uploader.upload(outputPath, {
      resource_type: "auto",
      folder: "timelapses",
    });

    cleanupFiles([...imagePaths, listPath, outputPath]);

    return {
      message: "Timelapse creado y subido con éxito",
      url: result.secure_url,
    };
  } catch (error) {
    throw error;
  }
};
