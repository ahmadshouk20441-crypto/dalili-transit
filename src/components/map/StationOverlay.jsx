import { useMemo } from 'react'
import { BADGE_W, BADGE_H } from '../../data/stations'

// Radius of the click-target circle centered on each badge
const HIT_R = 38

function getLineColor(lineId, lines) {
  return lines.find(l => l.id === lineId)?.color ?? '#64748b'
}

function StationHit({ station, lines, isSelected, isHighlighted, isActive, onClick }) {
  const primaryColor = getLineColor(station.lineIds[0], lines)
  const cx = station.cx ?? (station.x + BADGE_W / 2)
  const cy = station.cy ?? (station.y + BADGE_H / 2)

  return (
    <g
      data-station="true"
      style={{ cursor: 'pointer', pointerEvents: 'all' }}
      onClick={(e) => { e.stopPropagation(); onClick(station) }}
      opacity={isActive ? 1 : 0.3}
    >
      {/* Pulsing ring for highlighted station */}
      {isHighlighted && (
        <>
          <circle cx={cx} cy={cy} r={HIT_R + 12} fill={primaryColor} opacity="0.15">
            <animate attributeName="r" from={HIT_R + 8} to={HIT_R + 20} dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.2" to="0" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <circle cx={cx} cy={cy} r={HIT_R + 6} fill="none" stroke={primaryColor} strokeWidth="2.5" opacity="0.6" />
        </>
      )}

      {/* Selection ring */}
      {isSelected && !isHighlighted && (
        <circle cx={cx} cy={cy} r={HIT_R + 6} fill="none" stroke={primaryColor} strokeWidth="3" opacity="0.8" />
      )}

      {/* Transparent hit area (invisible but clickable) */}
      <rect
        x={station.x}
        y={station.y}
        width={BADGE_W}
        height={BADGE_H}
        fill="transparent"
        rx="6"
      />

      {/* Visible glow dot on top of the badge */}
      <circle
        cx={cx}
        cy={cy}
        r={isSelected || isHighlighted ? 14 : 10}
        fill={primaryColor}
        opacity={isSelected || isHighlighted ? 0.85 : 0.55}
        style={{ transition: 'r 0.2s, opacity 0.2s' }}
      />

      {/* Multi-line indicator dots */}
      {station.lineIds.length > 1 && station.lineIds.slice(1).map((lid, i) => (
        <circle
          key={lid}
          cx={cx + (i + 1) * 18}
          cy={cy}
          r={6}
          fill={getLineColor(lid, lines)}
          opacity={0.7}
        />
      ))}

      {/* White inner dot */}
      <circle
        cx={cx}
        cy={cy}
        r={isSelected || isHighlighted ? 6 : 4}
        fill="white"
        opacity={0.95}
        style={{ transition: 'r 0.2s' }}
      />
    </g>
  )
}

export default function StationOverlay({ stations, lines, selectedId, highlightedId, activeLineId, onStationClick }) {
  // Deduplicate by (x,y) — stations at the same position appear once
  const unique = useMemo(() => {
    const seen = new Set()
    return stations.filter(s => {
      const key = `${s.x}-${s.y}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [stations])

  return (
    <g>
      {unique.map(station => {
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
          />
        )
      })}
    </g>
  )
}
