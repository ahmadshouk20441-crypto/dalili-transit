import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import Header from './components/layout/Header'
import SearchBox from './components/search/SearchBox'
import SvgTransitMap from './components/map/SvgTransitMap'
import StationCard from './components/station/StationCard'
import BottomSheet from './components/station/BottomSheet'
import LineLegend from './components/ui/LineLegend'
import AlertBanner from './components/ui/AlertBanner'

import { useDarkMode } from './hooks/useDarkMode'
import { useSearch } from './hooks/useSearch'
import { useFavorites } from './hooks/useFavorites'
import { useTransitData } from './hooks/useTransitData'

export default function App() {
  const [isDark, setIsDark] = useDarkMode()
  const [selectedStation, setSelectedStation] = useState(null)
  const [highlightedId, setHighlightedId] = useState(null)
  const [activeLineId, setActiveLineId] = useState(null)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768
  )

  const { stations, lines: transitLines, alerts } = useTransitData()
  const { query, setQuery, results } = useSearch(stations, transitLines)
  const { isFavorite, toggle: toggleFavorite } = useFavorites()

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const handleSearchSelect = useCallback((item) => {
    if (item.type === 'line') {
      setActiveLineId(prev => prev === item.id ? null : item.id)
      setSelectedStation(null)
      setHighlightedId(null)
      setQuery('')
      return
    }
    setSelectedStation(item)
    setHighlightedId(item.id)
    setQuery('')
  }, [setQuery])

  const handleMapStationClick = useCallback((station) => {
    setSelectedStation(prev => prev?.id === station.id ? null : station)
    setHighlightedId(prev => prev === station.id ? null : station.id)
  }, [])

  const handleCloseStation = useCallback(() => {
    setSelectedStation(null)
    setHighlightedId(null)
  }, [])

  const handleLineClick = useCallback((lineId) => {
    setActiveLineId(prev => prev === lineId ? null : lineId)
    if (lineId === null) return
    setSelectedStation(null)
    setHighlightedId(null)
  }, [])

  return (
    <div
      className="bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden transition-colors duration-300"
      style={{ height: '100dvh', fontFamily: "'Cairo', sans-serif" }}
    >
      {/* Alert banners */}
      <AlertBanner alerts={alerts} />

      {/* Header */}
      <Header isDark={isDark} onToggleDark={() => setIsDark(d => !d)} />

      {/* Main — fills all remaining viewport height */}
      <main className="flex-1 min-h-0 flex flex-col w-full px-3 pt-2 pb-3 gap-2">

        {/* Search */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <SearchBox
            query={query}
            onChange={setQuery}
            results={results}
            onSelect={handleSearchSelect}
            lines={transitLines}
          />
        </motion.div>

        {/* Line legend */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          <LineLegend
            lines={transitLines}
            activeLineId={activeLineId}
            onLineClick={handleLineClick}
            alerts={alerts}
          />
        </motion.div>

        {/* Map — stretches to fill all remaining space */}
        <motion.div
          className="flex-1 min-h-0 relative"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >

          {!isMobile && (
            <div className="absolute top-3 right-3 w-72 z-10">
              <AnimatePresence mode="wait">
                {selectedStation && (
                  <StationCard
                    key={selectedStation.id}
                    station={selectedStation}
                    lines={transitLines}
                    isFavorite={isFavorite(selectedStation.id)}
                    onToggleFavorite={toggleFavorite}
                    onClose={handleCloseStation}
                  />
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

      </main>

      {/* Bottom sheet — mobile */}
      {isMobile && (
        <BottomSheet
          station={selectedStation}
          lines={transitLines}
          isFavorite={selectedStation ? isFavorite(selectedStation.id) : false}
          onToggleFavorite={toggleFavorite}
          onClose={handleCloseStation}
        />
      )}
    </div>
  )
}
