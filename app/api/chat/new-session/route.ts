// app/api/chat/new-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

async function readN8nJson(response: Response) {
  const text = await response.text();

  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Response n8n bukan JSON valid.');
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const newSessionId = randomUUID();
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'N8N_WEBHOOK_URL belum dikonfigurasi.',
        },
        { status: 500 }
      );
    }

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        eventType: 'chat_new_session',
        sessionId: newSessionId,
        visitor: body.visitor || null,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!n8nResponse.ok) {
      console.error('N8N new session error:', n8nResponse.status);

      return NextResponse.json(
        {
          success: false,
          error: 'Gagal membuat session baru di server.',
        },
        { status: 500 }
      );
    }

    const n8nData = await readN8nJson(n8nResponse);

    if (!n8nData?.success) {
      return NextResponse.json(
        {
          success: false,
          error: n8nData?.error || 'Session baru gagal dibuat di n8n.',
        },
        { status: 500 }
      );
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
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create new session',
      },
      { status: 500 }
    );
  }
}