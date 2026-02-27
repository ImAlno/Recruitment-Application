import express from "express";
import cors from "cors";
import loader from "./api/index";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { clearLine } from "node:readline";

// Load environment variables immediately
dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    //allowedHeaders: ["Content-Type", "Authorization"], // Headers to allow
    credentials: true,
  }),
);
app.use(express.json());

/**
 * Initialize and load all API handlers.
 * We wrap this in an async function to ensure routes are loaded
 * before the server starts listening.
 */
const startServer = async () => {
  const apiRouter = express.Router();
  await loader.loadHandlers(apiRouter);
  loader.loadErrorHandlers(apiRouter);

  // Mount all handlers under the /api prefix to match frontend config
  app.use("/api", apiRouter);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});

export default app;
