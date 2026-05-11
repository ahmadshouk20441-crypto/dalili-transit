import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, Info } from 'lucide-react'
import { useState } from 'react'

export default function AlertBanner({ alerts }) {
  const [dismissed, setDismissed] = useState([])
  const visible = alerts.filter(a => a.active && !dismissed.includes(a.id))

  return (
    <AnimatePresence>
      {visible.map(alert => (
        <motion.div
          key={alert.id}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className={`overflow-hidden ${
            alert.type === 'warning'
              ? 'bg-amber-500'
              : 'bg-blue-500'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-2 text-white text-sm font-medium">
            {alert.type === 'warning'
              ? <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              : <Info className="w-4 h-4 flex-shrink-0" />
            }
            <span className="flex-1">{alert.title}: {alert.body}</span>
            <button
              onClick={() => setDismissed(d => [...d, alert.id])}
              className="flex-shrink-0 hover:opacity-75 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  )
}
