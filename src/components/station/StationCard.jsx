import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, MapPin, Route } from 'lucide-react'

export default function StationCard({ station, lines, isFavorite, onToggleFavorite, onClose }) {
  const stationLines = station?.lineIds
    .map(id => lines.find(l => l.id === id))
    .filter(Boolean) || []

  return (
    <AnimatePresence>
      {station && (
        <motion.div
          key={station.id}
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="glass rounded-2xl border border-slate-200 dark:border-slate-700 shadow-soft-lg
                     overflow-hidden"
        >
          {/* Color stripe */}
          <div
            className="h-1.5"
            style={{
              background: stationLines.length > 1
                ? `linear-gradient(to right, ${stationLines.map(l => l.color).join(', ')})`
                : stationLines[0]?.color || '#94a3b8',
            }}
          />

          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                    {station.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    {station.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => onToggleFavorite(station.id)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer
                    ${isFavorite
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-500'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-red-400'
                    }`}
                  aria-label="إضافة للمفضلة"
                >
                  <Heart className={`w-4.5 h-4.5 ${isFavorite ? 'fill-red-500' : ''}`} strokeWidth={2} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center
                             text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700
                             transition-colors cursor-pointer"
                  aria-label="إغلاق"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Lines */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Route className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  الخطوط المارّة
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {stationLines.map(line => (
                  <span
                    key={line.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: line.color }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                    {line.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
