import { useRef, useState, useCallback, useEffect, useLayoutEffect } from 'react'
import StationOverlay from './StationOverlay'
import ZoomControls from './ZoomControls'
import MapSkeleton from './MapSkeleton'

const SVG_W = 2250
const SVG_H = 1800
const MIN_SCALE = 0.22
const MAX_SCALE = 5
const ZOOM_STEP = 0.32

export default function SvgTransitMap({
  stations,
  lines,
  selectedStation,
  highlightedStationId,
  activeLineId,
  onStationClick,
  isDark,
}) {
  const containerRef = useRef(null)
  const imgRef = useRef(null)
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.3 })
  const [isDragging, setIsDragging] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const dragStart = useRef(null)
  const userInteracted = useRef(false)

  const fitToContainer = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const { width, height } = el.getBoundingClientRect()
    if (!width || !height) return
    const scale = Math.min(width / SVG_W, height / SVG_H) * 0.97
    setTransform({
      x: (width - SVG_W * scale) / 2,
      y: (height - SVG_H * scale) / 2,
      scale,
    })
  }, [])

  // Fit synchronously after first DOM paint so map is correctly positioned immediately
  useLayoutEffect(() => {
    fitToContainer()
  }, [fitToContainer])

  // Re-fit on container resize (unless user has panned/zoomed)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      if (!userInteracted.current) fitToContainer()
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [fitToContainer])

  // Handle image load: mark loaded (also handles cached images)
  useEffect(() => {
    const img = imgRef.current
    if (!img) return
    if (img.complete && img.naturalWidth > 0) {
      setMapLoaded(true)
      return
    }
    const onLoad = () => setMapLoaded(true)
    const onError = () => setMapLoaded(true) // show map even on error
    img.addEventListener('load', onLoad)
    img.addEventListener('error', onError)
    return () => {
      img.removeEventListener('load', onLoad)
      img.removeEventListener('error', onError)
    }
  }, [])

  // Smooth pan to selected station
  useEffect(() => {
    if (!selectedStation || !containerRef.current) return
    const { width, height } = containerRef.current.getBoundingClientRect()
    const targetScale = Math.max(transform.scale, 1.4)
    const cx = selectedStation.cx ?? (selectedStation.x + 30)
    const cy = selectedStation.cy ?? (selectedStation.y + 30)
    userInteracted.current = true
    setTransform({
      scale: targetScale,
      x: width / 2 - cx * targetScale,
      y: height / 2 - cy * targetScale,
    })
  }, [selectedStation]) // eslint-disable-line

  const zoom = useCallback((delta, clientX, clientY) => {
    userInteracted.current = true
    setTransform(prev => {
      const el = containerRef.current
      const rect = el?.getBoundingClientRect()
      const ox = clientX != null ? clientX - (rect?.left ?? 0) : (rect?.width ?? 0) / 2
      const oy = clientY != null ? clientY - (rect?.top ?? 0) : (rect?.height ?? 0) / 2
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale + delta))
      const ratio = newScale / prev.scale
      return { scale: newScale, x: ox - (ox - prev.x) * ratio, y: oy - (oy - prev.y) * ratio }
    })
  }, [])

  const resetView = useCallback(() => {
    userInteracted.current = false
    fitToContainer()
  }, [fitToContainer])

  // Wheel zoom
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
    userInteracted.current = true
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

  // Touch pinch
  const lastPinch = useRef(null)
  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      userInteracted.current = true
      const [a, b] = e.touches
      lastPinch.current = {
        dist: Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY),
        scale: transform.scale,
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

  // Dark mode: invert + hue-rotate preserves line colors, turns white→dark
  const mapFilter = isDark
    ? 'invert(1) hue-rotate(180deg) brightness(0.88) saturate(1.15)'
    : 'none'

  return (
    <div className="relative w-full h-full" style={{ minHeight: 400 }}>
      <div
        ref={containerRef}
        className={`w-full h-full overflow-hidden rounded-2xl
                    bg-slate-100 dark:bg-slate-900
                    border border-slate-200/80 dark:border-slate-700/80
                    shadow-soft
                    ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ minHeight: 400 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
      >
        {/* Map layer — always visible, never gated by opacity:0 */}
        <div
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: '0 0',
            willChange: 'transform',
            transition: isDragging ? 'none' : 'transform 0.28s cubic-bezier(0.22,1,0.36,1)',
            width: SVG_W,
            height: SVG_H,
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          {/* The real Aleppo transit map */}
          <img
            ref={imgRef}
            src="/dalili-map.svg"
            alt="خريطة نقل حلب"
            width={SVG_W}
            height={SVG_H}
            style={{
              display: 'block',
              width: SVG_W,
              height: SVG_H,
              pointerEvents: 'none',
              userSelect: 'none',
              filter: mapFilter,
              transition: 'filter 0.4s ease',
            }}
            draggable={false}
          />

          {/* Station hit-targets overlay */}
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            width={SVG_W}
            height={SVG_H}
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
          >
            <StationOverlay
              stations={stations}
              lines={lines}
              selectedId={selectedStation?.id}
              highlightedId={highlightedStationId}
              activeLineId={activeLineId}
              onStationClick={onStationClick}
              isDark={isDark}
            />
          </svg>
        </div>

        {/* Skeleton overlay — shown while image loads, fades out when ready */}
        {!mapLoaded && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
            <MapSkeleton />
          </div>
        )}
      </div>

      <ZoomControls
        onZoomIn={() => zoom(ZOOM_STEP)}
        onZoomOut={() => zoom(-ZOOM_STEP)}
        onReset={resetView}
        percent={zoomPercent}
      />
    </div>
  )
}
