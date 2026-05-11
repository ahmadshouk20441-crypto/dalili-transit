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
  const [isMobile, setIsMobile] = useState(false)

  const { query, setQuery, results } = useSearch(uniqueStations, transitLines)
  const { isFavorite, toggle: toggleFavorite } = useFavorites()

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
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
    setSelectedStation(null)
    setHighlightedId(null)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-[Cairo]">
      {/* Alert banners */}
      <AlertBanner alerts={alerts} />

      {/* Header */}
      <Header isDark={isDark} onToggleDark={() => setIsDark(d => !d)} />

      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-4 py-4 gap-4">

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
          transition={{ delay: 0.18 }}
        >
          <LineLegend
            lines={transitLines}
            activeLineId={activeLineId}
            onLineClick={handleLineClick}
            alerts={alerts}
          />
        </motion.div>

        {/* Map + card row */}
        <div
          className="flex-1 flex gap-4 min-h-0"
          style={{ height: 'clamp(380px, 62vh, 640px)' }}
        >
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12, duration: 0.35 }}
            className="flex-1 min-w-0"
          >
            <SvgTransitMap
              stations={uniqueStations}
              lines={transitLines}
              selectedStation={selectedStation}
              highlightedStationId={highlightedId}
              activeLineId={activeLineId}
              onStationClick={handleMapStationClick}
            />
          </motion.div>

          {/* Station card – desktop only */}
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="glass rounded-2xl border border-slate-200 dark:border-slate-700 p-6
                               text-center text-slate-400 dark:text-slate-500"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 mx-auto mb-3
                                    flex items-center justify-center text-3xl">
                      🗺️
                    </div>
                    <p className="text-sm font-medium leading-relaxed">
                      اضغط على أي محطة<br />لعرض تفاصيلها
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Usage hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-slate-400 dark:text-slate-600 font-medium pb-2 select-none"
        >
          اسحب الخريطة للتنقل · استخدم عجلة الفأرة أو إصبعين للتكبير · اضغط محطة لعرض تفاصيلها
        </motion.p>
      </main>

      {/* Bottom sheet – mobile only */}
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
