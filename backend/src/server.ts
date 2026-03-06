import express from "express";
import cors from "cors";
import loader from "./api/index";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Load environment variables immediately
dotenv.config();

/**
 * Main application entry point for the Express server.
 * Defines middleware, attaches API handlers, and starts listening on the configured port.
 */
const app = express();

// Middleware
app.use(cookieParser());

// Read allowed origins from env file and split into an array

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

/**
 * Initializes and loads all API handlers.
 * Extracted into an async function to ensure routes are fully mounted
 * before the HTTP server starts listening for connections.
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