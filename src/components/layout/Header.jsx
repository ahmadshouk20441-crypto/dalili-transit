import { motion } from 'framer-motion'
import { Moon, Sun, Bus } from 'lucide-react'

export default function Header({ isDark, onToggleDark }) {
  return (
    <motion.header
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      className="glass sticky top-0 z-50
                 border-b border-slate-200/60 dark:border-slate-700/50
                 shadow-[0_1px_12px_rgba(0,0,0,0.06)]"
    >
      <div className="max-w-7xl mx-auto px-4 h-15 flex items-center justify-between"
           style={{ height: 60 }}>

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600
                          flex items-center justify-center shadow-md shadow-blue-500/25">
            <Bus className="w-4.5 h-4.5 text-white" strokeWidth={2.2} />
          </div>
          <div className="leading-none">
            <h1 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              دليلي
            </h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5 tracking-wide uppercase">
              خريطة نقل حلب
            </p>
          </div>
        </div>

        {/* Dark mode toggle */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.06 }}
          onClick={onToggleDark}
          className="relative w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800
                     flex items-center justify-center
                     text-slate-500 dark:text-slate-300
                     hover:bg-slate-200 dark:hover:bg-slate-700
                     transition-colors duration-200 cursor-pointer"
          aria-label="تبديل المظهر"
        >
          <AnimatedIcon isDark={isDark} />
        </motion.button>
      </div>
    </motion.header>
  )
}

function AnimatedIcon({ isDark }) {
  return (
    <motion.div
      key={isDark ? 'sun' : 'moon'}
      initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
      animate={{ rotate: 0, opacity: 1, scale: 1 }}
      exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
      transition={{ duration: 0.22 }}
    >
      {isDark
        ? <Sun className="w-4.5 h-4.5" strokeWidth={2} />
        : <Moon className="w-4.5 h-4.5" strokeWidth={2} />
      }
    </motion.div>
  )
}
