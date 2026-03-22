import { NextResponse } from 'next/server';
import { CHAT_SYSTEM_PROMPT } from '@/lib/chat-config';
import { z } from 'zod';

// Define strict schema for chat messages
const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().max(4000).optional(), // Increased limit and made optional for streaming
});

const ChatRequestSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(100), // Increased to 100 for longer trading insights
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

    // Connect to NVIDIA NIM endpoint (OpenAI-compatible) with Streaming
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
        stream: true // Enable streaming
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('NVIDIA NIM API Error:', errorData);
      return NextResponse.json({ 
        error: 'Analysis engine is currently at capacity. Please try again in a few moments.' 
      }, { status: response.status });
    }

    // Handle the streaming response
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        if (!response.body) {
          controller.close();
          return;
        }

        const reader = response.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                controller.close();
                return;
              }
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch (e) {
                // Ignore parse errors for partial chunks
              }
            }
          }
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('Chat API Internal Error:', error);
    return NextResponse.json({ error: 'Internal gateway error' }, { status: 500 });
  }
}
