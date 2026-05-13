import { useState, useEffect } from 'react'
import { uniqueStations } from '../data/stations'
import { transitLines } from '../data/lines'
import { alerts as localAlerts } from '../data/alerts'

const LOCAL = { stations: uniqueStations, lines: transitLines, alerts: localAlerts }

export function useTransitData() {
  const [data, setData] = useState({ ...LOCAL, loading: false, source: 'local' })

  useEffect(() => {
    const apiBase =
      (typeof window !== 'undefined' && window.__DALILI_CONFIG__?.apiBase) ||
      import.meta.env.VITE_WP_API_URL ||
      null

    if (!apiBase) return

    const controller = new AbortController()
    setData(prev => ({ ...prev, loading: true }))

    fetch(`${apiBase}/wp-json/dalili/v1/network`, { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(({ stations, lines, alerts }) => {
        // Ensure every station has cx/cy so StationOverlay never falls back to NaN
        const withCenters = (stations ?? LOCAL.stations).map(s => ({
          ...s,
          cx: s.cx ?? (s.x + 30),
          cy: s.cy ?? (s.y + 30),
        }))
        setData({
          stations: withCenters,
          lines:    lines  ?? LOCAL.lines,
          alerts:   alerts ?? LOCAL.alerts,
          loading:  false,
          source:   'wordpress',
        })
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setData(prev => ({ ...prev, loading: false, source: 'local' }))
        }
      })

    return () => controller.abort()
  }, [])

  return data
}
