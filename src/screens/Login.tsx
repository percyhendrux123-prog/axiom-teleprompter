import { Icon } from '../components/Icon'

export function ScreenLogin() {
  return (
    <div
      style={{
        height: '100%',
        background: '#0A0A0B',
        color: '#F4F1EA',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 24px 28px',
      }}
    >
      <div className="mono" style={{ color: '#FF5B1F' }}>
        ● PKFIT.APP
      </div>
      <div className="display" style={{ fontSize: 36, marginTop: 28, lineHeight: 0.92 }}>
        WELCOME
        <br />
        BACK.
      </div>
      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input className="input" placeholder="Email" defaultValue="marcus@email.com" />
        <input className="input" placeholder="Password" type="password" defaultValue="••••••••••" />
      </div>
      <a
        style={{
          color: '#FF5B1F',
          fontSize: 12,
          marginTop: 14,
          textDecoration: 'none',
          fontFamily: 'var(--mono)',
          letterSpacing: '.1em',
          textTransform: 'uppercase',
        }}
      >
        Forgot password?
      </a>
      <div style={{ flex: 1 }} />
      <button
        className="btn btn-primary"
        style={{ width: '100%', justifyContent: 'center', padding: '16px' }}
      >
        Sign in <Icon name="arrow" size={14} />
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18 }}>
        <div style={{ flex: 1, height: 1, background: '#1C1C20' }} />
        <span className="mono" style={{ color: '#8E8E96' }}>
          OR
        </span>
        <div style={{ flex: 1, height: 1, background: '#1C1C20' }} />
      </div>
      <button
        className="btn btn-ghost"
        style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: 14 }}
      >
        <Icon name="apple" size={16} /> Continue with Apple
      </button>
    </div>
  )
}
