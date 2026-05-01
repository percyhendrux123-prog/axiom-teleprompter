import { ReactElement, useEffect, useState } from 'react'
import { Icon, IconName } from './Icon'
import { Phone, Tablet, Desktop } from './Frames'
import { resources } from '../resources'
import { ScreenSplash } from '../screens/Splash'
import { ScreenLogin } from '../screens/Login'
import { ScreenOnboard } from '../screens/Onboard'
import { ScreenHome } from '../screens/Home'
import { ScreenWorkout } from '../screens/Workout'
import { ScreenExercise } from '../screens/Exercise'
import { ScreenPrograms } from '../screens/Programs'
import { ScreenAICoach } from '../screens/AICoach'
import { ScreenProgress } from '../screens/Progress'
import { ScreenNutrition } from '../screens/Nutrition'
import { ScreenCheckin } from '../screens/Checkin'
import { ScreenProfile } from '../screens/Profile'

export type ScreenId =
  | 'splash' | 'login' | 'onboard'
  | 'home' | 'workout' | 'exercise' | 'programs'
  | 'ai' | 'progress' | 'nutrition' | 'checkin' | 'profile'

interface ScreenDef {
  id: ScreenId
  label: string
  comp: () => ReactElement
  group: 'Onboard' | 'App'
}

export const SCREENS: ScreenDef[] = [
  { id: 'splash', label: 'Splash', comp: () => <ScreenSplash />, group: 'Onboard' },
  { id: 'login', label: 'Sign in', comp: () => <ScreenLogin />, group: 'Onboard' },
  { id: 'onboard', label: 'Onboarding', comp: () => <ScreenOnboard />, group: 'Onboard' },
  { id: 'home', label: 'Home', comp: () => <ScreenHome />, group: 'App' },
  { id: 'workout', label: 'Workout', comp: () => <ScreenWorkout />, group: 'App' },
  { id: 'exercise', label: 'Exercise', comp: () => <ScreenExercise />, group: 'App' },
  { id: 'programs', label: 'Programs', comp: () => <ScreenPrograms />, group: 'App' },
  { id: 'ai', label: 'AI Coach', comp: () => <ScreenAICoach />, group: 'App' },
  { id: 'progress', label: 'Progress', comp: () => <ScreenProgress />, group: 'App' },
  { id: 'nutrition', label: 'Nutrition', comp: () => <ScreenNutrition />, group: 'App' },
  { id: 'checkin', label: 'Check-in', comp: () => <ScreenCheckin />, group: 'App' },
  { id: 'profile', label: 'Profile', comp: () => <ScreenProfile />, group: 'App' },
]

interface BottomNavProps {
  active: ScreenId
  onChange: (id: ScreenId) => void
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  const items: { id: ScreenId; icon: IconName; label: string }[] = [
    { id: 'home', icon: 'home', label: 'Today' },
    { id: 'workout', icon: 'flame', label: 'Train' },
    { id: 'ai', icon: 'sparkle', label: 'Coach' },
    { id: 'progress', icon: 'chart', label: 'Progress' },
    { id: 'profile', icon: 'user', label: 'Profile' },
  ]
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 5 }}>
      <div
        className="bottom-nav"
        style={{ background: 'linear-gradient(180deg, transparent, #0A0A0B 30%)' }}
      >
        {items.map((it) => (
          <button
            key={it.id}
            className={active === it.id ? 'active' : ''}
            onClick={() => onChange(it.id)}
          >
            <Icon name={it.icon} size={20} />
            {it.label}
            <span className="dot" />
          </button>
        ))}
      </div>
    </div>
  )
}

interface FrameSwitcherProps {
  initialScreen?: ScreenId | null
  jumpToken?: number
}

export function FrameSwitcher({ initialScreen, jumpToken }: FrameSwitcherProps) {
  const [device, setDevice] = useState<'phone' | 'tablet' | 'desktop'>('phone')
  const [screen, setScreen] = useState<ScreenId>(initialScreen || 'home')

  useEffect(() => {
    if (initialScreen) setScreen(initialScreen)
  }, [initialScreen, jumpToken])

  const cur = SCREENS.find((s) => s.id === screen)
  const renderScreen = () => (cur ? <cur.comp /> : null)

  return (
    <div
      data-screen-label="App switcher"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
        padding: '40px 20px',
        minHeight: '100vh',
      }}
    >
      <div
        className="glass"
        style={{
          display: 'flex',
          gap: 8,
          padding: 6,
          borderRadius: 999,
        }}
      >
        {[
          { id: 'phone' as const, l: 'iPhone' },
          { id: 'tablet' as const, l: 'iPad' },
          { id: 'desktop' as const, l: 'Desktop' },
        ].map((d) => (
          <button
            key={d.id}
            onClick={() => setDevice(d.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 999,
              border: 0,
              cursor: 'pointer',
              background: device === d.id ? '#FF5B1F' : 'transparent',
              color: device === d.id ? '#0A0A0B' : '#F4F1EA',
              fontFamily: 'var(--mono)',
              fontSize: 11,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
            }}
          >
            {d.l}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          justifyContent: 'center',
          maxWidth: 800,
        }}
      >
        {SCREENS.map((s) => (
          <button
            key={s.id}
            onClick={() => setScreen(s.id)}
            style={{
              padding: '6px 12px',
              borderRadius: 999,
              border: '1px solid',
              borderColor: screen === s.id ? '#FF5B1F' : '#2A2A30',
              background: screen === s.id ? '#FF5B1F' : 'transparent',
              color: screen === s.id ? '#0A0A0B' : '#8E8E96',
              fontFamily: 'var(--mono)',
              fontSize: 10,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        {device === 'phone' && (
          <Phone w={380} h={780}>
            {renderScreen()}
          </Phone>
        )}
        {device === 'tablet' && (
          <Tablet w={760} h={1020}>
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', height: '100%' }}>
              <div
                style={{
                  background: '#0F0F12',
                  borderRight: '1px solid #1C1C20',
                  padding: '30px 20px',
                }}
              >
                <div className="mono" style={{ color: '#FF5B1F', fontSize: 10 }}>
                  ● PKFIT.APP
                </div>
                <div
                  style={{
                    marginTop: 28,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  {(
                    ['home', 'workout', 'ai', 'progress', 'programs', 'nutrition', 'checkin', 'profile'] as ScreenId[]
                  ).map((id) => {
                    const s = SCREENS.find((x) => x.id === id)
                    if (!s) return null
                    const sel = id === screen
                    return (
                      <button
                        key={id}
                        onClick={() => setScreen(id)}
                        style={{
                          textAlign: 'left',
                          padding: '10px 14px',
                          borderRadius: 10,
                          background: sel ? '#1C1C20' : 'transparent',
                          border: 0,
                          color: sel ? '#F4F1EA' : '#8E8E96',
                          fontFamily: 'var(--sans)',
                          fontSize: 14,
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        {s.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div style={{ overflow: 'hidden' }}>{renderScreen()}</div>
            </div>
          </Tablet>
        )}
        {device === 'desktop' && (
          <Desktop w={1180} h={760}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '240px 1fr 380px',
                height: '100%',
              }}
            >
              <div
                style={{
                  background: '#0F0F12',
                  borderRight: '1px solid #1C1C20',
                  padding: '24px 18px',
                }}
              >
                <div className="mono" style={{ color: '#FF5B1F', fontSize: 10 }}>
                  ● PKFIT.APP
                </div>
                <div
                  style={{
                    marginTop: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  {SCREENS.filter((s) => s.group === 'App').map((s) => {
                    const sel = s.id === screen
                    return (
                      <button
                        key={s.id}
                        onClick={() => setScreen(s.id)}
                        style={{
                          textAlign: 'left',
                          padding: '9px 12px',
                          borderRadius: 8,
                          background: sel ? '#1C1C20' : 'transparent',
                          border: 0,
                          color: sel ? '#F4F1EA' : '#8E8E96',
                          fontFamily: 'var(--sans)',
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        {s.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div style={{ overflow: 'hidden', borderRight: '1px solid #1C1C20' }}>
                {renderScreen()}
              </div>
              <div style={{ background: '#0A0A0B', padding: 22, overflow: 'auto' }}>
                <div className="mono" style={{ color: '#8E8E96' }}>
                  COACH PERCY
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 10,
                    marginTop: 12,
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 999,
                      background: `url(${resources.percyFront}) center/cover`,
                    }}
                  />
                  <div>
                    <div style={{ fontFamily: 'var(--display)', fontSize: 16 }}>
                      PERCY KEITH
                    </div>
                    <div className="mono" style={{ color: '#FF5B1F', fontSize: 9 }}>
                      ● ACTIVE NOW
                    </div>
                  </div>
                </div>
                <div
                  className="card"
                  style={{
                    marginTop: 16,
                    padding: 14,
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  "Push session today — focus on the eccentric. Three seconds down, explode up."
                </div>
                <div className="mono" style={{ color: '#8E8E96', marginTop: 22 }}>
                  UPCOMING
                </div>
                <div
                  style={{
                    marginTop: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  {[
                    { d: 'WED', t: 'Pull · Heavy' },
                    { d: 'FRI', t: 'Legs · Squat focus' },
                    { d: 'SAT', t: 'Conditioning' },
                  ].map((u, i) => (
                    <div
                      key={i}
                      className="card"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: 12,
                      }}
                    >
                      <span className="mono" style={{ color: '#8E8E96' }}>
                        {u.d}
                      </span>
                      <span style={{ fontSize: 13 }}>{u.t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Desktop>
        )}
      </div>
    </div>
  )
}
