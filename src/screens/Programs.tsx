import { resources } from '../resources'

interface Program {
  name: string
  w: number
  sess: string
  img: string
  tag: string
  desc: string
}

export function ScreenPrograms() {
  const programs: Program[] = [
    {
      name: 'FOUNDATION',
      w: 8,
      sess: '3×/wk',
      img: resources.percyBack,
      tag: 'Active',
      desc: 'Build the base. Compound lifts, full body.',
    },
    {
      name: 'RECOMP',
      w: 12,
      sess: '4×/wk',
      img: resources.percyFront,
      tag: '',
      desc: 'Drop fat, hold strength. Hybrid split.',
    },
    {
      name: 'HYPERTROPHY',
      w: 10,
      sess: '5×/wk',
      img: resources.percyFlex,
      tag: '',
      desc: 'Volume focus. Push / pull / legs.',
    },
    {
      name: 'METCON',
      w: 6,
      sess: '3×/wk',
      img: resources.percyBicep,
      tag: '',
      desc: 'Conditioning. Short, brutal sessions.',
    },
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
      <div className="mono" style={{ color: '#8E8E96' }}>
        PROGRAMS
      </div>
      <div className="display" style={{ fontSize: 36, marginTop: 4 }}>
        BUILT BY PERCY
      </div>
      <div style={{ color: '#8E8E96', fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>
        Select a program. AI tailors load, volume & substitutions weekly.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
        {programs.map((p, i) => (
          <div
            key={i}
            className="card"
            style={{
              padding: 0,
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: '120px 1fr',
              overflow: 'hidden',
            }}
          >
            <div style={{ background: `url(${p.img}) center/cover`, minHeight: 130 }} />
            <div style={{ padding: 14 }}>
              {p.tag && (
                <span className="pill pill-accent" style={{ marginBottom: 8 }}>
                  {p.tag}
                </span>
              )}
              <div className="display" style={{ fontSize: 20, marginTop: p.tag ? 6 : 0 }}>
                {p.name}
              </div>
              <div className="mono" style={{ color: '#8E8E96', fontSize: 9, marginTop: 4 }}>
                {p.w} WEEKS · {p.sess}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: '#8E8E96',
                  marginTop: 8,
                  lineHeight: 1.4,
                }}
              >
                {p.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
