import { useEffect, useState } from 'react'
import { Icon } from './Icon'

const SETTINGS_KEY = 'pkfit:settings'

export interface Settings {
  theme: 'dark' | 'light'
  scrollIntensity: number
}

const DEFAULTS: Settings = {
  theme: 'dark',
  scrollIntensity: 1.1,
}

export function loadSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULTS
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY)
    if (!raw) return DEFAULTS
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) }
  } catch {
    return DEFAULTS
  }
}

interface SettingsPanelProps {
  settings: Settings
  onChange: (next: Settings) => void
}

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme)
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    } catch {
      /* ignore */
    }
  }, [settings])

  return (
    <>
      <button
        className="settings-fab"
        aria-label="Settings"
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name="settings" size={18} />
      </button>
      {open && (
        <div className="settings-card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <span className="mono" style={{ color: '#FF5B1F' }}>
              ● TWEAKS
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'transparent',
                border: 0,
                color: '#8E8E96',
                cursor: 'pointer',
              }}
              aria-label="Close"
            >
              <Icon name="close" size={14} />
            </button>
          </div>

          <div className="mono" style={{ color: '#8E8E96', marginBottom: 6 }}>
            APPEARANCE
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            {(['dark', 'light'] as const).map((t) => (
              <button
                key={t}
                onClick={() => onChange({ ...settings, theme: t })}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 8,
                  border: '1px solid ' + (settings.theme === t ? '#FF5B1F' : '#2A2A30'),
                  background: settings.theme === t ? 'rgba(255,91,31,0.12)' : 'transparent',
                  color: '#F4F1EA',
                  fontFamily: 'var(--mono)',
                  fontSize: 10,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mono" style={{ color: '#8E8E96', marginBottom: 6 }}>
            SCROLL INTENSITY
          </div>
          <input
            type="range"
            min={0.4}
            max={1.6}
            step={0.1}
            value={settings.scrollIntensity}
            onChange={(e) =>
              onChange({ ...settings, scrollIntensity: Number(e.target.value) })
            }
            style={{ width: '100%', accentColor: '#FF5B1F' }}
          />
          <div
            className="mono tnum"
            style={{ color: '#8E8E96', textAlign: 'right', fontSize: 10, marginTop: 4 }}
          >
            {settings.scrollIntensity.toFixed(1)}×
          </div>
        </div>
      )}
    </>
  )
}
