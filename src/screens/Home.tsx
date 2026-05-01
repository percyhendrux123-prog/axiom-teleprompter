import { Icon } from '../components/Icon'
import { resources } from '../resources'

interface ScreenHomeProps {
  onOpen?: () => void
}

export function ScreenHome({ onOpen = () => {} }: ScreenHomeProps) {
  return (
    <div style={{ height: '100%', overflow: 'auto', padding: '20px 22px 100px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <div>
          <div className="mono" style={{ color: '#8E8E96', fontSize: 10 }}>
            MON · WK 04
          </div>
          <div className="display" style={{ fontSize: 28, marginTop: 4 }}>
            Morning, Marcus
          </div>
        </div>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 999,
            background: 'linear-gradient(135deg,#FF5B1F,#C7421A)',
            display: 'grid',
            placeItems: 'center',
            fontFamily: 'var(--display)',
            fontSize: 14,
          }}
        >
          MK
        </div>
      </div>

      {/* Streak */}
      <div className="card" style={{ background: '#131316', padding: 18, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="mono" style={{ color: '#8E8E96' }}>
              CURRENT STREAK
            </div>
            <div className="display" style={{ fontSize: 56, lineHeight: 1, marginTop: 8 }}>
              23<span style={{ color: '#FF5B1F' }}>·</span>
              <span style={{ fontSize: 22, color: '#8E8E96' }}>DAYS</span>
            </div>
          </div>
          <Icon name="flame" size={28} color="#FF5B1F" />
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 16 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 6,
                borderRadius: 3,
                background: i < 5 ? '#FF5B1F' : '#2A2A30',
              }}
            />
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 8,
            fontFamily: 'var(--mono)',
            fontSize: 9,
            color: '#8E8E96',
            letterSpacing: '.15em',
          }}
        >
          <span>M</span>
          <span>T</span>
          <span>W</span>
          <span>T</span>
          <span>F</span>
          <span>S</span>
          <span>S</span>
        </div>
      </div>

      {/* Today's workout */}
      <div className="mono" style={{ color: '#8E8E96', marginTop: 22, marginBottom: 10 }}>
        TODAY'S SESSION
      </div>
      <div
        onClick={onOpen}
        className="card"
        style={{
          position: 'relative',
          padding: 0,
          marginBottom: 14,
          cursor: 'pointer',
          background: `url(${resources.percyBicep}) center/cover`,
          minHeight: 220,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,.1), rgba(0,0,0,.85))',
          }}
        />
        <div
          style={{
            position: 'relative',
            padding: 18,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: '#F4F1EA',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="pill pill-accent">Day 23 · Push</span>
            <span className="pill">
              <Icon name="timer" size={11} /> 52 min
            </span>
          </div>
          <div style={{ marginTop: 80 }}>
            <div className="display" style={{ fontSize: 38, lineHeight: 0.92 }}>
              UPPER
              <br />
              HEAVY
            </div>
            <div
              style={{
                display: 'flex',
                gap: 14,
                marginTop: 12,
                fontSize: 12,
                color: 'rgba(244,241,234,.75)',
              }}
            >
              <span>6 exercises</span>
              <span>·</span>
              <span>Strength block</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { l: 'Weight', v: '182.4', u: 'lbs', d: '-1.2' },
          { l: 'Sleep', v: '7h 48', u: '', d: '+0.4' },
          { l: 'Steps', v: '8,420', u: '', d: '' },
          { l: 'Protein', v: '146', u: 'g', d: '78%' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ background: '#131316', padding: 14 }}>
            <div className="mono" style={{ color: '#8E8E96', fontSize: 9 }}>
              {s.l.toUpperCase()}
            </div>
            <div className="display" style={{ fontSize: 26, marginTop: 6 }}>
              {s.v}
              <span style={{ fontSize: 12, color: '#8E8E96', marginLeft: 4 }}>{s.u}</span>
            </div>
            {s.d && (
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 10,
                  color: s.d.startsWith('-') ? '#FF5B1F' : '#FF5B1F',
                  marginTop: 4,
                }}
              >
                {s.d}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Coach card */}
      <div className="mono" style={{ color: '#8E8E96', marginTop: 22, marginBottom: 10 }}>
        FROM PERCY
      </div>
      <div className="card" style={{ background: '#131316', padding: 16, display: 'flex', gap: 12 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 999,
            background: `url(${resources.percyFront}) center/cover`,
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, lineHeight: 1.5 }}>
            "Push session today — focus on the eccentric. Three seconds down, explode up. You've
            got this."
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button className="btn btn-primary" style={{ padding: '8px 14px', fontSize: 11 }}>
              Reply
            </button>
            <button className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: 11 }}>
              Voice note
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
