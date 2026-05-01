import { CSSProperties, ReactNode } from 'react'

interface FrameProps {
  children: ReactNode
  w?: number
  h?: number
  theme?: 'dark' | 'light'
  style?: CSSProperties
  statusBarColor?: string
}

export function Phone({
  children,
  w = 380,
  h = 800,
  theme = 'dark',
  style = {},
  statusBarColor,
}: FrameProps) {
  return (
    <div className="phone-shell" style={{ width: w, height: h, ...style }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          background: theme === 'dark' ? '#0A0A0B' : '#FAF8F3',
          color: theme === 'dark' ? '#F4F1EA' : '#0A0A0B',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          className="status-bar"
          style={{ color: statusBarColor || (theme === 'dark' ? '#F4F1EA' : '#0A0A0B') }}
        >
          <span className="tnum">9:41</span>
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
              <rect x="0" y="8" width="3" height="4" rx="1" />
              <rect x="5" y="5" width="3" height="7" rx="1" />
              <rect x="10" y="2" width="3" height="10" rx="1" />
              <rect x="15" y="0" width="3" height="12" rx="1" />
            </svg>
            <svg width="22" height="12" viewBox="0 0 22 12" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="0.5" y="1" width="18" height="10" rx="2.5" />
              <rect x="2" y="2.5" width="14" height="7" rx="1.5" fill="currentColor" />
              <rect x="20" y="4" width="2" height="4" rx="1" fill="currentColor" />
            </svg>
          </span>
        </div>
        <div style={{ position: 'absolute', inset: '50px 0 0 0', overflow: 'hidden' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export function Tablet({
  children,
  w = 820,
  h = 1100,
  theme = 'dark',
  style = {},
}: FrameProps) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 30,
        background: '#0A0A0B',
        padding: 12,
        boxShadow: '0 0 0 1px rgba(255,255,255,.06), 0 40px 80px -20px rgba(0,0,0,.7)',
        ...style,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          background: theme === 'dark' ? '#0A0A0B' : '#FAF8F3',
          color: theme === 'dark' ? '#F4F1EA' : '#0A0A0B',
          borderRadius: 20,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export function Desktop({
  children,
  w = 1280,
  h = 800,
  theme = 'dark',
  style = {},
}: FrameProps) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 14,
        background: '#1C1C20',
        boxShadow: '0 0 0 1px rgba(255,255,255,.08), 0 40px 80px -20px rgba(0,0,0,.7)',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          height: 32,
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          gap: 6,
          background: '#131316',
          borderBottom: '1px solid #2A2A30',
        }}
      >
        <span style={{ width: 11, height: 11, borderRadius: 999, background: '#FF5F57' }} />
        <span style={{ width: 11, height: 11, borderRadius: 999, background: '#FEBC2E' }} />
        <span style={{ width: 11, height: 11, borderRadius: 999, background: '#FF8C42' }} />
        <span
          style={{
            marginLeft: 16,
            fontFamily: 'var(--mono)',
            fontSize: 10,
            color: '#6B6B72',
            letterSpacing: '.1em',
          }}
        >
          PKFIT.APP
        </span>
      </div>
      <div
        style={{
          height: 'calc(100% - 32px)',
          background: theme === 'dark' ? '#0A0A0B' : '#FAF8F3',
          color: theme === 'dark' ? '#F4F1EA' : '#0A0A0B',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  )
}
