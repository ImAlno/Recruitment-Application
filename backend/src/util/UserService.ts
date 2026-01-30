import { User } from "../model/UserModel";

export const fetchUsers = async (): Promise<User[]> => {
  // Fake data for now
  return [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
  ];
};