import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // 🔥 PERBAIKAN: await cookies()
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('chat_session_id')?.value;
    
    return NextResponse.json({
      success: true,
      sessionId: sessionId || null,
    });
    
  } catch (error) {
    console.error('Get Session Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get session' },
      { status: 500 }
    );
  }
}