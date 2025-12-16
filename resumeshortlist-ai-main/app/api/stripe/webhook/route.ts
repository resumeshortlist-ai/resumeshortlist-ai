import Stripe from "stripe";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

function signToken(payload: object, secret: string) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const tokenSecret = process.env.ACCESS_TOKEN_SECRET;

  if (!sig) return new Response("Missing stripe-signature header", { status: 400 });
  if (!webhookSecret) return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });
  if (!tokenSecret) return new Response("Missing ACCESS_TOKEN_SECRET", { status: 500 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err?.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const token = signToken(
      {
        sessionId: session.id,
        email: session.customer_email || null,
        ts: Date.now(),
      },
      tokenSecret
    );

    console.log("✅ Paid session:", session.id);
    console.log("✅ ACCESS TOKEN:", token);
  }

  return new Response("ok", { status: 200 });
}
