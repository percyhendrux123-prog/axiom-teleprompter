import { useEffect, useRef, useState, useCallback } from 'react'

const SCRIPT_KEY = 'axiom-teleprompter:script'
const DRAFT_KEY = 'axiom-teleprompter:draft'
const SETTINGS_KEY = 'axiom-teleprompter:settings'

type Settings = {
  speed: number
  fontSize: number
  mirrored: boolean
}

const defaultSettings: Settings = {
  speed: 120,
  fontSize: 48,
  mirrored: false,
}

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return defaultSettings
    const parsed = JSON.parse(raw)
    return { ...defaultSettings, ...parsed }
  } catch {
    return defaultSettings
  }
}

export default function App() {
  const [script, setScript] = useState<string>(() => localStorage.getItem(SCRIPT_KEY) ?? '')
  const [draftScript, setDraftScript] = useState<string>(
    () => localStorage.getItem(DRAFT_KEY) ?? localStorage.getItem(SCRIPT_KEY) ?? '',
  )
  const [mode, setMode] = useState<'edit' | 'view'>(() =>
    (localStorage.getItem(SCRIPT_KEY) ?? '').trim() ? 'view' : 'edit',
  )
  const [playing, setPlaying] = useState(false)
  const [scrollPos, setScrollPos] = useState(0)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [showControls, setShowControls] = useState(true)

  const initial = loadSettings()
  const [speed, setSpeed] = useState<number>(initial.speed)
  const [fontSize, setFontSize] = useState<number>(initial.fontSize)
  const [mirrored, setMirrored] = useState<boolean>(initial.mirrored)

  const cardRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const countdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Persist script
  useEffect(() => {
    if (script) localStorage.setItem(SCRIPT_KEY, script)
  }, [script])

  // Persist draft on every keystroke
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, draftScript)
  }, [draftScript])

  // Persist settings
  useEffect(() => {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({ speed, fontSize, mirrored }),
    )
  }, [speed, fontSize, mirrored])

  // Scroll animation
  useEffect(() => {
    if (!playing || mode !== 'view' || countdown !== null) return

    let lastTime = performance.now()

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      const containerWidth = textRef.current?.clientWidth ?? 800
      const avgCharWidth = fontSize * 0.55
      const charsPerLine = Math.max(20, containerWidth / avgCharWidth)
      const wordsPerLine = Math.max(2, charsPerLine / 5.2)
      const lineHeight = fontSize * 1.4
      const linesPerSec = speed / 60 / wordsPerLine
      const pxPerSec = linesPerSec * lineHeight

      setScrollPos(prev => {
        const next = prev + pxPerSec * dt
        const max = textRef.current?.scrollHeight ?? 0
        if (next > max) return max
        return next
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [playing, speed, fontSize, mode, countdown])

  // Countdown handling
  useEffect(() => {
    if (countdown === null) return
    if (countdown <= 0) {
      setCountdown(null)
      setPlaying(true)
      return
    }
    countdownTimerRef.current = setTimeout(() => {
      setCountdown(c => (c === null ? null : c - 1))
    }, 800)
    return () => {
      if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current)
    }
  }, [countdown])

  // Auto-fade controls
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const reset = () => {
      setShowControls(true)
      clearTimeout(timeout)
      timeout = setTimeout(() => setShowControls(false), 2500)
    }
    reset()
    window.addEventListener('mousemove', reset)
    window.addEventListener('touchstart', reset, { passive: true })
    window.addEventListener('keydown', reset)
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('mousemove', reset)
      window.removeEventListener('touchstart', reset)
      window.removeEventListener('keydown', reset)
    }
  }, [])

  const handlePlay = useCallback(() => {
    if (playing) {
      setPlaying(false)
      setCountdown(null)
      return
    }
    if (countdown !== null) {
      setCountdown(null)
      return
    }
    if (scrollPos === 0) {
      setCountdown(3)
    } else {
      setPlaying(true)
    }
  }, [playing, countdown, scrollPos])

  const handleRestart = useCallback(() => {
    setPlaying(false)
    setCountdown(null)
    setScrollPos(0)
  }, [])

  const handleLoad = useCallback(() => {
    const trimmed = draftScript.trim()
    if (!trimmed) return
    setScript(draftScript)
    localStorage.setItem(SCRIPT_KEY, draftScript)
    setMode('view')
    setScrollPos(0)
    setPlaying(false)
  }, [draftScript])

  const handleEdit = useCallback(() => {
    setPlaying(false)
    setCountdown(null)
    setDraftScript(script)
    setMode('edit')
  }, [script])

  const handleClear = useCallback(() => {
    setDraftScript('')
    localStorage.removeItem(DRAFT_KEY)
  }, [])

  const handleFullscreen = useCallback(() => {
    const el = document.documentElement
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {})
    } else {
      document.exitFullscreen?.().catch(() => {})
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (mode !== 'view') return
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT')) return

      if (e.key === ' ') {
        e.preventDefault()
        handlePlay()
      } else if (e.key === 'r' || e.key === 'R') {
        handleRestart()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSpeed(s => Math.min(220, s + 5))
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSpeed(s => Math.max(20, s - 5))
      } else if (e.key === '+' || e.key === '=') {
        setFontSize(s => Math.min(140, s + 4))
      } else if (e.key === '-' || e.key === '_') {
        setFontSize(s => Math.max(20, s - 4))
      } else if (e.key === 'f' || e.key === 'F') {
        handleFullscreen()
      } else if (e.key === 'm' || e.key === 'M') {
        setMirrored(m => !m)
      } else if (e.key === 'Escape') {
        setPlaying(false)
        setCountdown(null)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [mode, handlePlay, handleRestart, handleFullscreen])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050505] font-fraunces text-[#F5F1E8]">
      {/* Brand bug */}
      <div className="pointer-events-none fixed left-6 top-6 z-50 select-none font-fraunces text-[15px] font-semibold tracking-tight text-[#F5F1E8]/70">
        axiom · teleprompter
      </div>

      {/* The glass sheet */}
      <div className="fixed inset-0 z-10 flex items-center justify-center px-3 py-3 md:px-12 md:py-10">
        <div
          ref={cardRef}
          className="fade-in relative h-[96vh] w-full overflow-hidden rounded-[18px] md:h-[78vh] md:w-[82%]"
          style={{
            background: 'rgba(20,18,20,0.45)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow:
              'inset 0 0 80px rgba(255,240,220,0.04), 0 30px 80px rgba(0,0,0,0.55)',
            opacity: 0.97,
          }}
        >
          {mode === 'edit' ? (
            <EditPanel
              draftScript={draftScript}
              setDraftScript={setDraftScript}
              onLoad={handleLoad}
              onClear={handleClear}
            />
          ) : (
            <ViewPanel
              script={script}
              fontSize={fontSize}
              mirrored={mirrored}
              scrollPos={scrollPos}
              textRef={textRef}
            />
          )}
        </div>
      </div>

      {/* Countdown overlay */}
      {countdown !== null && countdown > 0 && (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center">
          <div
            key={countdown}
            className="countdown-digit font-fraunces text-[180px] font-medium leading-none text-[#F5F1E8] md:text-[240px]"
            style={{ textShadow: '0 0 80px rgba(255,240,220,0.35)' }}
          >
            {countdown}
          </div>
        </div>
      )}

      {/* Controls dock */}
      {mode === 'view' && (
        <div
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 md:bottom-12"
          style={{
            opacity: showControls ? 1 : 0,
            pointerEvents: showControls ? 'auto' : 'none',
            transform: `translateX(-50%) translateY(${showControls ? 0 : 8}px)`,
          }}
        >
          <ControlDock
            playing={playing}
            speed={speed}
            fontSize={fontSize}
            mirrored={mirrored}
            onPlay={handlePlay}
            onRestart={handleRestart}
            onSpeed={setSpeed}
            onFontSize={setFontSize}
            onMirror={() => setMirrored(m => !m)}
            onFullscreen={handleFullscreen}
            onEdit={handleEdit}
          />
        </div>
      )}
    </div>
  )
}

function EditPanel({
  draftScript,
  setDraftScript,
  onLoad,
  onClear,
}: {
  draftScript: string
  setDraftScript: (s: string) => void
  onLoad: () => void
  onClear: () => void
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 p-6 md:gap-7 md:p-12">
      <div className="font-fraunces text-2xl font-medium text-[#F5F1E8]/85 md:text-3xl">
        Paste your script
      </div>
      <textarea
        value={draftScript}
        onChange={e => setDraftScript(e.target.value)}
        placeholder="Start typing or paste here. Auto-saves as you go."
        className="w-full max-w-3xl flex-1 resize-none bg-transparent font-fraunces text-base leading-relaxed text-[#F5F1E8] placeholder-[#F5F1E8]/30 focus:outline-none md:text-lg"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
          padding: '20px 22px',
          maxHeight: '60vh',
        }}
        autoFocus
      />
      <div className="flex items-center gap-3">
        <button
          onClick={onClear}
          className="rounded-full px-5 py-2.5 font-fraunces text-sm text-[#F5F1E8]/60 transition-colors hover:bg-white/5 hover:text-[#F5F1E8]/90"
        >
          Clear
        </button>
        <button
          onClick={onLoad}
          disabled={!draftScript.trim()}
          className="rounded-full px-7 py-2.5 font-fraunces text-base font-medium transition-all"
          style={{
            background: 'rgba(245,241,232,0.94)',
            color: '#0a0a0a',
            opacity: draftScript.trim() ? 1 : 0.35,
            boxShadow: draftScript.trim()
              ? '0 8px 32px rgba(245,241,232,0.18)'
              : 'none',
          }}
        >
          Load
        </button>
      </div>
      <div className="font-fraunces text-[11px] uppercase tracking-[0.18em] text-[#F5F1E8]/35">
        Space · play  ·  R · restart  ·  ↑↓ · speed  ·  M · mirror  ·  F · full-screen
      </div>
    </div>
  )
}

function ViewPanel({
  script,
  fontSize,
  mirrored,
  scrollPos,
  textRef,
}: {
  script: string
  fontSize: number
  mirrored: boolean
  scrollPos: number
  textRef: React.RefObject<HTMLDivElement>
}) {
  return (
    <div
      className="no-scrollbar relative h-full w-full overflow-hidden"
      style={{ transform: mirrored ? 'scaleX(-1)' : undefined }}
    >
      {/* Reading line */}
      <div
        className="pointer-events-none absolute left-0 right-0 z-10"
        style={{
          top: '38%',
          height: '1px',
          background:
            'linear-gradient(to right, transparent, rgba(255,240,220,0.18), transparent)',
        }}
      />
      {/* Top + bottom fade masks */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 md:h-32"
        style={{
          background:
            'linear-gradient(to bottom, rgba(20,18,20,0.85), rgba(20,18,20,0))',
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 md:h-32"
        style={{
          background:
            'linear-gradient(to top, rgba(20,18,20,0.85), rgba(20,18,20,0))',
        }}
      />

      <div
        ref={textRef}
        className="px-6 text-center md:px-16"
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: 1.4,
          color: 'rgba(245,241,232,0.92)',
          fontWeight: 500,
          paddingTop: '38vh',
          paddingBottom: '60vh',
          transform: `translate3d(0, ${-scrollPos}px, 0)`,
          willChange: 'transform',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {script}
      </div>
    </div>
  )
}

function ControlDock({
  playing,
  speed,
  fontSize,
  mirrored,
  onPlay,
  onRestart,
  onSpeed,
  onFontSize,
  onMirror,
  onFullscreen,
  onEdit,
}: {
  playing: boolean
  speed: number
  fontSize: number
  mirrored: boolean
  onPlay: () => void
  onRestart: () => void
  onSpeed: (n: number) => void
  onFontSize: (updater: (n: number) => number) => void
  onMirror: () => void
  onFullscreen: () => void
  onEdit: () => void
}) {
  return (
    <div
      className="flex items-center gap-1.5 rounded-full px-3 py-2 md:gap-2 md:px-4 md:py-2.5"
      style={{
        background: 'rgba(15,14,16,0.55)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 14px 40px rgba(0,0,0,0.45)',
      }}
    >
      <DockButton onClick={onPlay} title={playing ? 'Pause (Space)' : 'Play (Space)'}>
        {playing ? <PauseIcon /> : <PlayIcon />}
      </DockButton>
      <DockButton onClick={onRestart} title="Restart (R)">
        <RestartIcon />
      </DockButton>
      <Divider />
      <div className="flex items-center gap-2 px-2 md:px-3">
        <span className="hidden font-fraunces text-[10px] uppercase tracking-[0.18em] text-[#F5F1E8]/45 md:inline">
          Speed
        </span>
        <input
          type="range"
          min={20}
          max={220}
          value={speed}
          onChange={e => onSpeed(Number(e.target.value))}
          className="w-20 md:w-28"
          aria-label="Speed in words per minute"
        />
        <span className="w-8 text-right font-fraunces text-[12px] tabular-nums text-[#F5F1E8]/75 md:w-10">
          {speed}
        </span>
      </div>
      <Divider />
      <div className="flex items-center gap-1 px-1 md:gap-1.5 md:px-2">
        <span className="hidden font-fraunces text-[10px] uppercase tracking-[0.18em] text-[#F5F1E8]/45 md:inline">
          Size
        </span>
        <button
          onClick={() => onFontSize(s => Math.max(20, s - 4))}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#F5F1E8]/70 transition-colors hover:bg-white/5 hover:text-[#F5F1E8]"
          aria-label="Decrease font size"
        >
          −
        </button>
        <span className="w-7 text-center font-fraunces text-[12px] tabular-nums text-[#F5F1E8]/75">
          {fontSize}
        </span>
        <button
          onClick={() => onFontSize(s => Math.min(140, s + 4))}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#F5F1E8]/70 transition-colors hover:bg-white/5 hover:text-[#F5F1E8]"
          aria-label="Increase font size"
        >
          +
        </button>
      </div>
      <Divider />
      <DockButton
        onClick={onMirror}
        title="Mirror (M)"
        active={mirrored}
        ariaPressed={mirrored}
      >
        <MirrorIcon />
      </DockButton>
      <DockButton onClick={onFullscreen} title="Fullscreen (F)">
        <FullscreenIcon />
      </DockButton>
      <Divider />
      <button
        onClick={onEdit}
        className="rounded-full px-3.5 font-fraunces text-[12px] text-[#F5F1E8]/70 transition-colors hover:bg-white/5 hover:text-[#F5F1E8] md:px-4"
        style={{ height: 36 }}
      >
        Edit
      </button>
    </div>
  )
}

function DockButton({
  onClick,
  title,
  active,
  ariaPressed,
  children,
}: {
  onClick: () => void
  title: string
  active?: boolean
  ariaPressed?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      aria-pressed={ariaPressed}
      className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/5"
      style={{ background: active ? 'rgba(245,241,232,0.12)' : 'transparent' }}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="h-7 w-px bg-white/10" />
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M3.5 2.2L13 8L3.5 13.8V2.2Z" fill="#F5F1E8" />
    </svg>
  )
}
function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="3.5" y="2.5" width="3" height="11" rx="1" fill="#F5F1E8" />
      <rect x="9.5" y="2.5" width="3" height="11" rx="1" fill="#F5F1E8" />
    </svg>
  )
}
function RestartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8a5 5 0 109.5-2"
        stroke="#F5F1E8"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M12 2.5V6H8.5"
        stroke="#F5F1E8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
function MirrorIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5V14.5" stroke="#F5F1E8" strokeWidth="1" strokeDasharray="1 1.5" />
      <path
        d="M2 5L6 5L6 11L2 11L2 5Z"
        stroke="#F5F1E8"
        strokeWidth="1.2"
        fill="rgba(245,241,232,0.25)"
        strokeLinejoin="round"
      />
      <path
        d="M14 5L10 5L10 11L14 11L14 5Z"
        stroke="#F5F1E8"
        strokeWidth="1.2"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  )
}
function FullscreenIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 6V2H6M14 6V2H10M2 10V14H6M14 10V14H10"
        stroke="#F5F1E8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
