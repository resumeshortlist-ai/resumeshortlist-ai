// app/api/access/issue/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signAccessToken } from "@/lib/accessToken";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  // accept either form POST or JSON
  let sessionId: string | null = null;

  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const body = await req.json().catch(() => ({}));
    sessionId = body?.session_id ?? null;
  } else {
    const form = await req.formData().catch(() => null);
    sessionId = (form?.get("session_id") as string) || null;
  }

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  // verify paid with Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return NextResponse.json({ error: "Payment not confirmed" }, { status: 403 });
  }

  const email =
    session.customer_details?.email ?? session.customer_email ?? undefined;

  // issue token (24h)
  const token = signAccessToken(
    { sid: session.id, email },
    60 * 60 * 24
  );

  // set HttpOnly cookie
  cookies().set("rsl_access", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  // send them back to the app
  return NextResponse.redirect(new URL("/app", req.url));
}
