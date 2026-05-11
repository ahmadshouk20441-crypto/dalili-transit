import { useRef, useState, useCallback, useEffect } from 'react'
import MapLines from './MapLines'
import MapStations from './MapStations'
import MapBackground from './MapBackground'
import ZoomControls from './ZoomControls'

const MIN_SCALE = 0.6
const MAX_SCALE = 4
const STEP = 0.3

export default function TransitMap({
  stations,
  lines,
  selectedStation,
  highlightedStationId,
  activeLineId,
  onStationClick,
}) {
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef(null)

  // Center map on mount
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const { width, height } = container.getBoundingClientRect()
    setTransform({ x: width / 2 - 230, y: height / 2 - 250, scale: 1 })
  }, [])

  // Center on selected station
  useEffect(() => {
    if (!selectedStation || !containerRef.current) return
    const container = containerRef.current
    const { width, height } = container.getBoundingClientRect()
    const scale = 1.8
    setTransform({
      x: width / 2 - selectedStation.x * scale,
      y: height / 2 - selectedStation.y * scale,
      scale,
    })
  }, [selectedStation])

  const clampTransform = useCallback((t) => {
    return {
      ...t,
      scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, t.scale)),
    }
  }, [])

  const zoom = useCallback((delta) => {
    setTransform(prev => {
      const container = containerRef.current
      if (!container) return prev
      const { width, height } = container.getBoundingClientRect()
      const cx = width / 2
      const cy = height / 2
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale + delta))
      const ratio = newScale / prev.scale
      return clampTransform({
        scale: newScale,
        x: cx - (cx - prev.x) * ratio,
        y: cy - (cy - prev.y) * ratio,
      })
    })
  }, [clampTransform])

  const resetView = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const { width, height } = container.getBoundingClientRect()
    setTransform({ x: width / 2 - 230, y: height / 2 - 250, scale: 1 })
  }, [])

  // Mouse wheel zoom
  const onWheel = useCallback((e) => {
    e.preventDefault()
    zoom(e.deltaY < 0 ? STEP : -STEP)
  }, [zoom])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [onWheel])

  // Drag
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
  const lastTouches = useRef(null)
  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      const [a, b] = e.touches
      lastTouches.current = {
        dist: Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY),
        scale: transform.scale,
      }
    }
  }, [transform.scale])

  const onTouchMove = useCallback((e) => {
    if (e.touches.length === 2 && lastTouches.current) {
      e.preventDefault()
      const [a, b] = e.touches
      const dist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY)
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, lastTouches.current.scale * (dist / lastTouches.current.dist)))
      setTransform(prev => ({ ...prev, scale: newScale }))
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      {/* Map container */}
      <div
        ref={containerRef}
        className={`w-full h-full overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-900
                    border border-slate-200 dark:border-slate-700
                    ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: '0 0',
            willChange: 'transform',
            transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
        >
          <MapBackground />
          <MapLines
            lines={lines}
            stations={stations}
            activeLineId={activeLineId}
          />
          <MapStations
            stations={stations}
            lines={lines}
            selectedId={selectedStation?.id}
            highlightedId={highlightedStationId}
            activeLineId={activeLineId}
            onStationClick={onStationClick}
          />
        </svg>
      </div>

      <ZoomControls
        onZoomIn={() => zoom(STEP)}
        onZoomOut={() => zoom(-STEP)}
        onReset={resetView}
        percent={Math.round(transform.scale * 100)}
      />
    </div>
  )
}
