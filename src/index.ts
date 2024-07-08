const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const ffmpeg = require("fluent-ffmpeg");
const sharp = require("sharp");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const app = express();
app.use(express.json());

const uploadVideo = async (video) => {
  let apiUrl = "https:api.cloudinary.com/v1_1/dadt6ioi4/video/upload";
  let data = {
    file: video,
    upload_preset: "azigrdxg",
  };

  const response = await fetch(apiUrl, {
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  });
  const file = await response.json();
  console.log(file);
};

app.post("/create-timelapse", async (req, res) => {
  const { imageUrls } = req.body;
  const tempDir = path.join("/temp");
  const outputPath = path.join("/temp", "timelapse.mp4");

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  try {
    // Descargar imágenes
    const downloadPromises = imageUrls.map(async (url, index) => {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const filePath = path.join(tempDir, `image_${index}.jpg`);
      await fs.promises.writeFile(filePath, response.data);
      return filePath;
    });

    const imagePaths = await Promise.all(downloadPromises);

    const processedImagePaths = await Promise.all(
      imagePaths.map(async (path, index) => {
        const outputPath = `${tempDir}/processed_${index}.jpg`;
        await sharp(path)
          .resize(1080, 1920) // Ajusta estos valores según tus necesidades
          .toFormat("jpeg")
          .toFile(outputPath);
        return outputPath;
      })
    );

    // Crear un archivo de texto con la lista de imágenes
    const listPath = path.join(tempDir, "image_list.txt");
    const fileContent = processedImagePaths
      .map((p) => `file '${p}'\nduration 0.03`)
      .join("\n");
    await fs.promises.writeFile(listPath, fileContent);

    // Crear timelapse
    const command = ffmpeg()
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
      .output(outputPath);

    command
      .on("start", (commandLine) => {
        console.log("Comenzando FFmpeg con comando: " + commandLine);
      })
      .on("end", async () => {
        console.log("Procesamiento FFmpeg completado");
        try {
          // Subir a Cloudinary
          const result = await cloudinary.uploader.upload(outputPath, {
            resource_type: "auto",
            folder: "timelapses", // Opcional: especifica una carpeta en Cloudinary
          });

          // Enviar la URL de Cloudinary como respuesta
          res.json({
            message: "Timelapse creado y subido con éxito",
            url: result.secure_url,
          });
        } catch (uploadError) {
          console.error("Error al subir a Cloudinary:", uploadError);
          res.status(500).send("Error al subir el timelapse a Cloudinary");
        } finally {
          // Limpieza de archivos
          imagePaths.forEach((path) => fs.unlinkSync(path));
          processedImagePaths.forEach((path) => fs.unlinkSync(path));
          fs.unlinkSync(listPath);
          fs.unlinkSync(outputPath);
        }
      })
      .on("error", (err) => {
        console.error("Error FFmpeg:", err);
        res.status(500).send("Error al crear el timelapse");
      })
      .run();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error al procesar las imágenes");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
