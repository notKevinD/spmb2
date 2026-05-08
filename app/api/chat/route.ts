import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId: clientSessionId } = await req.json();
    
    const cookieStore = await cookies();
    let sessionId = clientSessionId || cookieStore.get('chat_session_id')?.value;
    
    if (!sessionId) {
      sessionId = randomUUID();
    }
    
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!n8nWebhookUrl) {
      throw new Error('N8N_WEBHOOK_URL not configured');
    }
    
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sessionId,
        message: message,
        timestamp: new Date().toISOString(),
      }),
    });
    
    const data = await response.json();
    
    const nextResponse = NextResponse.json({
      success: true,
      response: data.output || data.response || data.message || "Maaf, saya tidak bisa memproses pesan Anda.",
      sessionId: sessionId,
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
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to process message' },
      { status: 500 }
    );
  }
}