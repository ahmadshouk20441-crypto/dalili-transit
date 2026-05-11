import { useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import StationOverlay from './StationOverlay'

// SVG canvas dimensions (from viewBox="0 0 2250 1799.999925")
const SVG_W = 2250
const SVG_H = 1800

const MIN_SCALE = 0.25
const MAX_SCALE = 5
const ZOOM_STEP = 0.35

export default function SvgTransitMap({
  stations,
  lines,
  selectedStation,
  highlightedStationId,
  activeLineId,
  onStationClick,
}) {
  const containerRef = useRef(null)
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef(null)

  // Initial fit: scale map to container on mount
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const { width, height } = el.getBoundingClientRect()
    const scaleX = width / SVG_W
    const scaleY = height / SVG_H
    const scale = Math.min(scaleX, scaleY, 0.55)
    setTransform({
      x: (width - SVG_W * scale) / 2,
      y: (height - SVG_H * scale) / 2,
      scale,
    })
  }, [])

  // Pan to selected station
  useEffect(() => {
    if (!selectedStation || !containerRef.current) return
    const { width, height } = containerRef.current.getBoundingClientRect()
    const targetScale = Math.max(transform.scale, 1.2)
    const cx = selectedStation.cx ?? (selectedStation.x + 159)
    const cy = selectedStation.cy ?? (selectedStation.y + 34)
    setTransform({
      scale: targetScale,
      x: width / 2 - cx * targetScale,
      y: height / 2 - cy * targetScale,
    })
  }, [selectedStation]) // eslint-disable-line

  const zoom = useCallback((delta, clientX, clientY) => {
    setTransform(prev => {
      const el = containerRef.current
      const rect = el?.getBoundingClientRect()
      const ox = clientX != null ? clientX - (rect?.left ?? 0) : (rect?.width ?? 0) / 2
      const oy = clientY != null ? clientY - (rect?.top ?? 0) : (rect?.height ?? 0) / 2
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale + delta))
      const ratio = newScale / prev.scale
      return {
        scale: newScale,
        x: ox - (ox - prev.x) * ratio,
        y: oy - (oy - prev.y) * ratio,
      }
    })
  }, [])

  const resetView = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const { width, height } = el.getBoundingClientRect()
    const scale = Math.min(width / SVG_W, height / SVG_H, 0.55)
    setTransform({
      x: (width - SVG_W * scale) / 2,
      y: (height - SVG_H * scale) / 2,
      scale,
    })
  }, [])

  // Mouse wheel zoom
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handler = (e) => {
      e.preventDefault()
      zoom(e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP, e.clientX, e.clientY)
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [zoom])

  // Pointer drag
  const onPointerDown = useCallback((e) => {
    if (e.target.closest('[data-station]')) return
    setIsDragging(true)
    dragStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [transform])

  const onPointerMove = useCallback((e) => {
    if (!isDragging || !dragStart.current) return
    setTransform(prev => ({
      ...prev,
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    }))
  }, [isDragging])

  const onPointerUp = useCallback(() => {
    setIsDragging(false)
    dragStart.current = null
  }, [])

  // Touch pinch zoom
  const lastPinch = useRef(null)
  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      const [a, b] = e.touches
      lastPinch.current = {
        dist: Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY),
        scale: transform.scale,
        mx: (a.clientX + b.clientX) / 2,
        my: (a.clientY + b.clientY) / 2,
      }
    }
  }, [transform.scale])

  const onTouchMove = useCallback((e) => {
    if (e.touches.length === 2 && lastPinch.current) {
      e.preventDefault()
      const [a, b] = e.touches
      const dist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY)
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE,
        lastPinch.current.scale * (dist / lastPinch.current.dist)
      ))
      setTransform(prev => ({ ...prev, scale: newScale }))
    }
  }, [])

  const zoomPercent = Math.round(transform.scale * 100)

  return (
    <div className="relative w-full h-full">
      {/* Map container */}
      <div
        ref={containerRef}
        className={`w-full h-full overflow-hidden rounded-2xl
                    bg-white dark:bg-slate-900
                    border border-slate-200 dark:border-slate-700
                    ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
      >
        {/* Transformed layer */}
        <div
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: '0 0',
            willChange: 'transform',
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
            width: SVG_W,
            height: SVG_H,
            position: 'relative',
          }}
        >
          {/* Raster map background */}
          <img
            src="/dalili-map.svg"
            alt="خريطة نقل حلب"
            width={SVG_W}
            height={SVG_H}
            style={{ display: 'block', pointerEvents: 'none', userSelect: 'none' }}
            draggable={false}
          />

          {/* Interactive station overlay (SVG layer on top) */}
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            width={SVG_W}
            height={SVG_H}
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
          >
            <StationOverlay
              stations={stations}
              lines={lines}
              selectedId={selectedStation?.id}
              highlightedId={highlightedStationId}
              activeLineId={activeLineId}
              onStationClick={onStationClick}
            />
          </svg>
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2">
        {[
          { icon: ZoomIn,    fn: () => zoom(ZOOM_STEP),  label: 'تكبير' },
          { icon: ZoomOut,   fn: () => zoom(-ZOOM_STEP), label: 'تصغير' },
          { icon: Maximize2, fn: resetView,              label: 'إعادة ضبط' },
        ].map(({ icon: Icon, fn, label }) => (
          <motion.button
            key={label}
            whileTap={{ scale: 0.88 }}
            onClick={fn}
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

      {/* Scale badge */}
      <div className="absolute bottom-4 right-4 text-xs font-semibold text-slate-500 dark:text-slate-400
                      bg-white/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg backdrop-blur-sm
                      border border-slate-200/60 dark:border-slate-700/60 select-none">
        {zoomPercent}%
      </div>
    </div>
  )
}
