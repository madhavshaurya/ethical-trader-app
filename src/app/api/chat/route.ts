import { NextResponse } from 'next/server';
import { CHAT_SYSTEM_PROMPT } from '@/lib/chat-config';
import { z } from 'zod';

// Define strict schema for chat messages
const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1).max(2000), // Prevent giant payloads
});

const ChatRequestSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(50), // Prevent context-stuffing attacks
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Validate Input
    const parseResult = ChatRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ 
        error: 'Invalid request format', 
        details: parseResult.error.issues 
      }, { status: 400 });
    }

    const { messages } = parseResult.data;
    const apiKey = process.env.NVIDIA_API_KEY;

    if (!apiKey) {
      console.error('NVIDIA_API_KEY is missing from environment variables');
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }

    // Connect to NVIDIA NIM endpoint (OpenAI-compatible)
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: "qwen/qwen3.5-122b-a10b",
        messages: [
          { role: 'system', content: CHAT_SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 4096,
        temperature: 0.6,
        top_p: 0.95,
        stream: false
      })
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      // SECURE LOGGING: Log internally, but send a generic error to the client
      console.error('NVIDIA Raw Response Error (Not JSON):', responseText);
      return NextResponse.json({ 
        error: 'High-intelligence engine encountered a processing error. Please try again shortly.' 
      }, { status: 502 });
    }

    if (!response.ok) {
      console.error('NVIDIA NIM API Error:', data);
      return NextResponse.json({ 
        error: 'Analysis engine is currently at capacity. Please try again in a few moments.' 
      }, { status: response.status });
    }

    const aiMessage = data.choices?.[0]?.message?.content || 'Error: Could not retrieve response.';
    
    return NextResponse.json({ message: aiMessage });
  } catch (error: any) {
    // SECURE LOGGING: Mask internal errors
    console.error('Chat API Internal Error:', error);
    return NextResponse.json({ error: 'Internal gateway error' }, { status: 500 });
  }
}
