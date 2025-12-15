import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20"
});

export async function POST(req: Request) {
  try {
    const { email, fileName } = (await req.json()) as {
      email?: string;
      fileName?: string;
    };

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

    if (!baseUrl) {
      return new Response("Missing base URL. Set NEXT_PUBLIC_BASE_URL or rely on VERCEL_URL.", {
        status: 500
      });
    }

    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) {
      return new Response("Missing STRIPE_PRICE_ID env var.", { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
      customer_email: email || undefined,
      metadata: {
        email: email || "",
        fileName: fileName || ""
      }
    });

    return Response.json({ url: session.url });
  } catch (err: any) {
    return new Response(err?.message || "Checkout error", { status: 500 });
  }
}
