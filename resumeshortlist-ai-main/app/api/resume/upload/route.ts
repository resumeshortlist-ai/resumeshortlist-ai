// app/api/resume/upload/route.ts
import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ClientPayload = {
  sessionId?: string;
  email?: string;
};

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      request,
      body,

      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        let payload: ClientPayload = {};
        try {
          payload = clientPayload ? (JSON.parse(clientPayload) as ClientPayload) : {};
        } catch {
          payload = {};
        }

        return {
          allowedContentTypes: [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            email: payload.email || null,
            sessionId: payload.sessionId || null
          })
        };
      },

      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("✅ Upload completed", {
          url: blob.url,
          pathname: blob.pathname,
          tokenPayload
        });
      }
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
