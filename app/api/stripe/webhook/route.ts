import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // If TypeScript complains about apiVersion, you can leave this out.
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig) {
    return new NextResponse("Missing Stripe-Signature header", { status: 400 });
  }
  if (!webhookSecret) {
    return new NextResponse("Missing STRIPE_WEBHOOK_SECRET env var", { status: 500 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err?.message ?? "Invalid signature"}`, {
      status: 400,
    });
  }

  // Handle events you care about
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("✅ checkout.session.completed", {
        id: session.id,
        email: session.customer_details?.email,
        amount_total: session.amount_total,
        currency: session.currency,
        payment_status: session.payment_status,
      });

      // TODO: mark the user as paid / grant access / store to DB, etc.
      break;
    }

    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("✅ async_payment_succeeded", { id: session.id });
      break;
    }

    case "checkout.session.async_payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("❌ async_payment_failed", { id: session.id });
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
