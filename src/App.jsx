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
import { uniqueStations, transitLines, alerts } from './data'

export default function App() {
  const [isDark, setIsDark] = useDarkMode()
  const [selectedStation, setSelectedStation] = useState(null)
  const [highlightedId, setHighlightedId] = useState(null)
  const [activeLineId, setActiveLineId] = useState(null)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768
  )

  const { query, setQuery, results } = useSearch(uniqueStations, transitLines)
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300"
         style={{ fontFamily: "'Cairo', sans-serif" }}>

      {/* Alert banners */}
      <AlertBanner alerts={alerts} />

      {/* Header */}
      <Header isDark={isDark} onToggleDark={() => setIsDark(d => !d)} />

      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 pt-3 pb-4 gap-3">

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <SearchBox
            query={query}
            onChange={setQuery}
            results={results}
            onSelect={handleSearchSelect}
          />
        </motion.div>

        {/* Line legend */}
        <motion.div
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

        {/* Map + card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex-1 flex gap-3 min-h-0"
          style={{ height: 'clamp(400px, 64vh, 660px)' }}
        >
          {/* Map */}
          <div className="flex-1 min-w-0">
            <SvgTransitMap
              stations={uniqueStations}
              lines={transitLines}
              selectedStation={selectedStation}
              highlightedStationId={highlightedId}
              activeLineId={activeLineId}
              onStationClick={handleMapStationClick}
              isDark={isDark}
            />
          </div>

          {/* Station card — desktop */}
          {!isMobile && (
            <div className="w-72 flex-shrink-0 self-start">
              <AnimatePresence mode="wait">
                {selectedStation ? (
                  <StationCard
                    key={selectedStation.id}
                    station={selectedStation}
                    lines={transitLines}
                    isFavorite={isFavorite(selectedStation.id)}
                    onToggleFavorite={toggleFavorite}
                    onClose={handleCloseStation}
                  />
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl
                               border border-slate-200/80 dark:border-slate-700/60
                               shadow-soft p-6 text-center"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100
                                    dark:from-blue-900/20 dark:to-blue-800/20
                                    mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl">🗺️</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
                      اضغط على أي محطة
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      لعرض تفاصيل الخطوط والمسارات
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Footer hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-slate-400/70 dark:text-slate-600 font-medium select-none"
        >
          اسحب للتنقل · عجلة الفأرة أو إصبعان للتكبير · اضغط محطة لتفاصيلها
        </motion.p>
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
