import crypto from "crypto";

import type { Role } from "./user-store";

const SECRET = process.env.AUTH_SECRET || "dev-secret";

function base64url(input: Buffer) {
  return input
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function signToken(payload: { id: string; role: Role }) {
  const header = base64url(Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const body = base64url(Buffer.from(JSON.stringify(payload)));
  const data = `${header}.${body}`;
  const signature = base64url(crypto.createHmac("sha256", SECRET).update(data).digest());
  return `${data}.${signature}`;
}

export function verifyToken(token: string): { id: string; role: Role } {
  const [headerB64, bodyB64, signature] = token.split(".");
  if (!headerB64 || !bodyB64 || !signature) {
    throw new Error("Invalid token");
  }
  const data = `${headerB64}.${bodyB64}`;
  const expected = base64url(crypto.createHmac("sha256", SECRET).update(data).digest());
  if (signature !== expected) {
    throw new Error("Invalid signature");
  }
  const payload = JSON.parse(Buffer.from(bodyB64, "base64").toString());
  return payload;
}
