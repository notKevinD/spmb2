// app/api/chat/start/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

type Visitor = {
  name: string;
  phone: string;
  school: string;
};

function normalizePhone(phone: string) {
  let number = phone.replace(/\D/g, '');

  if (number.startsWith('0')) {
    number = '62' + number.slice(1);
  }

  if (number.startsWith('620')) {
    number = '62' + number.slice(3);
  }

  return number;
}

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
    const body = await req.json();

    const name = String(body.name || '').trim();
    const phone = String(body.phone || '').trim();
    const school = String(body.school || '').trim();

    if (!name || !phone || !school) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nama, nomor WhatsApp, dan asal sekolah wajib diisi.',
        },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhone(phone);

    if (normalizedPhone.length < 10 || normalizedPhone.length > 15) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nomor WhatsApp tidak valid.',
        },
        { status: 400 }
      );
    }

    const sessionId = randomUUID();

    const visitor: Visitor = {
      name,
      phone: normalizedPhone,
      school,
    };

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
        eventType: 'lead_registered',
        sessionId,
        visitor,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!n8nResponse.ok) {
      console.error('N8N start session error:', n8nResponse.status);

      return NextResponse.json(
        {
          success: false,
          error: 'Gagal membuat session di server.',
        },
        { status: 500 }
      );
    }

    const n8nData = await readN8nJson(n8nResponse);

    if (!n8nData?.success) {
      return NextResponse.json(
        {
          success: false,
          error: n8nData?.error || 'Session gagal dibuat di n8n.',
        },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      sessionId,
      visitor,
      message: 'Session berhasil dibuat.',
    });

    response.cookies.set('chat_session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Start Chat Error:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to start chat session',
      },
      { status: 500 }
    );
  }
}