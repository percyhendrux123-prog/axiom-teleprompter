import { Icon } from '../components/Icon'

export function ScreenNutrition() {
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
        NUTRITION · TUE
      </div>
      <div className="display" style={{ fontSize: 32, marginTop: 4 }}>
        1,840 / 2,200
      </div>

      <div className="card" style={{ padding: 18, marginTop: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { l: 'PROTEIN', v: 146, t: 180, c: '#FF5B1F' },
            { l: 'CARBS', v: 178, t: 220, c: '#F4F1EA' },
            { l: 'FAT', v: 62, t: 70, c: '#8E8E96' },
          ].map((m, i) => (
            <div key={i}>
              <div className="mono" style={{ color: '#8E8E96', fontSize: 9 }}>
                {m.l}
              </div>
              <div className="tnum display" style={{ fontSize: 22, marginTop: 4 }}>
                {m.v}
                <span style={{ fontSize: 11, color: '#8E8E96' }}>g</span>
              </div>
              <div
                style={{
                  height: 4,
                  background: '#1C1C20',
                  borderRadius: 2,
                  marginTop: 8,
                }}
              >
                <div
                  style={{
                    width: `${(m.v / m.t) * 100}%`,
                    height: '100%',
                    background: m.c,
                    borderRadius: 2,
                  }}
                />
              </div>
              <div className="mono" style={{ color: '#8E8E96', fontSize: 9, marginTop: 4 }}>
                OF {m.t}G
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mono" style={{ color: '#8E8E96', marginTop: 22, marginBottom: 10 }}>
        TODAY
      </div>
      {[
        { meal: 'Breakfast', food: '3 eggs, oats, berries', k: 480, p: 32 },
        { meal: 'Lunch', food: 'Chicken bowl, rice, avocado', k: 720, p: 58 },
        { meal: 'Snack', food: 'Whey shake, banana', k: 280, p: 32 },
        { meal: 'Dinner', food: 'Salmon, sweet potato, greens', k: 360, p: 24 },
      ].map((m, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '14px 0',
            borderBottom: '1px solid #1C1C20',
          }}
        >
          <div>
            <div className="mono" style={{ color: '#8E8E96', fontSize: 9 }}>
              {m.meal.toUpperCase()}
            </div>
            <div style={{ fontSize: 14, marginTop: 2 }}>{m.food}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="tnum" style={{ fontSize: 16, fontWeight: 600 }}>
              {m.k}
            </div>
            <div className="mono" style={{ color: '#FF5B1F', fontSize: 9 }}>
              {m.p}G P
            </div>
          </div>
        </div>
      ))}

      <button
        className="btn btn-primary"
        style={{ marginTop: 18, width: '100%', justifyContent: 'center' }}
      >
        <Icon name="sparkle" size={14} /> Snap a meal
      </button>
    </div>
  )
}
