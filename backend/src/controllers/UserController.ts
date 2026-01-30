import { Request, Response } from "express";
import { createUser, fetchUsers } from "../services/UserService";



export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Missing email or password" });
      return;
    }

    const newUser = await createUser({
      name: firstName,
      email,
      password
    });

    res.status(201).json({ message: "User created successfully", user: newUser });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await fetchUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};