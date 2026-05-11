export default function MapSkeleton() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4
                    bg-slate-100 dark:bg-slate-900 rounded-2xl z-10">
      {/* Animated map grid */}
      <div className="relative w-48 h-36 opacity-30 dark:opacity-20">
        {/* Horizontal lines */}
        {[20, 50, 80, 110].map(y => (
          <div
            key={y}
            className="absolute left-0 right-0 h-0.5 rounded-full bg-slate-400 dark:bg-slate-500"
            style={{ top: y, animationDelay: `${y * 5}ms` }}
          />
        ))}
        {/* Vertical lines */}
        {[40, 80, 120, 160].map(x => (
          <div
            key={x}
            className="absolute top-0 bottom-0 w-0.5 rounded-full bg-slate-400 dark:bg-slate-500"
            style={{ left: x }}
          />
        ))}
        {/* Colored line dots */}
        {[
          { x: 40, y: 20, color: '#e7191f' },
          { x: 80, y: 50, color: '#45a3e4' },
          { x: 120, y: 80, color: '#45e45e' },
          { x: 160, y: 110, color: '#e4c145' },
          { x: 40, y: 80, color: '#db2777' },
        ].map(({ x, y, color }, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full -translate-x-1.5 -translate-y-1.5"
            style={{ left: x, top: y, backgroundColor: color }}
          />
        ))}
      </div>

      {/* Pulse text */}
      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
        <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
        <span className="text-sm font-medium">جاري تحميل الخريطة…</span>
      </div>
    </div>
  )
}
