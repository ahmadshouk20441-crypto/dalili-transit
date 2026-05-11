import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { X, Heart, MapPin, Route, Star } from 'lucide-react'

export default function BottomSheet({ station, lines, isFavorite, onToggleFavorite, onClose }) {
  const dragControls = useDragControls()

  const stationLines = station?.lineIds
    .map(id => lines.find(l => l.id === id))
    .filter(Boolean) || []

  const gradientStyle = stationLines.length > 1
    ? { background: `linear-gradient(135deg, ${stationLines.map(l => l.color).join(', ')})` }
    : { background: stationLines[0]?.color ?? '#64748b' }

  return (
    <AnimatePresence>
      {station && (
        <>
          {/* Backdrop */}
          <motion.div
            key="bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 34, mass: 0.9 }}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.velocity.y > 500 || info.offset.y > 130) onClose()
            }}
            className="fixed bottom-0 left-0 right-0 z-50
                       bg-white dark:bg-slate-900
                       rounded-t-3xl border-t border-slate-200 dark:border-slate-700
                       shadow-[0_-8px_40px_-8px_rgba(0,0,0,0.2)]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
          >
            {/* Drag handle */}
            <div
              className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing"
              onPointerDown={e => dragControls.start(e)}
            >
              <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>

            {/* Gradient band */}
            <div className="relative h-14 mx-4 mt-2 rounded-2xl flex items-center px-4 gap-3 overflow-hidden"
                 style={gradientStyle}>
              <div className="absolute inset-0 bg-black/15" />
              <MapPin className="relative w-5 h-5 text-white flex-shrink-0" />
              <h3 className="relative font-bold text-white text-xl">{station.name}</h3>

              {/* Action buttons */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-1.5">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => onToggleFavorite(station.id)}
                  className={`w-9 h-9 rounded-xl backdrop-blur-sm flex items-center justify-center
                              cursor-pointer transition-colors
                              ${isFavorite ? 'bg-white/30 text-yellow-300' : 'bg-white/15 text-white/70'}`}
                >
                  {isFavorite
                    ? <Star className="w-4.5 h-4.5 fill-yellow-300" />
                    : <Heart className="w-4.5 h-4.5" />
                  }
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center
                             text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            <div className="px-4 py-4 space-y-3">
              {/* Description */}
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {station.description}
              </p>

              {/* Lines */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3.5">
                <div className="flex items-center gap-2 mb-3">
                  <Route className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    الخطوط المارّة بهذه المحطة
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {stationLines.map(line => (
                    <div
                      key={line.id}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold text-white"
                      style={{ backgroundColor: line.color }}
                    >
                      <span className="w-2 h-2 rounded-full bg-white/50" />
                      {line.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Transfer badge */}
              {stationLines.length > 1 && (
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl
                                bg-blue-50 dark:bg-blue-900/20
                                border border-blue-100 dark:border-blue-800/40">
                  <span className="text-lg">🔄</span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    محطة تقاطع — {stationLines.length} خطوط
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
