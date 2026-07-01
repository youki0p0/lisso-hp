import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// OCR of a shelf photo. Two providers, preferred in this order:
//   1. Gemini (Google AI Studio key, MONSTER_GEMINI_API_KEY) — free tier, no
//      credit card. Reads text AND formats it as "商品名 x数量" lines.
//   2. Cloud Vision (MONSTER_OCR_API_KEY) — needs a GCP project with billing.
// If neither key is set, return 501 so the UI falls back to manual entry.
export async function POST(req: NextRequest) {
  const geminiKey = process.env.MONSTER_GEMINI_API_KEY;
  const visionKey = process.env.MONSTER_OCR_API_KEY;
  if (!geminiKey && !visionKey) {
    return NextResponse.json(
      {
        error: "ocr_not_configured",
        message:
          "OCRキー未設定。AI Studio の Gemini キー(MONSTER_GEMINI_API_KEY) か Cloud Vision キー(MONSTER_OCR_API_KEY) を設定してください。",
      },
      { status: 501 },
    );
  }

  const body = (await req.json().catch(() => null)) as { image?: string } | null;
  const image = body?.image;
  if (!image) return NextResponse.json({ error: "image_required" }, { status: 400 });

  const { mime, data } = splitDataUrl(image);

  try {
    const text = geminiKey
      ? await gemini(geminiKey, mime, data)
      : await vision(visionKey!, data);
    return NextResponse.json({ text, provider: geminiKey ? "gemini" : "vision" });
  } catch (err) {
    return NextResponse.json(
      { error: "ocr_failed", message: err instanceof Error ? err.message : "unknown" },
      { status: 502 },
    );
  }
}

function splitDataUrl(image: string): { mime: string; data: string } {
  const m = image.match(/^data:([^;]+);base64,(.*)$/s);
  if (m) return { mime: m[1], data: m[2] };
  return { mime: "image/jpeg", data: image };
}

const PROMPT = `この画像はシーシャ(水タバコ)フレーバーの在庫棚です。写っている商品名と本数を読み取り、1行につき1商品で「商品名 x数量」の形式だけを出力してください。数量が読めない場合は x1 とします。ブランド名＋フレーバー名がわかる範囲で正確に。前置き・説明・箇条書き記号は不要で、行のリストだけ返してください。`;

async function gemini(key: string, mime: string, data: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: PROMPT },
            { inline_data: { mime_type: mime, data } },
          ],
        },
      ],
      generationConfig: { temperature: 0 },
    }),
  });
  const json = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
    error?: { message?: string };
  };
  if (!res.ok || json.error) throw new Error(json.error?.message || `Gemini ${res.status}`);
  return (json.candidates?.[0]?.content?.parts ?? [])
    .map((p) => p.text ?? "")
    .join("\n")
    .trim();
}

async function vision(key: string, content: string): Promise<string> {
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
  const json = (await res.json()) as {
    responses?: { fullTextAnnotation?: { text?: string }; error?: { message?: string } }[];
  };
  const first = json.responses?.[0];
  if (!res.ok || first?.error?.message)
    throw new Error(first?.error?.message || `Vision ${res.status}`);
  return first?.fullTextAnnotation?.text ?? "";
}
