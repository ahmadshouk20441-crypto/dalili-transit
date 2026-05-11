export { transitLines } from './lines'
export { stations, uniqueStations } from './stations'
export { alerts } from './alerts'

import { uniqueStations } from './stations'
import { transitLines } from './lines'
import { alerts } from './alerts'

const API_BASE = import.meta.env.VITE_WP_API_URL || null

export async function fetchStations() {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/wp-json/dalili/v1/stations`)
    return res.json()
  }
  return uniqueStations
}

export async function fetchLines() {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/wp-json/dalili/v1/lines`)
    return res.json()
  }
  return transitLines
}

export async function fetchAlerts() {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/wp-json/dalili/v1/alerts`)
    return res.json()
  }
  return alerts
}
