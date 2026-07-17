import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// PERBAIKAN: Tambahkan visitor_uuid sebagai properti opsional agar TypeScript mengenalnya secara aman
type Visitor = {
  id: string;
  name: string;
  phone: string;
  school: string;
  visitor_uuid?: string; 
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = String(body.message || "").trim();
    const clientSessionId = body.sessionId;
    const visitor = body.visitor as Visitor | null;

    if (!message) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    
    // Sesi wajib didapatkan dari client state atau cookie store yang sah dari n8n.
    const sessionId = clientSessionId || cookieStore.get("chat_session_id")?.value;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Sesi tidak valid. Silakan isi data form kembali." },
        { status: 401 }
      );
    }

    if (!visitor) {
      return NextResponse.json({ success: false, error: "Visitor is required" }, { status: 400 });
    }

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      return NextResponse.json({
        success: true,
        response: "Maaf, layanan chat sedang dalam pemeliharaan. Silakan coba lagi nanti.",
        sessionId,
      });
    }

    let responseText = "";
    try {
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, *.*",
        },
        body: JSON.stringify({
          eventType: "chat_message",
          sessionId, // Mengirim UUID PostgreSQL ke n8n untuk tracking history chat
          message,
          // PERBAIKAN: Tidak perlu lagi menggunakan 'as any' karena tipe datanya sudah didefinisikan dengan benar
          visitorId: visitor.id || visitor.visitor_uuid, 
          timestamp: new Date().toISOString(),
          isNewSession: false,
        }),
      });

      if (n8nResponse.ok) {
        responseText = await n8nResponse.text();
      }
    } catch (fetchError) {
      console.error("❌ N8N fetch error:", fetchError);
    }

    let responseMessage = "Halo! Mohon maaf, server chat sedang tidak merespon. Silakan coba lagi nanti.";

    if (responseText && responseText.trim()) {
      try {
        const jsonData = JSON.parse(responseText);
        responseMessage = jsonData.output || jsonData.response || jsonData.message || JSON.stringify(jsonData);
      } catch {
        responseMessage = responseText;
      }
    }

    return NextResponse.json({
      success: true,
      response: responseMessage,
      sessionId,
    });
  } catch (error) {
    console.error("❌ Chat API Error:", error);
    return NextResponse.json(
      {
        success: false,
        response: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        error: error instanceof Error ? error.message : "Failed to process message",
      },
      { status: 500 }
    );
  }
}