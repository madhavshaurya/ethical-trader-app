import { NextResponse } from 'next/server';
import { CHAT_SYSTEM_PROMPT } from '@/lib/chat-config';
import { z } from 'zod';

const NIM_ENDPOINT = 'https://integrate.api.nvidia.com/v1/chat/completions';

/**
 * NVIDIA retires NIM models on a published end-of-life date, after which every
 * request returns 410 Gone. The previous model (qwen/qwen3.5-122b-a10b) hit EOL on
 * 2026-07-20 and silently took the chatbot down. If the assistant starts erroring,
 * check the server logs for a 410 and pick a current model from:
 *   curl https://integrate.api.nvidia.com/v1/models -H "Authorization: Bearer $NVIDIA_API_KEY"
 * Note that the account cannot call every listed model — some return 404 "Not found
 * for account". This one is verified working and streams plain content (no reasoning
 * tokens, which would otherwise stall visible output).
 */
const NIM_MODEL = 'nvidia/llama-3.3-nemotron-super-49b-v1';

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
    const response = await fetch(NIM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: NIM_MODEL,
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
      console.error(`NVIDIA NIM API Error (HTTP ${response.status}) model=${NIM_MODEL}:`, errorData);

      // Distinguish the failure modes so the log says what actually happened and the
      // user is not told "at capacity" when the model has been retired or the key is bad.
      let error = 'The assistant is temporarily unavailable. Please try again shortly.';
      if (response.status === 429) {
        error = 'The assistant is at capacity right now. Please try again in a few moments.';
      } else if (response.status === 410 || response.status === 404) {
        error = 'The assistant is offline for maintenance. Our team has been notified.';
        console.error(
          `NIM model "${NIM_MODEL}" is gone or not available to this account — it needs replacing.`
        );
      } else if (response.status === 401 || response.status === 403) {
        error = 'The assistant is offline for maintenance. Our team has been notified.';
        console.error('NVIDIA_API_KEY was rejected — check the key is valid and not expired.');
      }

      return NextResponse.json({ error }, { status: response.status });
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
        // A network chunk can end mid-line, so hold the trailing fragment and prepend
        // it to the next read. Parsing per-chunk dropped whole tokens at boundaries.
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? ''; // last element is an incomplete line

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data: ')) continue;

            const data = trimmed.slice(6);
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
            } catch {
              // A malformed line here is genuinely unparseable, not a split chunk.
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

  } catch (error) {
    console.error('Chat API Internal Error:', error);
    return NextResponse.json({ error: 'Internal gateway error' }, { status: 500 });
  }
}
