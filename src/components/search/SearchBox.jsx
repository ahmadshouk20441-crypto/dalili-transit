import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, MapPin, Route } from 'lucide-react'
import { transitLines as fallbackLines } from '../../data/lines'

export default function SearchBox({ query, onChange, results, onSelect, lines }) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)
  const showDropdown = focused && (results.length > 0 || query.trim().length > 0)
  const allLines = lines ?? fallbackLines

  const getLineColor = (lineId) =>
    allLines.find(l => l.id === lineId)?.color ?? '#64748b'

  return (
    <div className="relative w-full max-w-2xl mx-auto">

      {/* ── Input bar ──────────────────────────────────────────── */}
      <motion.div
        animate={
          focused
            ? { boxShadow: '0 0 0 3px rgba(59,130,246,0.16), 0 4px 20px -4px rgba(0,0,0,0.12)' }
            : { boxShadow: '0 2px 12px -2px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)' }
        }
        transition={{ duration: 0.22 }}
        className={`flex items-center gap-3
                    bg-white/94 dark:bg-slate-900/92 backdrop-blur-xl
                    rounded-2xl px-4 py-3.5
                    border transition-colors duration-200
                    ${focused
                      ? 'border-blue-300/50 dark:border-blue-500/25'
                      : 'border-slate-200/80 dark:border-white/8'}`}
      >
        {/* Search icon — turns blue on focus */}
        <motion.span
          animate={{ color: focused ? '#3b82f6' : '#94a3b8' }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 flex"
        >
          <Search className="w-5 h-5" strokeWidth={2.2} />
        </motion.span>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="ابحث عن محطة أو خط..."
          className="flex-1 bg-transparent outline-none
                     text-[15px] leading-none font-semibold
                     text-slate-900 dark:text-white
                     placeholder-slate-400/60 dark:placeholder-slate-600
                     text-right"
          dir="rtl"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />

        {/* Clear button */}
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.14 }}
              onClick={() => { onChange(''); inputRef.current?.focus() }}
              className="w-7 h-7 rounded-full flex-shrink-0
                         bg-slate-100 dark:bg-slate-800
                         hover:bg-slate-200 dark:hover:bg-slate-700
                         flex items-center justify-center
                         text-slate-400 dark:text-slate-500
                         transition-colors cursor-pointer"
              aria-label="مسح البحث"
            >
              <X className="w-3.5 h-3.5" strokeWidth={2.5} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Dropdown ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.94 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.94 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'top center' }}
            className="absolute top-full mt-2 w-full z-50 overflow-hidden
                       bg-white/96 dark:bg-slate-900/96 backdrop-blur-2xl
                       rounded-2xl
                       border border-slate-200/70 dark:border-white/7
                       shadow-[0_16px_48px_-8px_rgba(0,0,0,0.18),0_4px_16px_-4px_rgba(0,0,0,0.10)]"
          >
            {results.length === 0 ? (
              <div className="px-5 py-6 text-center">
                <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
                  لا توجد نتائج لـ «{query}»
                </p>
              </div>
            ) : (
              <ul className="py-1.5">
                {results.map((item, i) => (
                  <motion.li
                    key={item.id + i}
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.14, delay: i * 0.03 }}
                  >
                    <button
                      onMouseDown={() => onSelect(item)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-right
                                 min-h-[52px]
                                 hover:bg-slate-50 dark:hover:bg-white/5
                                 active:bg-slate-100 dark:active:bg-white/8
                                 transition-colors duration-100 cursor-pointer
                                 border-b border-slate-100/80 dark:border-white/5 last:border-0"
                    >
                      {item.type === 'station' ? (
                        <>
                          {/* Line color dots — physical right in RTL (start side) */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {item.lineIds.slice(0, 3).map(lid => (
                              <span
                                key={lid}
                                className="w-3 h-3 rounded-full ring-[1.5px] ring-white dark:ring-slate-900 shadow-sm"
                                style={{ backgroundColor: getLineColor(lid) }}
                              />
                            ))}
                          </div>
                          {/* Station name + description */}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[14px] text-slate-900 dark:text-white leading-tight">
                              {item.name}
                            </p>
                            {item.description && (
                              <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <MapPin
                            className="w-4 h-4 flex-shrink-0 text-slate-300 dark:text-slate-700"
                            strokeWidth={1.5}
                          />
                        </>
                      ) : (
                        <>
                          {/* Line color swatch */}
                          <span
                            className="w-4 h-4 rounded-full flex-shrink-0 ring-[1.5px] ring-white dark:ring-slate-900 shadow-sm"
                            style={{ backgroundColor: item.color }}
                          />
                          {/* Line name */}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[14px] text-slate-900 dark:text-white leading-tight">
                              {item.name}
                            </p>
                            {item.description && (
                              <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <Route
                            className="w-4 h-4 flex-shrink-0 text-slate-300 dark:text-slate-700"
                            strokeWidth={1.5}
                          />
                        </>
                      )}
                    </button>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
