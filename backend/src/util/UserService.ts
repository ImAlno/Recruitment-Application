import { Applicant } from "../model/Applicant";

export const fetchUsers = async (): Promise<Applicant[]> => {
  // Fake data for now
  return [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
  ];
};