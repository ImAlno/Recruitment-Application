import { Router } from "express";
import { getUsers } from "../controller/UserController";

const router = Router();

router.get("/", getUsers);

export default router;
