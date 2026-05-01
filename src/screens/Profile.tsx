import { Icon, IconName } from '../components/Icon'

export function ScreenProfile() {
  const settings: { i: IconName; l: string }[] = [
    { i: 'bell', l: 'Notifications' },
    { i: 'calendar', l: 'Schedule' },
    { i: 'ruler', l: 'Units & metrics' },
    { i: 'moon', l: 'Appearance' },
    { i: 'user', l: 'Account' },
  ]
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
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 999,
            background: 'linear-gradient(135deg,#FF5B1F,#C7421A)',
            display: 'grid',
            placeItems: 'center',
            fontFamily: 'var(--display)',
            fontSize: 24,
          }}
        >
          MK
        </div>
        <div>
          <div className="display" style={{ fontSize: 22 }}>
            MARCUS K.
          </div>
          <div className="mono" style={{ color: '#8E8E96', fontSize: 10, marginTop: 4 }}>
            MEMBER · 87 DAYS
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 8,
          marginTop: 22,
        }}
      >
        {[
          { l: 'SESSIONS', v: 64 },
          { l: 'STREAK', v: 23 },
          { l: 'PRS', v: 11 },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: 14, textAlign: 'center' }}>
            <div className="display" style={{ fontSize: 26 }}>
              {s.v}
            </div>
            <div className="mono" style={{ color: '#8E8E96', fontSize: 9, marginTop: 4 }}>
              {s.l}
            </div>
          </div>
        ))}
      </div>

      <div className="mono" style={{ color: '#8E8E96', marginTop: 24, marginBottom: 6 }}>
        SETTINGS
      </div>
      {settings.map((r, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '16px 0',
            borderBottom: '1px solid #1C1C20',
            cursor: 'pointer',
          }}
        >
          <Icon name={r.i} size={18} color="#8E8E96" />
          <span style={{ flex: 1 }}>{r.l}</span>
          <Icon name="arrow" size={14} color="#8E8E96" />
        </div>
      ))}
    </div>
  )
}
