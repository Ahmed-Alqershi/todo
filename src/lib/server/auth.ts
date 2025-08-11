import type { Role } from "@prisma/client";

const SECRET = process.env.AUTH_SECRET || "dev-secret";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64url(input: Uint8Array) {
  return btoa(String.fromCharCode(...input))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64urlDecode(str: string) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = str.length % 4;
  if (pad) str += "=".repeat(4 - pad);
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

const keyPromise = crypto.subtle.importKey(
  "raw",
  encoder.encode(SECRET),
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["sign", "verify"],
);

export async function signToken(payload: { id: string; role: Role }) {
  const key = await keyPromise;
  const header = base64url(
    encoder.encode(JSON.stringify({ alg: "HS256", typ: "JWT" })),
  );
  const body = base64url(encoder.encode(JSON.stringify(payload)));
  const data = `${header}.${body}`;
  const signatureBytes = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(data),
  );
  const signature = base64url(new Uint8Array(signatureBytes));
  return `${data}.${signature}`;
}

export async function verifyToken(
  token: string,
): Promise<{ id: string; role: Role }> {
  const [headerB64, bodyB64, signature] = token.split(".");
  if (!headerB64 || !bodyB64 || !signature) {
    throw new Error("Invalid token");
  }
  const data = `${headerB64}.${bodyB64}`;
  const key = await keyPromise;
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64urlDecode(signature),
    encoder.encode(data),
  );
  if (!valid) {
    throw new Error("Invalid signature");
  }
  const payload = JSON.parse(decoder.decode(base64urlDecode(bodyB64)));
  return payload;
}
