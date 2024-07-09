import express from "express";
import dotenv from "dotenv";
import timelapseRoutes from "./routes/timelapse.routes";
import usersRouter from "./routes/users.routes";
import objectivesRouter from "./routes/objectives.routes";
import { verifyFirebaseToken } from "./middleware/verifyFirebaseToken";
import cron from "node-cron";

dotenv.config();

const app = express();
app.use(express.json());
app.use(verifyFirebaseToken);

app.use("/api/create-timelapse", timelapseRoutes);
app.use("/api/users", usersRouter);
app.use("/api/objectives", objectivesRouter);

// Configura tu tarea cron
cron.schedule("* * * * *", async (now) => {
  console.log("Ejecutando una tarea a la hora: ", now);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
