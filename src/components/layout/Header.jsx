import { motion } from 'framer-motion'
import { Moon, Sun, Bus } from 'lucide-react'

export default function Header({ isDark, onToggleDark }) {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="glass border-b border-slate-200/60 dark:border-slate-700/60 sticky top-0 z-50 shadow-soft"
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-md">
            <Bus className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div className="leading-tight">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">دليلي</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">خريطة نقل حلب</p>
          </div>
        </div>

        {/* Dark mode toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={onToggleDark}
          className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center
                     text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700
                     transition-colors duration-200 cursor-pointer"
          aria-label="تبديل المظهر"
        >
          {isDark
            ? <Sun className="w-5 h-5" strokeWidth={2} />
            : <Moon className="w-5 h-5" strokeWidth={2} />
          }
        </motion.button>
      </div>
    </motion.header>
  )
}
