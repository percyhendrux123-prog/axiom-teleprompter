import {
  CSSProperties,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react'

// ==========================================================
// useScrollProgress — generic [0,1] of an element across the viewport
// ==========================================================
export type ScrollMode = 'pin' | 'through'

export function useScrollProgress(
  ref: RefObject<HTMLElement>,
  mode: ScrollMode = 'through',
) {
  const [p, setP] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      let v = 0
      if (mode === 'pin') {
        const total = r.height - vh
        v = total > 0 ? Math.max(0, Math.min(1, -r.top / total)) : r.top < 0 ? 1 : 0
      } else {
        const total = r.height + vh
        v = Math.max(0, Math.min(1, (vh - r.top) / total))
      }
      setP(v)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref, mode])
  return p
}

// ==========================================================
// StickyText — character-by-character reveal on scroll
// ==========================================================
function flattenText(node: ReactNode): string {
  if (node == null || node === false || node === true) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(flattenText).join('')
  if (typeof node === 'object' && 'props' in node && node.props && 'children' in node.props) {
    return flattenText(node.props.children as ReactNode)
  }
  return ''
}

interface StickyTextProps {
  children: ReactNode
  intensity?: number
  className?: string
  accent?: boolean
}

export function StickyText({ children, intensity = 1, className = '' }: StickyTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const total = rect.height + vh
      const passed = vh - rect.top
      setProgress(Math.max(0, Math.min(1, passed / total)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const text = flattenText(children)
  const chars = text.split('')
  const litCount = Math.floor(progress * chars.length * (1 + 0.3 * intensity))

  return (
    <span ref={ref} className={`sticky-text ${className}`}>
      {chars.map((c, i) => (
        <span key={i} className={i < litCount ? 'ch lit' : 'ch'}>
          {c === ' ' ? ' ' : c}
        </span>
      ))}
    </span>
  )
}

// ==========================================================
// PinnedReveal — sticky word-by-word as the section scrolls past
// ==========================================================
interface PinnedRevealProps {
  words: string[]
  accentEvery?: number
  intensity?: number
}

export function PinnedReveal({ words, accentEvery = 0, intensity = 1 }: PinnedRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const total = r.height - vh
      if (total <= 0) {
        setP(r.top < 0 ? 1 : 0)
        return
      }
      setP(Math.max(0, Math.min(1, -r.top / total)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const lit = Math.floor(p * words.length * (1 + 0.2 * intensity))

  return (
    <div ref={ref} style={{ minHeight: '200vh' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 6vw',
        }}
      >
        <p
          className="display"
          style={{
            fontSize: 'clamp(40px, 8vw, 120px)',
            margin: 0,
            maxWidth: 1400,
            lineHeight: 0.95,
          }}
        >
          {words.map((w, i) => {
            const isLit = i < lit
            const isAccent = accentEvery > 0 && (i + 1) % accentEvery === 0
            return (
              <span
                key={i}
                style={{
                  color: isLit
                    ? isAccent
                      ? 'var(--accent)'
                      : 'var(--bone)'
                    : 'rgba(244,241,234,0.14)',
                  transition: 'color .25s ease',
                  marginRight: '0.25em',
                  display: 'inline-block',
                }}
              >
                {w}
              </span>
            )
          })}
        </p>
      </div>
    </div>
  )
}

// ==========================================================
// RevealImage — clip-mask + scale + blur reveal on scroll
// ==========================================================
interface RevealImageProps {
  src: string
  alt?: string
  intensity?: number
  className?: string
  aspect?: string
}

export function RevealImage({
  src,
  alt = '',
  intensity = 1,
  className = '',
  aspect = '4/5',
}: RevealImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const total = r.height + vh
      const passed = vh - r.top
      setP(Math.max(0, Math.min(1, passed / total)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const clipP = Math.min(1, p * 1.4 * intensity)
  const scale = 1.15 - clipP * 0.15
  const blur = (1 - clipP) * 12 * intensity
  const gray = (1 - clipP) * 0.6 * intensity

  return (
    <div ref={ref} className={`reveal-image ${className}`} style={{ aspectRatio: aspect }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: `inset(${(1 - clipP) * 18}% ${(1 - clipP) * 6}% round 2px)`,
          transition: 'clip-path .1s linear',
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            transform: `scale(${scale})`,
            filter: `blur(${blur}px) grayscale(${gray}) contrast(${1 + clipP * 0.1})`,
            transition: 'filter .1s linear, transform .1s linear',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
    </div>
  )
}

// ==========================================================
// CustomCursor — orange dot + ring with magnetic hover detection
// ==========================================================
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    let rx = 0,
      ry = 0,
      dx = 0,
      dy = 0
    let raf = 0
    const onMove = (e: MouseEvent) => {
      dx = e.clientX
      dy = e.clientY
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`
    }
    const tick = () => {
      rx += (dx - rx) * 0.15
      ry += (dy - ry) * 0.15
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      if (t?.closest && t.closest('a, button, [data-mag]')) setHovering(true)
    }
    const onOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      if (t?.closest && t.closest('a, button, [data-mag]')) setHovering(false)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mouseout', onOut)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mouseout', onOut)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{ width: hovering ? 4 : 10, height: hovering ? 4 : 10 }}
      />
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          width: hovering ? 56 : 36,
          height: hovering ? 56 : 36,
          borderColor: hovering ? 'rgba(255,91,31,1)' : 'rgba(255,91,31,.5)',
        }}
      />
    </>
  )
}

// ==========================================================
// ScrollBar — fixed top progress bar
// ==========================================================
export function ScrollBar() {
  const [w, setW] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const total = h.scrollHeight - h.clientHeight
      setW(total > 0 ? (h.scrollTop / total) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return <div className="scroll-bar" style={{ width: `${w}%` }} />
}

// ==========================================================
// Magnetic — pulls toward cursor
// ==========================================================
interface MagneticProps {
  children: ReactNode
  strength?: number
  style?: CSSProperties
}

export function Magnetic({ children, strength = 18, style }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - (r.left + r.width / 2)
    const y = e.clientY - (r.top + r.height / 2)
    el.style.transform = `translate(${x / strength}px, ${y / strength}px)`
  }
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = 'translate(0,0)'
  }
  return (
    <span
      ref={ref}
      className="magnetic"
      data-mag
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={style}
    >
      {children}
    </span>
  )
}

// ==========================================================
// CountUp — counter that animates when in view
// ==========================================================
interface CountUpProps {
  to: number
  duration?: number
  prefix?: string
  suffix?: string
}

export function CountUp({ to, duration = 1400, prefix = '', suffix = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState(0)
  const startedRef = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true
            const start = performance.now()
            const tick = (t: number) => {
              const p = Math.min(1, (t - start) / duration)
              const eased = 1 - Math.pow(1 - p, 3)
              setN(Math.round(to * eased * 10) / 10)
              if (p < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
          }
        })
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [to, duration])
  return (
    <span ref={ref} className="tnum">
      {prefix}
      {n}
      {suffix}
    </span>
  )
}

// ==========================================================
// FadeUp — fade & blur in on enter view
// ==========================================================
interface FadeUpProps {
  children: ReactNode
  delay?: number
  style?: CSSProperties
}

export function FadeUp({ children, delay = 0, style }: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVis(true)),
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`fade-up ${vis ? 'in' : ''}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  )
}

// ==========================================================
// Spotlight — radial gradient that follows cursor
// ==========================================================
export function Spotlight({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <div ref={ref} className="spotlight" onMouseMove={onMove}>
      {children}
    </div>
  )
}

// ==========================================================
// WordRoll — vertical word rolodex
// ==========================================================
interface WordRollProps {
  words: string[]
  interval?: number
}

export function WordRoll({ words, interval = 2200 }: WordRollProps) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % words.length), interval)
    return () => clearInterval(t)
  }, [words.length, interval])
  return (
    <span
      style={{
        display: 'inline-block',
        height: '1em',
        overflow: 'hidden',
        verticalAlign: 'bottom',
      }}
    >
      <span
        style={{
          display: 'block',
          transform: `translateY(-${i * 100}%)`,
          transition: 'transform .5s cubic-bezier(.7,0,.3,1)',
        }}
      >
        {words.map((w, j) => (
          <span key={j} style={{ display: 'block', lineHeight: 1, color: '#FF5B1F' }}>
            {w}
          </span>
        ))}
      </span>
    </span>
  )
}

// ==========================================================
// Marquee — horizontal infinite scroll
// ==========================================================
interface MarqueeProps {
  children: ReactNode
  speed?: number
  reverse?: boolean
}

export function Marquee({ children, speed = 30, reverse = false }: MarqueeProps) {
  return (
    <div style={{ overflow: 'hidden', display: 'flex' }}>
      <div
        style={{
          display: 'flex',
          gap: 48,
          whiteSpace: 'nowrap',
          animation: `marquee ${speed}s linear infinite ${reverse ? 'reverse' : ''}`,
        }}
      >
        {children}
        {children}
        {children}
      </div>
    </div>
  )
}

// ==========================================================
// LiveDot — pulsing status dot
// ==========================================================
export function LiveDot({ color = '#FF5B1F' }: { color?: string }) {
  return (
    <span
      className="live-pulse"
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: 999,
        background: color,
      }}
    />
  )
}
