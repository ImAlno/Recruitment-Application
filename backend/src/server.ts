import express from "express";
import cors from "cors";
import loader from "./api/index";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Load environment variables immediately
dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // Standard Vite port, or use true to allow all
  credentials: true
}));
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

startServer().catch(err => {
  console.error("Failed to start server:", err);
});

export default app;