import { useState } from 'react'
import { Icon } from '../components/Icon'

export function ScreenOnboard() {
  const [step] = useState(2)
  return (
    <div
      style={{
        height: '100%',
        background: '#0A0A0B',
        color: '#F4F1EA',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 24px 28px',
      }}
    >
      <div style={{ display: 'flex', gap: 4 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: i <= step ? '#FF5B1F' : '#1C1C20',
            }}
          />
        ))}
      </div>
      <div className="mono" style={{ color: '#8E8E96', marginTop: 18 }}>
        STEP 03 / 05
      </div>
      <div className="display" style={{ fontSize: 30, marginTop: 10, lineHeight: 0.95 }}>
        WHAT'S YOUR
        <br />
        MAIN GOAL?
      </div>
      <div style={{ flex: 1, marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { t: 'Lose fat', d: 'Drop weight, keep muscle', sel: true },
          { t: 'Build muscle', d: 'Hypertrophy focus', sel: false },
          { t: 'Get stronger', d: 'Add weight to the bar', sel: false },
          { t: 'Stay in shape', d: 'Maintain & feel good', sel: false },
        ].map((g, i) => (
          <div
            key={i}
            style={{
              padding: 16,
              borderRadius: 14,
              background: g.sel ? '#1C1C20' : 'transparent',
              border: '1px solid ' + (g.sel ? '#FF5B1F' : '#1C1C20'),
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--display)', fontSize: 18 }}>
                {g.t.toUpperCase()}
              </div>
              <div className="mono" style={{ color: '#8E8E96', fontSize: 9, marginTop: 4 }}>
                {g.d.toUpperCase()}
              </div>
            </div>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                border: '1px solid ' + (g.sel ? '#FF5B1F' : '#2A2A30'),
                background: g.sel ? '#FF5B1F' : 'transparent',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              {g.sel && <Icon name="check" size={12} stroke={3} color="#0A0A0B" />}
            </div>
          </div>
        ))}
      </div>
      <button
        className="btn btn-primary"
        style={{
          width: '100%',
          justifyContent: 'center',
          padding: '16px',
          marginTop: 20,
        }}
      >
        Continue <Icon name="arrow" size={14} />
      </button>
    </div>
  )
}
