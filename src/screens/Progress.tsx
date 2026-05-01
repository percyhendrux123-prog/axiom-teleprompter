import { resources } from '../resources'

export function ScreenProgress() {
  const data = [184, 183.6, 183.2, 183.5, 182.8, 182.6, 182.4, 182.4, 181.9, 181.7, 181.4, 181.0]
  const max = Math.max(...data)
  const min = Math.min(...data)
  const norm = (v: number) => 1 - (v - min) / (max - min)

  return (
    <div
      style={{
        height: '100%',
        overflow: 'auto',
        padding: '20px 22px 100px',
        background: '#0A0A0B',
        color: '#F4F1EA',
      }}
    >
      <div className="mono" style={{ color: '#8E8E96' }}>
        PROGRESS · 12 WEEKS
      </div>
      <div className="display" style={{ fontSize: 36, marginTop: 6 }}>
        DOWN 8.6 LBS
      </div>

      <div className="card" style={{ padding: 18, marginTop: 18 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div className="mono" style={{ color: '#8E8E96', fontSize: 9 }}>
              BODY WEIGHT
            </div>
            <div className="display tnum" style={{ fontSize: 38, marginTop: 4 }}>
              181.0 <span style={{ fontSize: 14, color: '#8E8E96' }}>LBS</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="mono" style={{ color: '#FF5B1F', fontSize: 10 }}>
              ↓ 1.6%
            </div>
            <div className="mono" style={{ color: '#8E8E96', fontSize: 9, marginTop: 4 }}>
              VS 4 WK AGO
            </div>
          </div>
        </div>
        <svg
          viewBox="0 0 300 100"
          style={{ width: '100%', marginTop: 18, height: 100 }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF5B1F" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FF5B1F" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`M 0 ${norm(data[0]) * 90 + 5} ${data
              .map((v, i) => `L ${(i / (data.length - 1)) * 300} ${norm(v) * 90 + 5}`)
              .join(' ')} L 300 100 L 0 100 Z`}
            fill="url(#grad)"
          />
          <path
            d={`M 0 ${norm(data[0]) * 90 + 5} ${data
              .map((v, i) => `L ${(i / (data.length - 1)) * 300} ${norm(v) * 90 + 5}`)
              .join(' ')}`}
            stroke="#FF5B1F"
            strokeWidth="2"
            fill="none"
          />
          {data.map((v, i) => (
            <circle
              key={i}
              cx={(i / (data.length - 1)) * 300}
              cy={norm(v) * 90 + 5}
              r="2.5"
              fill="#FF5B1F"
            />
          ))}
        </svg>
      </div>

      <div className="mono" style={{ color: '#8E8E96', marginTop: 22, marginBottom: 10 }}>
        PROGRESS PHOTOS
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        {[resources.percyMirror, resources.percyFront, resources.percyFlex].map((src, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              aspectRatio: '3/4',
              background: `url(${src}) center/cover`,
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: 6,
                left: 6,
                fontFamily: 'var(--mono)',
                fontSize: 8,
                color: '#F4F1EA',
                letterSpacing: '.1em',
              }}
            >
              WK {i * 4 + 1}
            </div>
          </div>
        ))}
      </div>

      <div className="mono" style={{ color: '#8E8E96', marginTop: 22, marginBottom: 10 }}>
        STRENGTH PRS
      </div>
      {[
        { lift: 'Bench Press', v: 205, d: '+15', u: 'lb' },
        { lift: 'Back Squat', v: 285, d: '+25', u: 'lb' },
        { lift: 'Deadlift', v: 355, d: '+35', u: 'lb' },
      ].map((s, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 0',
            borderBottom: '1px solid #1C1C20',
          }}
        >
          <span style={{ fontFamily: 'var(--display)', fontSize: 18 }}>{s.lift.toUpperCase()}</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span className="tnum" style={{ fontSize: 22, fontWeight: 600 }}>
              {s.v}
              <span style={{ fontSize: 11, color: '#8E8E96' }}> {s.u}</span>
            </span>
            <span className="mono" style={{ color: '#FF5B1F', fontSize: 10 }}>
              {s.d}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
