import { useMemo, useState } from 'react'

const DOT_R = 18        // normal dot radius (SVG units; station circles are ~30 in SVG space)
const DOT_R_ACTIVE = 24 // selected/highlighted dot radius

function getLineColor(lineId, lines) {
  return lines.find(l => l.id === lineId)?.color ?? '#64748b'
}

function StationHit({ station, lines, isSelected, isHighlighted, isActive, onClick, isDark }) {
  const [hovered, setHovered] = useState(false)
  const primaryColor = getLineColor(station.lineIds[0], lines)
  const cx = station.cx ?? (station.x + BADGE_W / 2)
  const cy = station.cy ?? (station.y + BADGE_H / 2)
  const isEmphasised = isSelected || isHighlighted || hovered
  const r = isEmphasised ? DOT_R_ACTIVE : DOT_R

  // Label background color adapts to dark/light map
  const labelFill = isDark ? '#1e293b' : '#ffffff'
  const labelText = isDark ? '#f1f5f9' : '#0f172a'

  return (
    <g
      data-station="true"
      style={{ cursor: 'pointer', pointerEvents: 'all' }}
      onClick={(e) => { e.stopPropagation(); onClick(station) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      opacity={isActive ? 1 : 0.2}
    >
      {/* Outer pulse ring (highlight) */}
      {isHighlighted && (
        <circle cx={cx} cy={cy} r={r + 14} fill={primaryColor} opacity="0">
          <animate attributeName="r" values={`${r + 8};${r + 26};${r + 8}`} dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.35;0;0.35" dur="2s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Selection / hover ring */}
      {isEmphasised && (
        <circle
          cx={cx} cy={cy}
          r={r + 7}
          fill="none"
          stroke={primaryColor}
          strokeWidth="2"
          opacity={isSelected ? 0.9 : 0.5}
        />
      )}

      {/* Drop shadow circle */}
      <circle cx={cx} cy={cy + 2} r={r + 2} fill="black" opacity="0.18" />

      {/* Main dot body */}
      <circle cx={cx} cy={cy} r={r} fill={primaryColor} />

      {/* White border for contrast on map */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="white" strokeWidth="2.5" opacity="0.9" />

      {/* White inner core */}
      <circle cx={cx} cy={cy} r={r * 0.38} fill="white" />

      {/* Second-line color arc (transfer station) */}
      {station.lineIds.length > 1 && (
        <path
          d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill={getLineColor(station.lineIds[1], lines)}
          clipPath={`circle(${r}px at ${cx}px ${cy}px)`}
        />
      )}

      {/* Invisible hit rect centered on dot */}
      <rect
        x={cx - 40} y={cy - 40}
        width={80} height={80}
        fill="transparent"
      />

      {/* Hover / selected label tooltip */}
      {(isEmphasised) && (() => {
        const labelW = station.name.length * 14 + 20
        const labelH = 28
        const labelX = cx - labelW / 2
        const labelY = cy - r - labelH - 8
        return (
          <g>
            <rect
              x={labelX} y={labelY}
              width={labelW} height={labelH}
              rx="6" ry="6"
              fill={labelFill}
              stroke={primaryColor}
              strokeWidth="1.5"
              opacity="0.96"
              filter="drop-shadow(0 2px 6px rgba(0,0,0,0.2))"
            />
            {/* Triangle pointer */}
            <polygon
              points={`${cx - 6},${labelY + labelH} ${cx + 6},${labelY + labelH} ${cx},${labelY + labelH + 7}`}
              fill={labelFill}
              stroke={primaryColor}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <polygon
              points={`${cx - 5},${labelY + labelH - 1} ${cx + 5},${labelY + labelH - 1} ${cx},${labelY + labelH + 6}`}
              fill={labelFill}
            />
            <text
              x={cx} y={labelY + labelH / 2 + 5}
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fontFamily="Cairo, sans-serif"
              fill={labelText}
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {station.name}
            </text>
          </g>
        )
      })()}
    </g>
  )
}

export default function StationOverlay({ stations, lines, selectedId, highlightedId, activeLineId, onStationClick, isDark }) {
  const unique = useMemo(() => {
    const seen = new Set()
    return stations.filter(s => {
      const key = `${s.x}-${s.y}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [stations])

  // Render selected/highlighted on top
  const sorted = useMemo(() => {
    const priority = new Set([selectedId, highlightedId])
    return [
      ...unique.filter(s => !priority.has(s.id)),
      ...unique.filter(s => priority.has(s.id)),
    ]
  }, [unique, selectedId, highlightedId])

  return (
    <g>
      {sorted.map(station => {
        const isActive = !activeLineId || station.lineIds.includes(activeLineId)
        return (
          <StationHit
            key={station.id}
            station={station}
            lines={lines}
            isSelected={selectedId === station.id}
            isHighlighted={highlightedId === station.id}
            isActive={isActive}
            onClick={onStationClick}
            isDark={isDark}
          />
        )
      })}
    </g>
  )
}
