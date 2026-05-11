import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, MapPin, Route, Star } from 'lucide-react'

export default function StationCard({ station, lines, isFavorite, onToggleFavorite, onClose }) {
  const stationLines = station?.lineIds
    .map(id => lines.find(l => l.id === id))
    .filter(Boolean) || []

  const gradientStyle = stationLines.length > 1
    ? { background: `linear-gradient(135deg, ${stationLines.map(l => l.color).join(', ')})` }
    : { background: stationLines[0]?.color ?? '#64748b' }

  return (
    <AnimatePresence>
      {station && (
        <motion.div
          key={station.id}
          initial={{ opacity: 0, x: 20, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden
                     border border-slate-200/80 dark:border-slate-700/60
                     shadow-soft-lg"
        >
          {/* Gradient header band */}
          <div className="relative h-16 flex items-end px-4 pb-3" style={gradientStyle}>
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-white text-lg leading-tight drop-shadow-sm">
                {station.name}
              </h3>
            </div>
            {/* Action buttons */}
            <div className="absolute top-2.5 left-2.5 flex gap-1.5">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => onToggleFavorite(station.id)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center backdrop-blur-sm
                            transition-colors cursor-pointer
                            ${isFavorite ? 'bg-white/30 text-yellow-300' : 'bg-white/15 text-white/70 hover:bg-white/25'}`}
                aria-label="مفضلة"
              >
                {isFavorite
                  ? <Star className="w-4 h-4 fill-yellow-300" />
                  : <Heart className="w-4 h-4" />
                }
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm
                           flex items-center justify-center text-white/80 hover:text-white
                           transition-colors cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Description */}
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {station.description}
            </p>

            {/* Lines */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Route className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  الخطوط المارّة
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {stationLines.map(line => (
                  <motion.span
                    key={line.id}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: line.color }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                    {line.name}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Transfer badge */}
            {stationLines.length > 1 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl
                              bg-blue-50 dark:bg-blue-900/20
                              border border-blue-100 dark:border-blue-800/40">
                <span className="text-blue-500 text-base">🔄</span>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  محطة تقاطع — {stationLines.length} خطوط
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
