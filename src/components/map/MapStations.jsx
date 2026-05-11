import { useMemo } from 'react'

function getStationLineColors(station, lines) {
  return station.lineIds
    .map(id => lines.find(l => l.id === id)?.color)
    .filter(Boolean)
}

function StationNode({ station, lines, isSelected, isHighlighted, isActive, onClick }) {
  const colors = getStationLineColors(station, lines)
  const isMultiLine = colors.length > 1

  const r = isMultiLine ? 9 : 7
  const ringR = r + 4

  return (
    <g
      data-station="true"
      transform={`translate(${station.x}, ${station.y})`}
      onClick={() => onClick(station)}
      style={{ cursor: 'pointer' }}
      opacity={isActive ? 1 : 0.25}
    >
      {/* Selection ring */}
      {(isSelected || isHighlighted) && (
        <circle
          r={ringR + 2}
          fill="none"
          stroke={colors[0] || '#3b82f6'}
          strokeWidth="2"
          opacity="0.5"
        >
          {isHighlighted && (
            <animate
              attributeName="r"
              from={ringR}
              to={ringR + 6}
              dur="1s"
              repeatCount="indefinite"
            />
          )}
        </circle>
      )}

      {/* Glow */}
      {(isSelected || isHighlighted) && (
        <circle r={r + 6} fill={colors[0] || '#3b82f6'} opacity="0.2" />
      )}

      {/* Station body */}
      {isMultiLine ? (
        // Multi-line: split circle
        <>
          <circle r={r} fill={colors[0]} />
          <path
            d={`M 0 ${-r} A ${r} ${r} 0 0 1 0 ${r} Z`}
            fill={colors[1] || colors[0]}
          />
          <circle r={r} fill="none" stroke="white" strokeWidth="2" />
        </>
      ) : (
        <>
          <circle r={r} fill={colors[0] || '#94a3b8'} />
          <circle r={r - 2.5} fill="white" />
          <circle r={r - 4.5} fill={colors[0] || '#94a3b8'} />
        </>
      )}

      {/* Hover fill */}
      <circle r={r} fill="transparent" />

      {/* Label */}
      <text
        y={r + 13}
        textAnchor="middle"
        fontSize={isSelected || isHighlighted ? '10' : '9'}
        fontWeight={isSelected || isHighlighted ? '700' : '500'}
        fill="currentColor"
        fontFamily="Cairo, sans-serif"
        className="fill-slate-700 dark:fill-slate-200"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {station.name}
      </text>
    </g>
  )
}

export default function MapStations({ stations, lines, selectedId, highlightedId, activeLineId, onStationClick }) {
  const rendered = useMemo(() => {
    // Deduplicate by coordinates to avoid rendering same physical station twice
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
      {rendered.map(station => {
        const isActive = !activeLineId || station.lineIds.includes(activeLineId)
        return (
          <StationNode
            key={`${station.x}-${station.y}`}
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
