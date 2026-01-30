import { Router } from "express";
import { getUsers } from "../controller/Controller";

const router = Router();

router.get("/", getUsers);

export default router;
