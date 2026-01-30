import { User } from "../models/UserModel";
import pool from "../config/db";

export const createUser = async (userData: User): Promise<User> => {
  const {name, email, password} = userData;

  const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [name, email, password];

  const result = await pool.query(query, values);

  return result.rows[0];
};

export const fetchUsers = async (): Promise<User[]> => {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
};