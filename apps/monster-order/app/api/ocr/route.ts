import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Real OCR via Google Cloud Vision (TEXT_DETECTION). The shelf photo is sent as
// base64 from the client; the API key stays server-side (MONSTER_OCR_API_KEY).
// Japanese is auto-detected. If no key is configured, return 501 so the UI can
// fall back to manual entry.
export async function POST(req: NextRequest) {
  const key = process.env.MONSTER_OCR_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "ocr_not_configured", message: "MONSTER_OCR_API_KEY 未設定" },
      { status: 501 },
    );
  }

  const body = (await req.json().catch(() => null)) as { image?: string } | null;
  const image = body?.image;
  if (!image) {
    return NextResponse.json({ error: "image_required" }, { status: 400 });
  }
  // Accept data URLs or raw base64.
  const content = image.includes(",") ? image.slice(image.indexOf(",") + 1) : image;

  try {
    const res = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [
            {
              image: { content },
              features: [{ type: "TEXT_DETECTION" }],
              imageContext: { languageHints: ["ja", "en"] },
            },
          ],
        }),
      },
    );
    const data = (await res.json()) as {
      responses?: { fullTextAnnotation?: { text?: string }; error?: { message?: string } }[];
    };
    if (!res.ok) {
      return NextResponse.json({ error: "vision_error", detail: data }, { status: 502 });
    }
    const first = data.responses?.[0];
    if (first?.error?.message) {
      return NextResponse.json({ error: "vision_error", message: first.error.message }, { status: 502 });
    }
    const text = first?.fullTextAnnotation?.text ?? "";
    return NextResponse.json({ text });
  } catch (err) {
    return NextResponse.json(
      { error: "ocr_failed", message: err instanceof Error ? err.message : "unknown" },
      { status: 502 },
    );
  }
}
