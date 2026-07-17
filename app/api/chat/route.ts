// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

type Visitor = {
  id: string;
  name: string;
  phone: string;
  school: string;
};

export async function POST(req: NextRequest) {
  console.log('🚀 Chat API called');

  try {
    const body = await req.json();
    console.log('📦 Request body:', body);

    const message = String(body.message || '').trim();
    const clientSessionId = body.sessionId;
    const visitor = body.visitor as Visitor | null;

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Message is required',
        },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();

    let sessionId =
      clientSessionId || cookieStore.get('chat_session_id')?.value;

    let isNewSession = false;

    if (!sessionId) {
      sessionId = randomUUID();
      isNewSession = true;
    }

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      const fallbackResponse = NextResponse.json({
        success: true,
        response:
          'Maaf, layanan chat sedang dalam pemeliharaan. Silakan coba lagi nanti.',
        sessionId,
      });

      fallbackResponse.cookies.set('chat_session_id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return fallbackResponse;
    }

    let responseText = '';

    try {
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
        },
        body: JSON.stringify({
          eventType: 'chat_message',
          sessionId,
          message,
          visitorId: visitor.id,
          timestamp: new Date().toISOString(),
          isNewSession,
        }),
      });

      console.log('📥 N8N response status:', n8nResponse.status);

      if (!n8nResponse.ok) {
        console.error('❌ N8N returned error:', n8nResponse.status);
        responseText = '';
      } else {
        responseText = await n8nResponse.text();
        console.log(
          '📄 N8N raw response:',
          responseText?.substring(0, 200) || '(empty)'
        );
      }
    } catch (fetchError) {
      console.error('❌ N8N fetch error:', fetchError);
      responseText = '';
    }

    let responseMessage =
      'Maaf, saya tidak bisa memproses pesan Anda saat ini.';

    if (responseText && responseText.trim()) {
      try {
        const jsonData = JSON.parse(responseText);

        responseMessage =
          jsonData.output ||
          jsonData.response ||
          jsonData.message ||
          JSON.stringify(jsonData);

        console.log('✅ Parsed JSON successfully');
      } catch {
        console.log('⚠️ Response is not JSON, using as plain text');
        responseMessage = responseText;
      }
    } else {
      responseMessage =
        'Halo! Mohon maaf, server chat sedang tidak merespon. Silakan coba lagi nanti.';
    }

    const nextResponse = NextResponse.json({
      success: true,
      response: responseMessage,
      sessionId,
    });

    nextResponse.cookies.set('chat_session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return nextResponse;
  } catch (error) {
    console.error('❌ Chat API Error:', error);

    return NextResponse.json(
      {
        success: false,
        response: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        error:
          error instanceof Error
            ? error.message
            : 'Failed to process message',
      },
      { status: 500 }
    );
  }
}