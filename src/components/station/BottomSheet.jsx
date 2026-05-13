import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { X, Star, Heart, ArrowLeftRight } from 'lucide-react'

export default function BottomSheet({ station, lines, isFavorite, onToggleFavorite, onClose }) {
  const dragControls = useDragControls()

  const stationLines = station?.lineIds
    .map(id => lines.find(l => l.id === id))
    .filter(Boolean) || []

  const accentGradient = stationLines.length > 1
    ? `linear-gradient(90deg, ${stationLines.map(l => l.color).join(', ')})`
    : stationLines[0]?.color ?? '#64748b'

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
            className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-40"
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
                       bg-white/97 dark:bg-slate-900/97 backdrop-blur-2xl
                       rounded-t-3xl
                       border-t border-slate-200/70 dark:border-white/8
                       shadow-[0_-16px_48px_-8px_rgba(0,0,0,0.18)]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
          >
            {/* Drag handle */}
            <div
              className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
              onPointerDown={e => dragControls.start(e)}
            >
              <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>

            {/* Thin accent bar */}
            <div
              className="h-1 mx-4 rounded-full"
              style={{ background: accentGradient }}
            />

            {/* Header row */}
            <div className="flex items-start gap-2 px-4 pt-3.5 pb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-[19px] leading-snug text-slate-900 dark:text-white text-right">
                  {station.name}
                </h3>
                {station.description && (
                  <p className="text-[13px] text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed text-right">
                    {station.description}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-1.5 flex-shrink-0 mt-0.5">
                <motion.button
                  whileTap={{ scale: 0.82 }}
                  onClick={() => onToggleFavorite(station.id)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center
                              transition-colors cursor-pointer
                              ${isFavorite
                                ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-400'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-400'}`}
                  aria-label="مفضلة"
                >
                  {isFavorite
                    ? <Star className="w-4.5 h-4.5 fill-amber-400" strokeWidth={0} />
                    : <Heart className="w-4.5 h-4.5" strokeWidth={2} />
                  }
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.82 }}
                  onClick={onClose}
                  className="w-9 h-9 rounded-full flex items-center justify-center
                             bg-slate-100 dark:bg-slate-800
                             hover:bg-slate-200 dark:hover:bg-slate-700
                             text-slate-400 hover:text-slate-600
                             transition-colors cursor-pointer"
                  aria-label="إغلاق"
                >
                  <X className="w-4.5 h-4.5" strokeWidth={2.2} />
                </motion.button>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px mx-4 bg-slate-100 dark:bg-white/6" />

            {/* Lines section */}
            <div className="px-4 pt-3 pb-5 space-y-2.5">
              <p className="text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-600 uppercase text-right">
                الخطوط المارّة
              </p>
              <div className="flex flex-wrap gap-2 justify-end">
                {stationLines.map(line => (
                  <div
                    key={line.id}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full
                               text-[13px] font-bold text-white leading-none"
                    style={{ backgroundColor: line.color }}
                  >
                    {line.name}
                  </div>
                ))}
              </div>

              {/* Transfer badge */}
              {stationLines.length > 1 && (
                <div className="flex items-center justify-end gap-2 pt-1">
                  <span className="text-[13px] font-semibold text-blue-500 dark:text-blue-400">
                    محطة تقاطع — {stationLines.length} خطوط
                  </span>
                  <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    <ArrowLeftRight className="w-4 h-4 text-blue-500 dark:text-blue-400" strokeWidth={2} />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
