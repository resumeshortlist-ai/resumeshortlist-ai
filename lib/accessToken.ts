// lib/accessToken.ts
import crypto from "crypto";

type Payload = {
  sid: string;
  email?: string | null;
  exp: number; // unix seconds
};

function b64url(input: string | Buffer) {
  const buf = typeof input === "string" ? Buffer.from(input) : input;
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function b64urlJson(obj: any) {
  return b64url(JSON.stringify(obj));
}

function hmac(secret: string, data: string) {
  return b64url(crypto.createHmac("sha256", secret).update(data).digest());
}

function fromB64urlToJson<T>(b64urlStr: string): T {
  const b64 = b64urlStr.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 ? "=".repeat(4 - (b64.length % 4)) : "";
  const json = Buffer.from(b64 + pad, "base64").toString("utf8");
  return JSON.parse(json) as T;
}

export function signAccessToken(
  payload: { sid: string; email?: string | null },
  ttlSeconds: number
) {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) throw new Error("Missing ACCESS_TOKEN_SECRET");

  const full: Payload = {
    sid: payload.sid,
    email: payload.email ?? null,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };

  const body = b64urlJson(full);
  const sig = hmac(secret, body);
  return `${body}.${sig}`;
}

export function verifyAccessToken(token: string): Payload | null {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) return null;

  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = hmac(secret, body);

  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }

  try {
    const payload = fromB64urlToJson<Payload>(body);
    if (!payload?.sid || !payload?.exp) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
