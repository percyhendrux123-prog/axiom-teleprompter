import { Icon } from '../components/Icon'
import { resources } from '../resources'

export function ScreenExercise() {
  return (
    <div style={{ height: '100%', overflow: 'auto', background: '#0A0A0B', color: '#F4F1EA' }}>
      <div
        style={{
          position: 'relative',
          height: 320,
          background: `url(${resources.percyBicep}) center/cover`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,.4), rgba(10,10,11,1))',
          }}
        />
        <button
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            width: 36,
            height: 36,
            borderRadius: 999,
            background: 'rgba(10,10,11,.6)',
            border: '1px solid #2A2A30',
            color: '#F4F1EA',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <Icon name="close" size={16} />
        </button>
        <button
          style={{
            position: 'absolute',
            left: '50%',
            top: '45%',
            transform: 'translate(-50%,-50%)',
            width: 64,
            height: 64,
            borderRadius: 999,
            background: '#FF5B1F',
            border: 0,
            color: '#0A0A0B',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Icon name="play" size={22} />
        </button>
        <div style={{ position: 'absolute', bottom: 18, left: 22, right: 22 }}>
          <div className="mono" style={{ color: '#FF5B1F', fontSize: 9 }}>
            CHEST · COMPOUND
          </div>
          <div className="display" style={{ fontSize: 32, marginTop: 4 }}>
            BARBELL BENCH PRESS
          </div>
        </div>
      </div>
      <div style={{ padding: '20px 22px' }}>
        <div className="mono" style={{ color: '#8E8E96' }}>
          FORM CUES
        </div>
        <ul style={{ paddingLeft: 0, listStyle: 'none', marginTop: 10 }}>
          {[
            'Set shoulder blades, pin them down',
            'Bar path: down to lower chest, up over shoulders',
            '3-second eccentric, explosive concentric',
            'Feet planted — drive through the floor',
          ].map((c, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                gap: 12,
                padding: '10px 0',
                borderBottom: '1px solid #1C1C20',
                fontSize: 14,
              }}
            >
              <span style={{ fontFamily: 'var(--display)', color: '#FF5B1F' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {c}
            </li>
          ))}
        </ul>
        <button className="btn btn-ghost" style={{ marginTop: 18, width: '100%', justifyContent: 'center' }}>
          <Icon name="camera" size={14} /> AI form check
        </button>
      </div>
    </div>
  )
}
