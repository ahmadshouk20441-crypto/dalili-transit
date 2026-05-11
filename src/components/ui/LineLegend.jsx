import { motion } from 'framer-motion'
import { AlertCircle, AlertTriangle } from 'lucide-react'

export default function LineLegend({ lines, activeLineId, onLineClick, alerts }) {
  const activeAlerts = alerts.filter(a => a.active)

  return (
    <div className="space-y-3">
      {/* Alerts */}
      {activeAlerts.length > 0 && (
        <div className="space-y-2">
          {activeAlerts.map(alert => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-2 px-3 py-2.5 rounded-xl text-sm font-medium
                ${alert.type === 'warning'
                  ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                  : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                }`}
            >
              {alert.type === 'warning'
                ? <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              }
              <div>
                <p className="font-bold text-xs">{alert.title}</p>
                <p className="text-xs opacity-80 mt-0.5">{alert.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lines legend */}
      <div className="flex flex-wrap gap-2">
        {lines.map((line, i) => (
          <motion.button
            key={line.id}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onLineClick(line.id === activeLineId ? null : line.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold
                        border-2 transition-all duration-200 cursor-pointer
                        ${activeLineId === line.id
                          ? 'text-white shadow-md scale-105'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-current'
                        }
                        ${line.status === 'partial' ? 'opacity-75' : ''}`}
            style={activeLineId === line.id
              ? { backgroundColor: line.color, borderColor: line.color }
              : { borderColor: 'transparent' }
            }
          >
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: line.color }}
            />
            {line.name}
            {line.status === 'partial' && (
              <span className="text-xs opacity-70">(جزئي)</span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
