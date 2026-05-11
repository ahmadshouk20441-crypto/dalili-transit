import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { X, Heart, MapPin, Route } from 'lucide-react'

export default function BottomSheet({ station, lines, isFavorite, onToggleFavorite, onClose }) {
  const dragControls = useDragControls()

  const stationLines = station?.lineIds
    .map(id => lines.find(l => l.id === id))
    .filter(Boolean) || []

  return (
    <AnimatePresence>
      {station && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.8 }}
            onDragEnd={(_, info) => { if (info.velocity.y > 400 || info.offset.y > 150) onClose() }}
            className="fixed bottom-0 left-0 right-0 z-50 glass rounded-t-3xl
                       border-t border-slate-200 dark:border-slate-700 shadow-soft-lg"
          >
            {/* Drag handle */}
            <div
              className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing"
              onPointerDown={e => dragControls.start(e)}
            >
              <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
            </div>

            <div className="px-5 pb-safe pb-6">
              {/* Color stripe */}
              <div
                className="h-1 rounded-full mb-4"
                style={{
                  background: stationLines.length > 1
                    ? `linear-gradient(to right, ${stationLines.map(l => l.color).join(', ')})`
                    : stationLines[0]?.color || '#94a3b8',
                }}
              />

              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white">{station.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{station.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => onToggleFavorite(station.id)}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors cursor-pointer
                      ${isFavorite
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-500'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-400'
                      }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={onClose}
                    className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center
                               text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700
                               transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Lines */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Route className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">الخطوط المارّة بهذه المحطة</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {stationLines.map(line => (
                    <div
                      key={line.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white"
                      style={{ backgroundColor: line.color }}
                    >
                      <span className="w-2 h-2 rounded-full bg-white/60" />
                      {line.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
