import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function POST() {
  try {
    const newSessionId = randomUUID();

    const response = NextResponse.json({
      success: true,
      sessionId: newSessionId,
      message: 'Session baru telah dibuat. History chat sebelumnya tidak dapat diakses kembali.',
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
        error: 'Failed to create new session' 
      },
      { status: 500 }
    );
  }
}