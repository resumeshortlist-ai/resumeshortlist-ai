// app/api/access/issue/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signAccessToken } from "../../../../lib/accessToken";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  // accept form POST or JSON
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

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not confirmed" }, { status: 403 });
    }

    const email =
      session.customer_details?.email ?? session.customer_email ?? null;

    // issue token for 24 hours
    const token = signAccessToken({ sid: session.id, email }, 60 * 60 * 24);

    cookies().set("rsl_access", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.redirect(new URL("/app", req.url));
  } catch (e: any) {
    console.error("Access issue error:", e?.message);
    return NextResponse.json({ error: e?.message || "Failed to issue access" }, { status: 500 });
  }
}
