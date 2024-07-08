import fs from "fs";
import path from "path";
import axios from "axios";
import sharp from "sharp";
import type { IImageUrls } from "../types/types";

const downloadImages = async (imageUrls: IImageUrls, tempDir: string) => {
  const downloadPromises = imageUrls.map(async (url, index) => {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const filePath = path.join(tempDir, `image_${index}.jpg`);
    await fs.promises.writeFile(filePath, response.data);
    return filePath;
  });
  return Promise.all(downloadPromises);
};

export const getProcessedImages = async (
  imageUrls: IImageUrls,
  tempDir: string
) => {
  const downloadedImages = await downloadImages(imageUrls, tempDir);

  const processedImagePaths = await Promise.all(
    downloadedImages.map(async (path, index) => {
      const outputPath = `${tempDir}/processed_${index}.jpg`;
      await sharp(path).resize(1080, 1920).toFormat("jpeg").toFile(outputPath);
      return outputPath;
    })
  );
  return processedImagePaths;
};

export const createImageList = async (
  imagePaths: IImageUrls,
  tempDir: string
) => {
  const listPath = path.join(tempDir, "image_list.txt");
  const fileContent = imagePaths
    .map((p) => `file '${p}'\nduration 0.03`)
    .join("\n");
  await fs.promises.writeFile(listPath, fileContent);
  return listPath;
};

export const cleanupFiles = (filePaths: IImageUrls) => {
  filePaths.forEach((path: fs.PathLike) => fs.unlinkSync(path));
};
