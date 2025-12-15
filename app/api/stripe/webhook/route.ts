import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20"
});

export async function POST(req: Request) {
  try {
    const sig = req.headers.get("stripe-signature");
    if (!sig) return new Response("Missing stripe-signature header", { status: 400 });

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });

    // IMPORTANT: use raw body
    const body = await req.text();

    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    // Handle events you care about
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("✅ checkout.session.completed", {
        id: session.id,
        email: session.customer_email,
        metadata: session.metadata
      });
    }

    return new Response("ok", { status: 200 });
  } catch (err: any) {
    console.error("Webhook error:", err?.message);
    return new Response(`Webhook Error: ${err?.message}`, { status: 400 });
  }
}
