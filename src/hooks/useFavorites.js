import { useState, useEffect } from 'react'

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dalili-favorites') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('dalili-favorites', JSON.stringify(favorites))
  }, [favorites])

  const toggle = (stationId) => {
    setFavorites(prev =>
      prev.includes(stationId)
        ? prev.filter(id => id !== stationId)
        : [...prev, stationId]
    )
  }

  const isFavorite = (stationId) => favorites.includes(stationId)

  return { favorites, toggle, isFavorite }
}
