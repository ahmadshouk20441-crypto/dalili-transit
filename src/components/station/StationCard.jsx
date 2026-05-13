import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Heart, ArrowLeftRight } from 'lucide-react'

export default function StationCard({ station, lines, isFavorite, onToggleFavorite, onClose }) {
  const stationLines = station?.lineIds
    .map(id => lines.find(l => l.id === id))
    .filter(Boolean) || []

  const accentGradient = stationLines.length > 1
    ? `linear-gradient(90deg, ${stationLines.map(l => l.color).join(', ')})`
    : stationLines[0]?.color ?? '#64748b'

  return (
    <AnimatePresence>
      {station && (
        <motion.div
          key={station.id}
          initial={{ opacity: 0, x: 16, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 16, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl
                     rounded-2xl overflow-hidden
                     border border-slate-200/70 dark:border-white/8
                     shadow-[0_16px_48px_-8px_rgba(0,0,0,0.20),0_4px_16px_-4px_rgba(0,0,0,0.10)]"
        >
          {/* Thin color accent bar */}
          <div
            className="h-1 w-full flex-shrink-0"
            style={{ background: accentGradient }}
          />

          {/* Header row */}
          <div className="flex items-start gap-2 px-4 pt-3.5 pb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-[17px] leading-snug text-slate-900 dark:text-white text-right">
                {station.name}
              </h3>
              {station.description && (
                <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed text-right truncate">
                  {station.description}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-1.5 flex-shrink-0 mt-0.5">
              <motion.button
                whileTap={{ scale: 0.82 }}
                onClick={() => onToggleFavorite(station.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center
                            transition-colors cursor-pointer
                            ${isFavorite
                              ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'}`}
                aria-label="مفضلة"
              >
                {isFavorite
                  ? <Star className="w-4 h-4 fill-amber-400" strokeWidth={0} />
                  : <Heart className="w-4 h-4" strokeWidth={2} />
                }
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.82 }}
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center
                           bg-slate-100 dark:bg-slate-800
                           hover:bg-slate-200 dark:hover:bg-slate-700
                           text-slate-400 hover:text-slate-600 dark:hover:text-slate-200
                           transition-colors cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" strokeWidth={2.2} />
              </motion.button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px mx-4 bg-slate-100 dark:bg-white/6" />

          {/* Lines section */}
          <div className="px-4 pt-3 pb-4 space-y-2.5">
            <p className="text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-600 uppercase text-right">
              الخطوط المارّة
            </p>
            <div className="flex flex-wrap gap-1.5 justify-end">
              {stationLines.map(line => (
                <motion.span
                  key={line.id}
                  whileHover={{ scale: 1.04 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                             text-[12px] font-bold text-white leading-none"
                  style={{ backgroundColor: line.color }}
                >
                  {line.name}
                </motion.span>
              ))}
            </div>

            {/* Transfer badge */}
            {stationLines.length > 1 && (
              <div className="flex items-center justify-end gap-2 pt-0.5">
                <span className="text-[12px] font-semibold text-blue-500 dark:text-blue-400">
                  محطة تقاطع — {stationLines.length} خطوط
                </span>
                <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" strokeWidth={2} />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
