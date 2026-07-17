import { NextRequest, NextResponse } from "next/server";

async function readN8nJson(response: Response) {
  const text = await response.text();
  if (!text.trim()) return null;
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Response n8n bukan JSON valid.");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      return NextResponse.json(
        { success: false, error: "N8N_WEBHOOK_URL belum dikonfigurasi." },
        { status: 500 }
      );
    }

    // 1. Tembak n8n tanpa membawa sessionId (biarkan n8n/PostgreSQL yang buat)
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        eventType: "chat_new_session",
        visitor: body.visitor,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!n8nResponse.ok) {
      return NextResponse.json(
        { success: false, error: "Gagal membuat session baru di server." },
        { status: 500 }
      );
    }

    const n8nData = await readN8nJson(n8nResponse);

    // 2. Validasi apakah n8n sukses me-return session_id dari PostgreSQL
    if (!n8nData?.success || !n8nData?.session?.session_id) {
      return NextResponse.json(
        { success: false, error: n8nData?.error || "Gagal mendapatkan Session ID dari Database." },
        { status: 500 }
      );
    }

    // Ambil UUID murni dari response n8n (berasal dari PostgreSQL)
    const dbSessionId = n8nData.session.session_id; 

    const response = NextResponse.json({
      success: true,
      sessionId: dbSessionId,
      message: "Session baru telah dibuat dari database.",
    });

    // 3. Set cookie menggunakan UUID dari PostgreSQL
    response.cookies.set("chat_session_id", dbSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("New Session Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create new session" },
      { status: 500 }
    );
  }
}