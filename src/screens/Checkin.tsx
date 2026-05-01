import { Icon } from '../components/Icon'

export function ScreenCheckin() {
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
      <div className="mono" style={{ color: '#FF5B1F' }}>
        WEEKLY CHECK-IN · DUE TODAY
      </div>
      <div className="display" style={{ fontSize: 30, marginTop: 6, lineHeight: 0.95 }}>
        WEEK 12
        <br />
        REPORT
      </div>

      <div className="mono" style={{ color: '#8E8E96', marginTop: 22, marginBottom: 8 }}>
        HOW DID YOU FEEL?
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {['TANKED', 'MEH', 'GOOD', 'STRONG', 'PEAK'].map((l, i) => (
          <button
            key={i}
            style={{
              flex: 1,
              padding: '14px 4px',
              background: i === 3 ? '#FF5B1F' : 'rgba(19,19,22,0.6)',
              border: '1px solid ' + (i === 3 ? '#FF5B1F' : '#2A2A30'),
              color: i === 3 ? '#0A0A0B' : '#F4F1EA',
              borderRadius: 10,
              fontFamily: 'var(--display)',
              fontSize: 11,
              backdropFilter: i === 3 ? undefined : 'blur(12px)',
              WebkitBackdropFilter: i === 3 ? undefined : 'blur(12px)',
            }}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="mono" style={{ color: '#8E8E96', marginTop: 22, marginBottom: 8 }}>
        WEIGHT
      </div>
      <div
        className="card"
        style={{
          padding: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span className="display tnum" style={{ fontSize: 28 }}>
          181.0 LBS
        </span>
        <span className="mono" style={{ color: '#FF5B1F' }}>
          ↓ 0.4
        </span>
      </div>

      <div className="mono" style={{ color: '#8E8E96', marginTop: 22, marginBottom: 8 }}>
        NOTE TO COACH
      </div>
      <textarea
        className="input"
        placeholder="Anything Percy should know? Sleep, soreness, life stress…"
        style={{ minHeight: 110, resize: 'none' }}
        defaultValue="Shoulder felt tight on Wednesday's overhead work — backed off and finished. Otherwise sleep and food were on point."
      />

      <button
        className="btn btn-primary"
        style={{ marginTop: 18, width: '100%', justifyContent: 'center' }}
      >
        Submit check-in <Icon name="arrow" size={14} />
      </button>
    </div>
  )
}
