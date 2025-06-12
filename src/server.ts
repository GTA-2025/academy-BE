import express, { Application, Request, Response, NextFunction } from "express";
import "dotenv/config";
import { connectDB } from "./configs/db";
import cors from "cors";
import { logger } from "./configs/logger";

const app: Application = express();
const PORT: number = +(process.env.PORT ?? 4040);

// Middleware

app.use(express.json());
app.use(express.urlencoded({ limit: 500 }));
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })
);
// HTTP request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.http(`[-> ${req.method} ${req.url} - IP: ${req.ip}`);

  // Log response when finished
  res.on("finish", () => {
    logger.http(`${req.method} ${req.url} - Status: ${res.statusCode} <-]`);
  });

  next();
});

app.get("/api/gta/v1/health", (req: Request, res: Response) => {
  res.status(200).json({ message: " everywhere good" });
});

logger;
connectDB();
app.listen(PORT, () => logger.info("Server is running on " + PORT));
