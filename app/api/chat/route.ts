// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  console.log('🚀 Chat API called');
  
  try {
    const body = await req.json();
    console.log('📦 Request body:', body);
    
    const { message, sessionId: clientSessionId } = body;
    
    if (!message) {
      console.error('❌ No message provided');
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }
    
    const cookieStore = await cookies();
    let sessionId = clientSessionId || cookieStore.get('chat_session_id')?.value;
    let isNewSession = false;
    
    console.log('🔑 Session ID:', sessionId);
    
    if (!sessionId) {
      sessionId = randomUUID();
      isNewSession = true;
      console.log('✨ New session created:', sessionId);
    }
    
    // N8N Webhook
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    console.log('🔗 N8N URL:', n8nWebhookUrl ? 'Configured' : 'MISSING!');
    
    if (!n8nWebhookUrl) {
      console.error('❌ N8N_WEBHOOK_URL not configured');
      
      const fallbackResponse = NextResponse.json({
        success: true,
        response: "Maaf, layanan chat sedang dalam pemeliharaan. Silakan coba lagi nanti.",
        sessionId: sessionId,
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
    
    console.log('📤 Sending to n8n...');
    
    let responseText;
    try {
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*'
        },
        body: JSON.stringify({
          sessionId: sessionId,
          message: message,
          timestamp: new Date().toISOString(),
          isNewSession: isNewSession
        }),
      });
      
      console.log('📥 N8N response status:', n8nResponse.status);
      
      // Baca response sebagai text dulu
      responseText = await n8nResponse.text();
      console.log('📄 N8N raw response:', responseText?.substring(0, 200) || '(empty)');
      
    } catch (fetchError) {
      console.error('❌ N8N fetch error:', fetchError);
      responseText = '';
    }
    
    // Parse response
    let responseMessage = "Maaf, saya tidak bisa memproses pesan Anda.";
    
    if (responseText && responseText.trim()) {
      try {
        const jsonData = JSON.parse(responseText);
        responseMessage = jsonData.output || 
                         jsonData.response || 
                         jsonData.message || 
                         JSON.stringify(jsonData);
        console.log('✅ Parsed JSON successfully');
      } catch {
        console.log('⚠️ Response is not JSON, using as plain text');
        responseMessage = responseText;
      }
    } else {
      console.log('⚠️ Empty response from N8N');
      responseMessage = "Halo! Mohon maaf, server chat sedang tidak merespon. Silakan coba lagi nanti.";
    }
    
    console.log('📤 Final response:', responseMessage.substring(0, 100));
    
    const nextResponse = NextResponse.json({
      success: true,
      response: responseMessage,
      sessionId: sessionId,
    });
    
    // Set cookie untuk session
    nextResponse.cookies.set('chat_session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    
    console.log('✅ Response sent successfully');
    return nextResponse;
    
  } catch (error) {
    console.error('❌ Chat API Error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json(
      { 
        success: false, 
        response: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        error: error instanceof Error ? error.message : 'Failed to process message'
      },
      { status: 500 }
    );
  }
}