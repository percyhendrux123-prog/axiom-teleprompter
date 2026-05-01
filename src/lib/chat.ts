export interface ChatMessage {
  role: 'user' | 'model'
  text: string
}

export interface ChatRequestBody {
  history: ChatMessage[]
  message: string
  systemPrompt?: string
}

export interface ChatResponseBody {
  reply: string
}

const ENDPOINT = '/.netlify/functions/chat'

export async function sendChat(body: ChatRequestBody): Promise<string> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`chat ${res.status}: ${text || res.statusText}`)
  }
  const json = (await res.json()) as ChatResponseBody
  return json.reply
}
