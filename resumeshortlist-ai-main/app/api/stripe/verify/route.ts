import Stripe from "stripe";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

function signToken(payload: object, secret: string) {
  const json = JSON.stringify(payload);
  const b64 = Buffer.from(json).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(b64).digest("base64url");
  return `${b64}.${sig}`;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(new URL("/app?error=missing_session", url.origin));
  }

  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Missing ACCESS_TOKEN_SECRET" }, { status: 500 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Stripe marks it paid like this for one-time payments
    const paid = session.payment_status === "paid";

    if (!paid) {
      return NextResponse.redirect(new URL("/app?error=not_paid", url.origin));
    }

    // 7 day unlock window (change if you want)
    const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;

    const token = signToken(
      { sid: session.id, exp, email: session.customer_email ?? null },
      secret
    );

    cookies().set("rsl_access", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return NextResponse.redirect(new URL("/app?unlocked=1", url.origin));
  } catch (e: any) {
    console.error("Verify error:", e?.message);
    return NextResponse.redirect(new URL("/app?error=verify_failed", url.origin));
  }
}
