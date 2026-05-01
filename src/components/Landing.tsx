import { CSSProperties, useRef } from 'react'
import { Icon } from './Icon'
import { Phone } from './Frames'
import { resources } from '../resources'
import { ScreenHome } from '../screens/Home'
import { ScreenWorkout } from '../screens/Workout'
import { ScreenAICoach } from '../screens/AICoach'
import { ScreenProgress } from '../screens/Progress'
import { ScreenNutrition } from '../screens/Nutrition'
import { FrameSwitcher, ScreenId } from './Shell'
import {
  StickyText,
  PinnedReveal,
  RevealImage,
  useScrollProgress,
  Magnetic,
  WordRoll,
  Spotlight,
  FadeUp,
  CountUp,
  Marquee,
} from './Effects'

interface FrameCollapseHeroProps {
  intensity?: number
  onOpenScreen: (id: ScreenId) => void
}

export function FrameCollapseHero({
  intensity = 1,
  onOpenScreen,
}: FrameCollapseHeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const p = useScrollProgress(ref, 'pin')
  const ease = (t: number) => 1 - Math.pow(1 - t, 2)
  const k = ease(Math.min(1, p * 1.1 * intensity))
  const interactive = k < 0.55

  type SatelliteScreen = 'ai' | 'progress' | 'nutrition' | 'workout'
  const sats: {
    from: { x: number; y: number; rot: number; scale: number }
    screen: SatelliteScreen
    label: string
    id: ScreenId
  }[] = [
    {
      from: { x: -300, y: 60, rot: -14, scale: 0.9 },
      screen: 'ai',
      label: 'AI COACH',
      id: 'ai',
    },
    {
      from: { x: 300, y: 80, rot: 12, scale: 0.9 },
      screen: 'progress',
      label: 'PROGRESS',
      id: 'progress',
    },
    {
      from: { x: -180, y: 360, rot: -6, scale: 0.78 },
      screen: 'nutrition',
      label: 'NUTRITION',
      id: 'nutrition',
    },
    {
      from: { x: 200, y: 380, rot: 8, scale: 0.78 },
      screen: 'workout',
      label: 'WORKOUT',
      id: 'workout',
    },
  ]

  const specOpacity = Math.max(0, (k - 0.35) / 0.65)
  const specs: {
    top: string
    left?: string
    right?: string
    num: string
    label: string
    hint: string
    center?: boolean
  }[] = [
    { top: '14%', left: '8%', num: '01', label: 'ADAPTIVE\nPROGRAMMING', hint: 'rebuilds weekly' },
    { top: '22%', right: '8%', num: '02', label: 'AI FORM\nCHECK', hint: 'frame-by-frame' },
    { top: '58%', left: '6%', num: '03', label: 'DIRECT LINE\nTO PERCY', hint: 'voice + video' },
    { top: '62%', right: '6%', num: '04', label: 'JOINT-SMART\nLOAD', hint: 'long game' },
    { top: '40%', left: '50%', num: '✦', label: 'BUILT FOR 50', hint: 'no roster bloat', center: true },
  ]

  return (
    <section
      ref={ref}
      style={{ position: 'relative', minHeight: '260vh' }}
      data-screen-label="01 Hero"
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            className="display"
            style={{
              fontSize: 'clamp(140px, 22vw, 360px)',
              color: 'rgba(244,241,234,0.04)',
              lineHeight: 0.85,
              textAlign: 'center',
              transform: `scale(${1 + k * 0.1})`,
            }}
          >
            PKFIT
            <br />
            METHOD
          </div>
        </div>

        {specs.map((s, i) => {
          const positionStyle: CSSProperties = {
            position: 'absolute',
            top: s.top,
            left: s.left,
            right: s.right,
            transform: `${s.center ? 'translate(-50%, -50%)' : ''} translateY(${
              (1 - specOpacity) * 30
            }px)`,
            opacity: specOpacity,
            transition: 'opacity .2s',
            pointerEvents: specOpacity > 0.5 ? 'auto' : 'none',
            zIndex: 5,
            maxWidth: 180,
          }
          const connectorStyle: CSSProperties = {
            position: 'absolute',
            top: 12,
            ...(s.left ? { left: -40 } : { right: -40 }),
            width: 30,
            height: 1,
            background: 'linear-gradient(to right, #FF5B1F, transparent)',
            transform: s.right ? 'scaleX(-1)' : 'none',
          }
          return (
            <div key={i} style={positionStyle}>
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  color: '#FF5B1F',
                  marginBottom: 6,
                  letterSpacing: '.15em',
                }}
              >
                {s.num} {s.center ? '' : '—'}
              </div>
              <div
                className="display"
                style={{
                  fontSize: s.center ? 22 : 18,
                  lineHeight: 1,
                  whiteSpace: 'pre-line',
                  marginBottom: 6,
                }}
              >
                {s.label}
              </div>
              <div
                className="mono"
                style={{ fontSize: 9, color: '#8E8E96', letterSpacing: '.1em' }}
              >
                {s.hint}
              </div>
              {!s.center && <div style={connectorStyle} />}
            </div>
          )
        })}

        <div
          style={{
            position: 'absolute',
            top: '10vh',
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: 1 - k * 0.6,
          }}
        >
          <span
            className="mono"
            style={{ color: '#FF5B1F', letterSpacing: '.25em', fontSize: 11 }}
          >
            ● ONE COACH · ONE METHOD · ZERO EXCUSES
          </span>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '8vh',
            left: 0,
            right: 0,
            textAlign: 'center',
            padding: '0 24px',
            zIndex: 20,
          }}
        >
          <div
            className="display"
            style={{
              fontSize: 'clamp(36px, 5vw, 72px)',
              lineHeight: 0.95,
              opacity: 0.4 + k * 0.6,
            }}
          >
            COACHING IN YOUR <span style={{ color: '#FF5B1F' }}>POCKET.</span>
          </div>
          <div
            style={{
              marginTop: 18,
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <a href="#app" className="btn btn-primary">
              Try the app <Icon name="arrow" size={14} />
            </a>
            <a href="#story" className="btn btn-ghost">
              The method
            </a>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            width: 380,
            height: 780,
            transform: `scale(${0.78 + k * 0.04})`,
          }}
        >
          {sats.map((s, i) => {
            const fx = s.from.x * (1 - k)
            const fy = s.from.y * (1 - k) + k * 30
            const frot = s.from.rot * (1 - k)
            const fscale = s.from.scale + (0.62 - s.from.scale) * k
            const op = 1 - k * 0.85
            return (
              <div
                key={i}
                onClick={() => interactive && onOpenScreen(s.id)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: `translateX(-50%) translate(${fx}px, ${fy}px) rotate(${frot}deg) scale(${fscale})`,
                  opacity: op,
                  zIndex: 1 + i,
                  transformOrigin: '50% 40%',
                  filter: `blur(${k * 4}px)`,
                  cursor: interactive ? 'pointer' : 'default',
                  pointerEvents: interactive ? 'auto' : 'none',
                  transition: 'filter .2s',
                }}
                data-mag
              >
                <Phone w={300} h={620}>
                  {s.screen === 'ai' && <ScreenAICoach />}
                  {s.screen === 'progress' && <ScreenProgress />}
                  {s.screen === 'nutrition' && <ScreenNutrition />}
                  {s.screen === 'workout' && <ScreenWorkout />}
                </Phone>
                <div
                  style={{
                    position: 'absolute',
                    bottom: -28,
                    left: '50%',
                    transform: `translateX(-50%) rotate(${-frot}deg)`,
                    opacity: interactive ? 1 - k * 1.6 : 0,
                    background: '#FF5B1F',
                    color: '#0A0A0B',
                    padding: '4px 10px',
                    fontFamily: 'var(--mono)',
                    fontSize: 9,
                    letterSpacing: '.15em',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                  }}
                >
                  TAP → {s.label}
                </div>
              </div>
            )
          })}
          <div
            onClick={() => interactive && onOpenScreen('home')}
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: `translateX(-50%) translateY(${-k * 10}px) scale(${1 + k * 0.04})`,
              zIndex: 10,
              transformOrigin: '50% 40%',
              filter: `drop-shadow(0 ${20 + k * 30}px ${40 + k * 40}px rgba(0,0,0,${0.5 + k * 0.3}))`,
              cursor: interactive ? 'pointer' : 'default',
              pointerEvents: interactive ? 'auto' : 'none',
            }}
            data-mag
          >
            <Phone w={360} h={740}>
              <ScreenHome />
            </Phone>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 28,
            right: 28,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            opacity: 1 - k,
          }}
        >
          <span className="mono" style={{ color: '#8E8E96' }}>
            TAP A SCREEN · OR SCROLL
          </span>
          <div style={{ width: 30, height: 1, background: '#FF5B1F' }} />
        </div>
      </div>
    </section>
  )
}

export function StatsMarquee() {
  const items = [
    'TRAIN HONEST',
    '★',
    'BUILT FOR 50',
    '★',
    'NO BOTS — REAL COACH',
    '★',
    'JOINT-SMART PROGRAMMING',
    '★',
    'RESULTS, NOT REELS',
    '★',
    'PERCY KEITH',
    '★',
  ]
  return (
    <section
      style={{
        background: '#FF5B1F',
        color: '#0A0A0B',
        padding: 0,
        borderTop: '1px solid #1C1C20',
        borderBottom: '1px solid #1C1C20',
        overflow: 'hidden',
      }}
      data-screen-label="01b Marquee"
    >
      <div style={{ padding: '28px 0' }}>
        <Marquee speed={40}>
          {items.map((t, i) => (
            <span
              key={i}
              className="display"
              style={{
                fontSize: 'clamp(40px, 6vw, 96px)',
                lineHeight: 1,
                padding: '0 32px',
                display: 'inline-block',
              }}
            >
              {t}
            </span>
          ))}
        </Marquee>
      </div>

      <div
        style={{
          borderTop: '1px solid rgba(10,10,11,.2)',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          textAlign: 'left',
        }}
      >
        <FadeUp>
          <div style={{ padding: '32px 28px', borderRight: '1px solid rgba(10,10,11,.2)' }}>
            <div className="display" style={{ fontSize: 'clamp(48px, 5vw, 84px)', lineHeight: 1 }}>
              <CountUp to={50} />
            </div>
            <div className="mono" style={{ fontSize: 11, marginTop: 8, opacity: 0.7 }}>
              ROSTER CAP
            </div>
          </div>
        </FadeUp>
        <FadeUp delay={80}>
          <div style={{ padding: '32px 28px', borderRight: '1px solid rgba(10,10,11,.2)' }}>
            <div className="display" style={{ fontSize: 'clamp(48px, 5vw, 84px)', lineHeight: 1 }}>
              <CountUp to={12} />
            </div>
            <div className="mono" style={{ fontSize: 11, marginTop: 8, opacity: 0.7 }}>
              YEARS COACHING
            </div>
          </div>
        </FadeUp>
        <FadeUp delay={160}>
          <div style={{ padding: '32px 28px', borderRight: '1px solid rgba(10,10,11,.2)' }}>
            <div className="display" style={{ fontSize: 'clamp(48px, 5vw, 84px)', lineHeight: 1 }}>
              <CountUp to={94} suffix="%" />
            </div>
            <div className="mono" style={{ fontSize: 11, marginTop: 8, opacity: 0.7 }}>
              CLIENT RETENTION
            </div>
          </div>
        </FadeUp>
        <FadeUp delay={240}>
          <div style={{ padding: '32px 28px' }}>
            <div className="display" style={{ fontSize: 'clamp(48px, 5vw, 84px)', lineHeight: 1 }}>
              <CountUp to={24} suffix="/7" />
            </div>
            <div className="mono" style={{ fontSize: 11, marginTop: 8, opacity: 0.7 }}>
              AI COACH ON CALL
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

export function StickyTextSection() {
  return (
    <section
      style={{ background: '#0A0A0B', padding: '30vh 6vw' }}
      data-screen-label="02 Sticky Text"
    >
      <div className="mono" style={{ color: '#FF5B1F', marginBottom: 24 }}>
        ● THE METHOD
      </div>
      <p
        className="display"
        style={{
          fontSize: 'clamp(40px, 7vw, 110px)',
          lineHeight: 0.95,
          margin: 0,
          maxWidth: 1300,
        }}
      >
        <StickyText intensity={1.2}>YOU DON'T NEED ANOTHER APP. </StickyText>
        <StickyText intensity={1.2}>YOU NEED A COACH WHO ACTUALLY </StickyText>
        <span style={{ color: '#FF5B1F' }}>
          <StickyText intensity={1.2}>WATCHES</StickyText>
        </span>
        <StickyText intensity={1.2}> — AND AN AI THAT </StickyText>
        <span style={{ color: '#FF5B1F' }}>
          <StickyText intensity={1.2}>NEVER STOPS LEARNING YOU.</StickyText>
        </span>
      </p>
    </section>
  )
}

export function RevealImageSection() {
  return (
    <section
      id="story"
      style={{
        background: '#0A0A0B',
        padding: '12vh 6vw',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 60,
        alignItems: 'center',
      }}
      data-screen-label="03 Coach"
    >
      <div>
        <div className="mono" style={{ color: '#FF5B1F' }}>
          ● YOUR COACH
        </div>
        <h2
          className="display"
          style={{
            fontSize: 'clamp(40px, 5.5vw, 88px)',
            lineHeight: 0.92,
            margin: '12px 0 18px',
          }}
        >
          PERCY
          <br />
          KEITH.
        </h2>
        <p style={{ fontSize: 17, lineHeight: 1.55, color: '#A8A8AE', maxWidth: 460 }}>
          Twelve years coaching lifestyle clients out of bad habits and into bodies they actually
          want. PKFIT is the system distilled — built for people with jobs, kids, and 6am alarms.
        </p>
        <div style={{ display: 'flex', gap: 32, marginTop: 28 }}>
          {[
            { n: '12', l: 'Years coaching' },
            { n: '240+', l: 'Transformations' },
            { n: '50', l: 'Roster cap' },
          ].map((s, i) => (
            <div key={i}>
              <div className="display" style={{ fontSize: 32 }}>
                {s.n}
              </div>
              <div className="mono" style={{ color: '#8E8E96', marginTop: 4, fontSize: 9 }}>
                {s.l.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
      <RevealImage src={resources.percyFlex} intensity={1.2} aspect="3/4" />
    </section>
  )
}

export function PinnedWordSection() {
  return (
    <section style={{ background: '#0A0A0B' }} data-screen-label="04 Pinned Reveal">
      <PinnedReveal
        words={[
          'TRAIN.',
          'FUEL.',
          'RECOVER.',
          'REPEAT.',
          'EVERY',
          'DAY',
          'WE',
          'GET',
          'ONE',
          'PERCENT',
          'BETTER.',
        ]}
        accentEvery={4}
        intensity={1}
      />
    </section>
  )
}

interface FeatureItem {
  i: 'sparkle' | 'camera' | 'chart' | 'chat' | 'calendar' | 'heart'
  t: string
  d: string
}

export function FeaturesSection() {
  const f: FeatureItem[] = [
    { i: 'sparkle', t: 'AI Coach', d: "Trained on Percy's playbook. Form, swaps, macros — instantly." },
    { i: 'camera', t: 'AI Form Check', d: 'Film your set. Frame-by-frame breakdown of bar path & tempo.' },
    { i: 'chart', t: 'Honest progress', d: 'Weight, photos, lifts, sleep. One feed. The receipts.' },
    { i: 'chat', t: 'Direct line to Percy', d: 'Voice notes, video replies. Real coach. No bots.' },
    { i: 'calendar', t: 'Adaptive scheduling', d: 'Miss Wednesday? It re-balances so the program holds.' },
    { i: 'heart', t: 'Built for grown-ups', d: 'Joint-smart programming. No ego lifts. Long-game by design.' },
  ]
  return (
    <Spotlight>
      <section
        style={{ background: '#0A0A0B', padding: '12vh 6vw', position: 'relative' }}
        data-screen-label="05 Features"
      >
        <div className="mono" style={{ color: '#FF5B1F' }}>
          ● WHAT'S INSIDE
        </div>
        <h2
          className="display"
          style={{
            fontSize: 'clamp(40px, 5vw, 80px)',
            lineHeight: 0.92,
            margin: '12px 0 50px',
          }}
        >
          SIX SYSTEMS.
          <br />
          ONE APP.
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            border: '1px solid #1C1C20',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {f.map((x, i) => (
            <FadeUp key={i} delay={i * 60}>
              <div
                style={{
                  padding: 28,
                  borderRight: '1px solid #1C1C20',
                  borderBottom: '1px solid #1C1C20',
                  height: '100%',
                  transition: 'background .3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,91,31,.04)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <div className="mono" style={{ fontSize: 10, color: '#6B6B72', marginBottom: 14 }}>
                  0{i + 1}
                </div>
                <Icon name={x.i} size={26} color="#FF5B1F" />
                <h3 className="display" style={{ fontSize: 22, margin: '14px 0 10px' }}>
                  {x.t.toUpperCase()}
                </h3>
                <p style={{ color: '#A8A8AE', fontSize: 14, lineHeight: 1.5, margin: 0 }}>
                  {x.d}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>
    </Spotlight>
  )
}

interface AppShowcaseProps {
  initialScreen?: ScreenId | null
  jumpToken?: number
}

export function AppShowcase({ initialScreen, jumpToken }: AppShowcaseProps) {
  return (
    <section
      id="app"
      style={{
        background: '#0A0A0B',
        padding: '12vh 0',
        borderTop: '1px solid #1C1C20',
      }}
      data-screen-label="06 App Showcase"
    >
      <div style={{ padding: '0 6vw' }}>
        <div className="mono" style={{ color: '#FF5B1F' }}>
          ● THE APP
        </div>
        <h2
          className="display"
          style={{
            fontSize: 'clamp(40px, 5vw, 80px)',
            lineHeight: 0.92,
            margin: '12px 0 12px',
          }}
        >
          EXPLORE EVERY SCREEN.
        </h2>
        <p style={{ color: '#A8A8AE', maxWidth: 560, fontSize: 16 }}>
          Switch between iPhone, iPad, and desktop. Tap any screen to see how it works. AI is live
          — ask the coach anything.
        </p>
      </div>
      <FrameSwitcher initialScreen={initialScreen} jumpToken={jumpToken} />
    </section>
  )
}

export function CTASection() {
  return (
    <Spotlight>
      <section
        style={{
          background: '#0A0A0B',
          padding: '16vh 6vw',
          textAlign: 'center',
          borderTop: '1px solid #1C1C20',
          position: 'relative',
        }}
        data-screen-label="07 CTA"
      >
        <div className="mono" style={{ color: '#FF5B1F' }}>
          ● APPLY TO TRAIN
        </div>
        <h2
          className="display"
          style={{
            fontSize: 'clamp(48px, 8vw, 140px)',
            lineHeight: 0.88,
            margin: '20px 0',
          }}
        >
          TRAIN <WordRoll words={['HONEST.', 'HARD.', 'SMART.', 'FOR LIFE.']} />
          <br />
          <span style={{ color: '#FF5B1F' }}>OR DON'T.</span>
        </h2>
        <p
          style={{
            color: '#A8A8AE',
            maxWidth: 540,
            margin: '0 auto 28px',
            fontSize: 17,
          }}
        >
          Roster's capped at 50. Applications open monthly. The work is the same as it's ever been
          — show up.
        </p>
        <Magnetic>
          <a className="btn btn-primary" style={{ padding: '18px 32px', display: 'inline-flex' }}>
            Apply to PKFIT <Icon name="arrow" size={14} />
          </a>
        </Magnetic>
        <div
          style={{
            marginTop: 80,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: 1200,
            margin: '80px auto 0',
            color: '#6B6B72',
            fontFamily: 'var(--mono)',
            fontSize: 10,
            letterSpacing: '.15em',
          }}
        >
          <span>© 2026 PKFIT.APP</span>
          <span>COACHED BY PERCY KEITH</span>
        </div>
      </section>
    </Spotlight>
  )
}
