import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, MapPin, Route } from 'lucide-react'
import { transitLines } from '../../data/lines'

export default function SearchBox({ query, onChange, results, onSelect }) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)
  const showDropdown = focused && (results.length > 0 || query.trim().length > 0)

  const getLineColor = (lineId) => {
    return transitLines.find(l => l.id === lineId)?.color || '#64748b'
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <motion.div
        animate={focused ? { boxShadow: '0 0 0 3px rgba(59,130,246,0.25)' } : { boxShadow: '0 4px 24px -4px rgba(0,0,0,.10)' }}
        className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-2xl px-4 py-3
                   border border-slate-200 dark:border-slate-700 transition-colors duration-200"
      >
        <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0" strokeWidth={2.5} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="ابحث عن محطة أو خط..."
          className="flex-1 bg-transparent outline-none text-base text-slate-900 dark:text-white
                     placeholder-slate-400 dark:placeholder-slate-500 font-medium text-right"
          dir="rtl"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={() => { onChange(''); inputRef.current?.focus() }}
              className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center
                         text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-500
                         transition-colors cursor-pointer flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 rounded-2xl
                       border border-slate-200 dark:border-slate-700 shadow-soft-lg z-50 overflow-hidden"
          >
            {results.length === 0 ? (
              <div className="px-4 py-5 text-center text-slate-400 dark:text-slate-500 text-sm font-medium">
                لا توجد نتائج لـ "{query}"
              </div>
            ) : (
              <ul>
                {results.map((item, i) => (
                  <motion.li
                    key={item.id + i}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <button
                      onMouseDown={() => onSelect(item)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-right
                                 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150
                                 border-b border-slate-100 dark:border-slate-700/50 last:border-0 cursor-pointer"
                    >
                      {item.type === 'station' ? (
                        <>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {item.lineIds.slice(0, 2).map(lid => (
                              <span
                                key={lid}
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: getLineColor(lid) }}
                              />
                            ))}
                          </div>
                          <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-white text-sm">{item.name}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">{item.description}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <span
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <Route className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <p className="font-semibold text-slate-800 dark:text-white text-sm">{item.name}</p>
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
