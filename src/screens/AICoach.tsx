import { useEffect, useRef, useState } from 'react'
import { Icon } from '../components/Icon'
import { sendChat, ChatMessage } from '../lib/chat'

const SYSTEM_PROMPT = `You are Coach Percy Keith's AI assistant inside the PKFIT.APP fitness coaching app.
The user (Marcus, 47) is a lifestyle client — he wants to lose fat, build some muscle, and stay in shape.
He is NOT a bodybuilder. Tone: tactical, warm, no fluff, no emoji.
Reply in at most 3 short sentences unless he asks for detail.
Speak in Percy's voice — direct, joint-smart, long-game.`

interface UIMessage {
  from: 'ai' | 'user'
  text: string
}

export function ScreenAICoach() {
  const [msgs, setMsgs] = useState<UIMessage[]>([
    {
      from: 'ai',
      text:
        "Morning Marcus. I've adjusted today's session — you slept 7h 48m and your readiness is solid. Hit the bench heavy. What do you need from me?",
    },
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [msgs, busy])

  const send = async () => {
    if (!input.trim() || busy) return
    const q = input.trim()
    setMsgs((m) => [...m, { from: 'user', text: q }])
    setInput('')
    setBusy(true)
    try {
      const history: ChatMessage[] = msgs.map((m) => ({
        role: m.from === 'ai' ? 'model' : 'user',
        text: m.text,
      }))
      const reply = await sendChat({
        history,
        message: q,
        systemPrompt: SYSTEM_PROMPT,
      })
      setMsgs((m) => [...m, { from: 'ai', text: reply }])
    } catch {
      setMsgs((m) => [
        ...m,
        { from: 'ai', text: "Connection's slow — try again in a sec." },
      ])
    }
    setBusy(false)
  }

  const suggestions = ['Swap bench for incline?', "What if my shoulder's tight?", 'Macros for today?']

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#0A0A0B',
        color: '#F4F1EA',
      }}
    >
      <div
        style={{
          padding: '14px 22px',
          borderBottom: '1px solid #1C1C20',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            background: 'linear-gradient(135deg,#FF5B1F,#C7421A)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Icon name="sparkle" size={16} color="#0A0A0B" />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--display)', fontSize: 16 }}>COACH AI</div>
          <div className="mono" style={{ color: '#FF5B1F', fontSize: 9 }}>
            ● TRAINED ON PERCY'S METHOD
          </div>
        </div>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', padding: '18px 22px' }}>
        {msgs.map((m, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 12,
            }}
          >
            <div
              style={{
                maxWidth: '82%',
                padding: '12px 14px',
                borderRadius: 16,
                background: m.from === 'user' ? '#FF5B1F' : 'rgba(28,28,32,0.7)',
                color: m.from === 'user' ? '#0A0A0B' : '#F4F1EA',
                fontSize: 14,
                lineHeight: 1.45,
                borderTopRightRadius: m.from === 'user' ? 4 : 16,
                borderTopLeftRadius: m.from === 'user' ? 16 : 4,
                backdropFilter: m.from === 'ai' ? 'blur(14px) saturate(160%)' : undefined,
                WebkitBackdropFilter: m.from === 'ai' ? 'blur(14px) saturate(160%)' : undefined,
                border: m.from === 'ai' ? '1px solid rgba(255,255,255,0.06)' : undefined,
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {busy && (
          <div style={{ display: 'flex', marginBottom: 12 }}>
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 16,
                background: 'rgba(28,28,32,0.7)',
                color: '#8E8E96',
                backdropFilter: 'blur(14px) saturate(160%)',
                WebkitBackdropFilter: 'blur(14px) saturate(160%)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span className="dots" />
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '10px 22px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => setInput(s)}
            style={{
              background: 'transparent',
              border: '1px solid #2A2A30',
              color: '#F4F1EA',
              padding: '8px 12px',
              borderRadius: 999,
              fontSize: 12,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div
        style={{
          padding: '12px 22px 24px',
          borderTop: '1px solid #1C1C20',
          display: 'flex',
          gap: 8,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask anything…"
          className="input"
          style={{ flex: 1 }}
        />
        <button onClick={send} className="btn btn-primary" style={{ padding: '0 16px' }}>
          <Icon name="send" size={16} />
        </button>
      </div>
    </div>
  )
}
