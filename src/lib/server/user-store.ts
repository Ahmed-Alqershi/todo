import crypto from "crypto";

export type Role = "admin" | "user";

export interface UserRecord {
  id: string;
  email: string;
  password: string;
  role: Role;
}

const users: UserRecord[] = [
  { id: "1", email: "admin@example.com", password: "adminpass", role: "admin" },
];

export function getUsers(): UserRecord[] {
  return users;
}

export function findUser(email: string): UserRecord | undefined {
  return users.find((u) => u.email === email);
}

export function createUser(data: { email: string; password: string; role?: Role }): UserRecord {
  const user: UserRecord = {
    id: crypto.randomUUID(),
    email: data.email,
    password: data.password,
    role: data.role ?? "user",
  };
  users.push(user);
  return user;
}
