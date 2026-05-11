import { motion } from 'framer-motion'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'

const BUTTONS = [
  { icon: ZoomIn,    key: 'in',    label: 'تكبير' },
  { icon: ZoomOut,   key: 'out',   label: 'تصغير' },
  { icon: Maximize2, key: 'reset', label: 'إعادة ضبط' },
]

export default function ZoomControls({ onZoomIn, onZoomOut, onReset, percent }) {
  const handlers = { in: onZoomIn, out: onZoomOut, reset: onReset }

  return (
    <>
      <div className="absolute bottom-4 left-4 flex flex-col gap-2">
        {BUTTONS.map(({ icon: Icon, key, label }) => (
          <motion.button
            key={key}
            whileTap={{ scale: 0.88 }}
            onClick={handlers[key]}
            title={label}
            className="w-10 h-10 glass rounded-xl flex items-center justify-center
                       border border-slate-200 dark:border-slate-700 shadow-soft
                       text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700
                       transition-colors duration-150 cursor-pointer"
          >
            <Icon className="w-4 h-4" />
          </motion.button>
        ))}
      </div>

      <div className="absolute bottom-4 right-4 text-xs font-semibold text-slate-500 dark:text-slate-400
                      bg-white/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg backdrop-blur-sm
                      border border-slate-200/60 dark:border-slate-700/60 select-none">
        {percent}%
      </div>
    </>
  )
}
