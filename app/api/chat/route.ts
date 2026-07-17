import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { LRUCache } from "lru-cache";

type Visitor = {
  id: string;
  name: string;
  phone: string;
  school: string;
  visitor_uuid?: string;
};

// ============================================
// RATE LIMITER CONFIGURATION (Memory Cache)
// ============================================
const rateLimitCache = new LRUCache<string, number>({
  max: 500, // Maksimal melacak 500 user aktif sekaligus
  ttl: 60 * 1000, // Time-to-live: 1 menit
});

const MAX_REQUESTS_PER_MINUTE = 5;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = String(body.message || "").trim();
    const clientSessionId = body.sessionId;
    const visitor = body.visitor as Visitor | null;

    if (!message) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 });
    }

    if (!visitor) {
      return NextResponse.json({ success: false, error: "Visitor is required" }, { status: 400 });
    }

    // ============================================
    // LOGIKA RATE LIMITING
    // ============================================
    const userId = visitor.id || visitor.visitor_uuid || "anonymous";
    const currentRequests = rateLimitCache.get(userId) || 0;

    if (currentRequests >= MAX_REQUESTS_PER_MINUTE) {
      return NextResponse.json(
        { 
          success: false, 
          response: "Terlalu banyak mengirim pesan. Tolong beri jeda beberapa saat sebelum mengetik lagi.", 
          error: "RATE_LIMIT_EXCEEDED" 
        }, 
        { status: 429 } // HTTP 429 Too Many Requests
      );
    }
    
    // Tambah hit hitungan request user
    rateLimitCache.set(userId, currentRequests + 1);

    const cookieStore = await cookies();
    const sessionId = clientSessionId || cookieStore.get("chat_session_id")?.value;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Sesi tidak valid. Silakan isi data form kembali." },
        { status: 401 }
      );
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
          sessionId,
          message,
          visitorId: userId,
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