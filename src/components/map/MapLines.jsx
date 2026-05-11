import { useMemo } from 'react'

// Build smooth bezier path between station coordinates
function buildLinePath(stationCoords) {
  if (stationCoords.length < 2) return ''
  const pts = stationCoords

  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const curr = pts[i]
    const next = pts[i + 1]
    const mx = (curr.x + next.x) / 2
    const my = (curr.y + next.y) / 2
    if (i === 0) {
      d += ` Q ${curr.x} ${curr.y} ${mx} ${my}`
    } else {
      d += ` Q ${curr.x} ${curr.y} ${mx} ${my}`
    }
  }
  const last = pts[pts.length - 1]
  d += ` L ${last.x} ${last.y}`
  return d
}

export default function MapLines({ lines, stations, activeLineId }) {
  const stationMap = useMemo(() => {
    const m = {}
    stations.forEach(s => { m[s.id] = s })
    return m
  }, [stations])

  return (
    <g>
      {lines.map(line => {
        const coords = line.stationIds
          .map(id => stationMap[id])
          .filter(Boolean)

        const isActive = !activeLineId || activeLineId === line.id
        const path = buildLinePath(coords)

        return (
          <g key={line.id}>
            {/* Shadow / glow */}
            <path
              d={path}
              fill="none"
              stroke={line.color}
              strokeWidth={isActive ? 8 : 4}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={isActive ? 0.15 : 0.05}
            />
            {/* Main line */}
            <path
              d={path}
              fill="none"
              stroke={line.color}
              strokeWidth={isActive ? 4 : 2}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={isActive ? 1 : 0.2}
              strokeDasharray={line.status === 'partial' ? '8 4' : undefined}
            />
          </g>
        )
      })}
    </g>
  )
}
