import type { Handler } from '@netlify/functions'

interface ChatMessage {
  role: 'user' | 'model'
  text: string
}

interface RequestBody {
  history?: ChatMessage[]
  message: string
  systemPrompt?: string
}

interface GeminiContent {
  role: 'user' | 'model'
  parts: { text: string }[]
}

interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string }[] } }[]
  promptFeedback?: { blockReason?: string }
}

const MODEL = 'gemini-2.0-flash'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'method not allowed' }
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GEMINI_API_KEY not configured' }),
    }
  }

  let body: RequestBody
  try {
    body = JSON.parse(event.body || '{}') as RequestBody
  } catch {
    return { statusCode: 400, body: 'invalid json' }
  }

  if (!body.message || typeof body.message !== 'string') {
    return { statusCode: 400, body: 'message required' }
  }

  const contents: GeminiContent[] = [
    ...(body.history ?? []).map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    })),
    { role: 'user', parts: [{ text: body.message }] },
  ]

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`

  const payload: Record<string, unknown> = {
    contents,
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 600,
      topP: 0.95,
    },
  }

  if (body.systemPrompt) {
    payload.systemInstruction = {
      role: 'system',
      parts: [{ text: body.systemPrompt }],
    }
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const errBody = await res.text()
      return {
        statusCode: 502,
        body: JSON.stringify({ error: `gemini ${res.status}`, detail: errBody.slice(0, 500) }),
      }
    }
    const json = (await res.json()) as GeminiResponse
    const reply =
      json.candidates?.[0]?.content?.parts
        ?.map((p) => p.text ?? '')
        .join('')
        .trim() ?? ''
    if (!reply) {
      const blockReason = json.promptFeedback?.blockReason
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: blockReason ? `blocked: ${blockReason}` : 'empty response',
        }),
      }
    }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply }),
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'network', detail: String(err) }),
    }
  }
}
