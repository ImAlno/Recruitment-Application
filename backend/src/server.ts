import { config } from "dotenv";
import express from "express";
import cors from "cors";
import userRoutes from "./api/UserRoutes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

config();

const PORT = process.env.PORT || 4000;

const server =app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default server;