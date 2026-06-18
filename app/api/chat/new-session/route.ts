// app/api/chat/new-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const newSessionId = randomUUID();

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (n8nWebhookUrl) {
      try {
        await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json, text/plain, */*',
          },
          body: JSON.stringify({
            eventType: 'chat_new_session',
            sessionId: newSessionId,
            visitor: body.visitor || null,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.error('Failed to notify n8n about new session:', error);
      }
    }

    const response = NextResponse.json({
      success: true,
      sessionId: newSessionId,
      message:
        'Session baru telah dibuat. History chat sebelumnya tidak dapat diakses kembali.',
    });

    response.cookies.set('chat_session_id', newSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('New Session Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create new session',
      },
      { status: 500 }
    );
  }
}