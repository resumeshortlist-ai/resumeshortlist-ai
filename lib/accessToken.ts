// lib/accessToken.ts
import crypto from "crypto";

type Payload = {
  sid: string;     // Stripe session id
  email?: string;  // optional customer email
  exp: number;     // unix seconds
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

export function signAccessToken(payload: Omit<Payload, "exp">, ttlSeconds: number) {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) throw new Error("Missing ACCESS_TOKEN_SECRET");

  const full: Payload = {
    ...payload,
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
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;

  try {
    const json = JSON.parse(Buffer.from(body.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")) as Payload;
    if (!json?.sid || !json?.exp) return null;
    if (json.exp < Math.floor(Date.now() / 1000)) return null;
    return json;
  } catch {
    return null;
  }
}
