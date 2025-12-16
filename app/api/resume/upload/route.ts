// app/api/resume/upload/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

type ClientPayload = {
  sessionId?: string;
  email?: string;
};

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,

      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        // 1) Read what the client sent us
        let payload: ClientPayload = {};
        try {
          payload = clientPayload ? (JSON.parse(clientPayload) as ClientPayload) : {};
        } catch {
          payload = {};
        }

        // 2) Require Stripe session_id (from success page)
        const sessionId = payload.sessionId;
        if (!sessionId) {
          throw new Error("Missing sessionId. Please complete checkout first.");
        }

        // 3) Verify payment with Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const paid = session.payment_status === "paid" || session.status === "complete";
        if (!paid) {
          throw new Error("Payment not confirmed for this session.");
        }

        // 4) Only allow PDF + DOCX, and make the pathname unguessable
        return {
          allowedContentTypes: [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            sessionId,
            email: payload.email || null,
          }),
        };
      },

      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This runs after the browser finishes uploading (not reliable on localhost without tunneling)
        console.log("✅ resume upload completed", {
          url: blob.url,
          pathname: blob.pathname,
          tokenPayload,
        });

        // Later: trigger parsing / ATS scoring pipeline here.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
