import { resources } from '../resources'

export function ScreenSplash() {
  return (
    <div
      style={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: '#0A0A0B',
        color: '#F4F1EA',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `url(${resources.percyProfile}) center/cover`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(10,10,11,.3) 0%, rgba(10,10,11,.95) 80%)',
        }}
      />
      <div
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '30px 24px 28px',
        }}
      >
        <div>
          <div className="mono" style={{ color: '#FF5B1F' }}>
            ● PKFIT.APP
          </div>
        </div>
        <div>
          <div className="mono" style={{ color: 'rgba(244,241,234,.6)' }}>
            COACHED BY PERCY KEITH
          </div>
          <div className="display" style={{ fontSize: 56, lineHeight: 0.88, marginTop: 12 }}>
            DO THE
            <br />
            HARD
            <br />
            <span style={{ color: '#FF5B1F' }}>THING.</span>
          </div>
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '16px' }}
            >
              Get started
            </button>
            <button
              className="btn btn-ghost"
              style={{ width: '100%', justifyContent: 'center', padding: '16px' }}
            >
              I have an account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
