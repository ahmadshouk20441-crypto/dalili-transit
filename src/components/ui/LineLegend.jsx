import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, AlertTriangle, X, ChevronRight, ChevronLeft } from 'lucide-react'

export default function LineLegend({ lines, activeLineId, onLineClick, alerts }) {
  const scrollRef = useRef(null)
  const activeAlerts = alerts.filter(a => a.active)

  const scroll = (dir) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' })
  }

  return (
    <div className="space-y-2">
      {/* Alerts */}
      <AnimatePresence>
        {activeAlerts.map(alert => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl text-sm
              ${alert.type === 'warning'
                ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-700/50'
                : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-700/50'
              }`}
          >
            {alert.type === 'warning'
              ? <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            }
            <span className="flex-1 font-medium text-xs leading-relaxed">
              <strong className="font-bold">{alert.title}:</strong> {alert.body}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Line filter strip */}
      <div className="relative flex items-center gap-1">
        {/* Scroll left arrow */}
        <button
          onClick={() => scroll(-1)}
          className="flex-shrink-0 w-7 h-7 rounded-lg bg-white dark:bg-slate-800
                     border border-slate-200 dark:border-slate-700
                     flex items-center justify-center text-slate-400 hover:text-slate-600
                     dark:hover:text-slate-200 transition-colors cursor-pointer hidden sm:flex"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Scrollable line buttons */}
        <div
          ref={scrollRef}
          className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Clear filter button */}
          <AnimatePresence>
            {activeLineId && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, width: 0 }}
                animate={{ opacity: 1, scale: 1, width: 'auto' }}
                exit={{ opacity: 0, scale: 0.8, width: 0 }}
                onClick={() => onLineClick(null)}
                className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full
                           bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300
                           text-xs font-semibold border border-slate-200 dark:border-slate-600
                           hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
                مسح
              </motion.button>
            )}
          </AnimatePresence>

          {lines.map((line, i) => {
            const isActive = activeLineId === line.id
            return (
              <motion.button
                key={line.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => onLineClick(isActive ? null : line.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full
                            text-xs font-bold border-2 transition-all duration-200 cursor-pointer
                            ${isActive
                              ? 'text-white shadow-md'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent hover:border-current'
                            }
                            ${line.status === 'partial' ? 'opacity-70' : ''}`}
                style={isActive
                  ? { backgroundColor: line.color, borderColor: line.color }
                  : { borderColor: 'transparent' }
                }
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-2 ring-white/30"
                  style={{ backgroundColor: line.color }}
                />
                {line.name}
                {line.status === 'partial' && <span className="opacity-60 font-normal">•جزئي</span>}
              </motion.button>
            )
          })}
        </div>

        {/* Scroll right arrow */}
        <button
          onClick={() => scroll(1)}
          className="flex-shrink-0 w-7 h-7 rounded-lg bg-white dark:bg-slate-800
                     border border-slate-200 dark:border-slate-700
                     flex items-center justify-center text-slate-400 hover:text-slate-600
                     dark:hover:text-slate-200 transition-colors cursor-pointer hidden sm:flex"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
