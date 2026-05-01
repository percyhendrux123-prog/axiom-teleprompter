import { useEffect, useState } from 'react'
import { Icon } from '../components/Icon'
import { resources } from '../resources'

interface SetEntry {
  reps: number
  w: number
  done: boolean
  current?: boolean
}

export function ScreenWorkout() {
  const [resting, setResting] = useState(false)
  const [restTime, setRestTime] = useState(90)

  useEffect(() => {
    if (!resting) return
    const t = setInterval(() => setRestTime((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [resting])

  const sets: SetEntry[] = [
    { reps: 8, w: 185, done: true },
    { reps: 8, w: 195, done: true },
    { reps: 6, w: 205, done: false, current: true },
    { reps: 6, w: 205, done: false },
  ]

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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #1C1C20',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="mono" style={{ color: '#8E8E96', fontSize: 9 }}>
            EXERCISE 3 OF 6
          </span>
          <span style={{ fontFamily: 'var(--display)', fontSize: 14, marginTop: 2 }}>
            UPPER HEAVY
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="mono tnum" style={{ color: '#FF5B1F' }}>
            24:18
          </span>
          <button style={{ background: 'transparent', border: 0, color: '#F4F1EA' }}>
            <Icon name="pause" size={18} />
          </button>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          height: 200,
          background: `url(${resources.percyBicep}) center/cover`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent, rgba(0,0,0,.9))',
          }}
        />
        <button
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%,-50%)',
            width: 56,
            height: 56,
            borderRadius: 999,
            background: 'rgba(255,91,31,.95)',
            border: 0,
            color: '#0A0A0B',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Icon name="play" size={20} />
        </button>
        <div style={{ position: 'absolute', bottom: 14, left: 18, right: 18 }}>
          <div className="mono" style={{ color: '#FF5B1F', fontSize: 9 }}>
            CHEST · TRICEPS
          </div>
          <div className="display" style={{ fontSize: 32, marginTop: 4 }}>
            BARBELL BENCH PRESS
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '18px 22px', overflow: 'auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <span className="mono" style={{ color: '#8E8E96' }}>
            SETS
          </span>
          <span className="mono" style={{ color: '#8E8E96' }}>
            4 × 6–8 · RIR 2
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sets.map((s, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '32px 1fr 1fr 40px',
                gap: 10,
                alignItems: 'center',
                padding: '12px 14px',
                borderRadius: 12,
                background: s.current ? 'rgba(28,28,32,0.6)' : 'transparent',
                border: s.current ? '1px solid #FF5B1F' : '1px solid #1C1C20',
                backdropFilter: s.current ? 'blur(12px)' : undefined,
                WebkitBackdropFilter: s.current ? 'blur(12px)' : undefined,
              }}
            >
              <span
                className="display"
                style={{ fontSize: 20, color: s.done ? '#8E8E96' : '#F4F1EA' }}
              >
                {i + 1}
              </span>
              <div>
                <div className="mono" style={{ color: '#8E8E96', fontSize: 9 }}>
                  WEIGHT
                </div>
                <div className="tnum" style={{ fontSize: 18, fontWeight: 600 }}>
                  {s.w} <span style={{ color: '#8E8E96', fontSize: 11 }}>lb</span>
                </div>
              </div>
              <div>
                <div className="mono" style={{ color: '#8E8E96', fontSize: 9 }}>
                  REPS
                </div>
                <div className="tnum" style={{ fontSize: 18, fontWeight: 600 }}>
                  {s.reps}
                </div>
              </div>
              {s.done ? (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    background: '#FF5B1F',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#0A0A0B',
                  }}
                >
                  <Icon name="check" size={14} stroke={2.5} />
                </div>
              ) : s.current ? (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    background: '#FF5B1F',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#0A0A0B',
                  }}
                >
                  <Icon name="arrow" size={14} stroke={2.5} />
                </div>
              ) : (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    border: '1px solid #2A2A30',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '14px 22px 24px', borderTop: '1px solid #1C1C20' }}>
        {resting ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div className="mono" style={{ color: '#8E8E96', fontSize: 9 }}>
                REST
              </div>
              <div className="display tnum" style={{ fontSize: 38, color: '#FF5B1F' }}>
                {Math.floor(restTime / 60)}:{String(restTime % 60).padStart(2, '0')}
              </div>
            </div>
            <button
              onClick={() => {
                setResting(false)
                setRestTime(90)
              }}
              className="btn btn-light"
            >
              Skip rest
            </button>
          </div>
        ) : (
          <button
            onClick={() => setResting(true)}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '16px 22px' }}
          >
            Log set & rest <Icon name="arrow" size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
