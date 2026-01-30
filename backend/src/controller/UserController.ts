import { Request, Response } from "express";
import { fetchUsers } from "../util/UserService";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await fetchUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};