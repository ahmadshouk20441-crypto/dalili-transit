import { useState, useMemo } from 'react'

export function useSearch(stations, lines) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []

    const stationMatches = stations
      .filter(s => s.name.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q))
      .slice(0, 5)
      .map(s => ({ type: 'station', ...s }))

    const lineMatches = lines
      .filter(l => l.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map(l => ({ type: 'line', ...l }))

    return [...stationMatches, ...lineMatches]
  }, [query, stations, lines])

  return { query, setQuery, results }
}
