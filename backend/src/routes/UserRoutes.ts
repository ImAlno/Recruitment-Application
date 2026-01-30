import { Router } from "express";
import { registerUser, getUsers } from "../controllers/UserController";

const router = Router();

router.get("/", getUsers);

router.post("/register", registerUser);

export default router;
