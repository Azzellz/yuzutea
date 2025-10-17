import { useAtom } from 'jotai'
import { useEffect, useMemo, useRef, useState } from 'react'
import { musicPlayerAtom } from '@/atoms/music'

export default function MusicProgressBar({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  const [player] = useAtom(musicPlayerAtom)
  const barRef = useRef<HTMLDivElement>(null)
  const [durationMs, setDurationMs] = useState(0)
  const [currentMs, setCurrentMs] = useState(0)
  const [dragging, setDragging] = useState(false)
  const wasPlayingRef = useRef(false)

  const format = useMemo(
    () => (ms: number) => {
      ms = Math.max(0, Math.floor(ms))
      const s = Math.floor(ms / 1000)
      const mm = String(Math.floor(s / 60)).padStart(2, '0')
      const ss = String(s % 60).padStart(2, '0')
      return `${mm}:${ss}`
    },
    []
  )

  // Sync from audio element
  useEffect(() => {
    const audio = player?.audio
    if (!audio) return

    const syncDuration = () => {
      const d = isFinite(audio.duration) ? audio.duration * 1000 : 0
      setDurationMs(d)
    }
    const syncTime = () => {
      if (!dragging) setCurrentMs(audio.currentTime * 1000)
    }

    syncDuration()
    syncTime()

    audio.addEventListener('loadedmetadata', syncDuration)
    audio.addEventListener('durationchange', syncDuration)
    audio.addEventListener('timeupdate', syncTime)

    return () => {
      audio.removeEventListener('loadedmetadata', syncDuration)
      audio.removeEventListener('durationchange', syncDuration)
      audio.removeEventListener('timeupdate', syncTime)
    }
  }, [player, dragging])

  const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

  const seekToRatio = (ratio: number) => {
    const audio = player?.audio
    if (!audio || durationMs <= 0) return
    const r = clamp01(ratio)
    const nextMs = r * durationMs
    setCurrentMs(nextMs)
    audio.currentTime = nextMs / 1000
  }

  const getRatioFromClientX = (clientX: number) => {
    const el = barRef.current
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    return clamp01((clientX - rect.left) / rect.width)
  }

  const onPointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!player?.audio || durationMs <= 0) return
    setDragging(true)
    wasPlayingRef.current = !player.audio.paused
    const ratio = getRatioFromClientX(e.clientX)
    seekToRatio(ratio)

    const onMove = (ev: MouseEvent) => {
      const r = getRatioFromClientX(ev.clientX)
      setCurrentMs(r * durationMs)
    }
    const onUp = (ev: MouseEvent) => {
      const r = getRatioFromClientX(ev.clientX)
      seekToRatio(r)
      setDragging(false)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      // Optionally resume playback if it was playing
      if (wasPlayingRef.current) {
        player.audio.play().catch(() => {})
      }
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!player?.audio || durationMs <= 0) return
    setDragging(true)
    wasPlayingRef.current = !player.audio.paused
    const touch = e.touches[0]
    const ratio = getRatioFromClientX(touch.clientX)
    seekToRatio(ratio)

    const onMove = (ev: TouchEvent) => {
      const t = ev.touches[0]
      if (!t) return
      const r = getRatioFromClientX(t.clientX)
      setCurrentMs(r * durationMs)
    }
    const onEnd = (ev: TouchEvent) => {
      const t = ev.changedTouches[0]
      const r = getRatioFromClientX(t.clientX)
      seekToRatio(r)
      setDragging(false)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onEnd)
      if (wasPlayingRef.current) {
        player.audio.play().catch(() => {})
      }
    }
    document.addEventListener('touchmove', onMove)
    document.addEventListener('touchend', onEnd)
  }

  const progress = durationMs > 0 ? clamp01(currentMs / durationMs) : 0

  const disabled = !player?.audio || durationMs <= 0

  return (
    <div
      className={className}
      style={{
        ...style,
        pointerEvents: 'auto',
        userSelect: 'none',
      }}
    >
      <div
        ref={barRef}
        onMouseDown={onPointerDown}
        onTouchStart={onTouchStart}
        style={{
          background: 'rgba(255,255,255,0.12)',
          height: '10px',
          borderRadius: '6px',
          position: 'relative',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${progress * 100}%`,
            background: 'linear-gradient(90deg, #ffd54f, #ff8a65)',
            borderRadius: '6px',
            transition: dragging ? 'none' : 'width 120ms linear',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: `calc(${progress * 100}% - 7px)`,
            top: '-4px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: disabled ? '#bbb' : '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
            transition: dragging
              ? 'none'
              : 'left 120ms linear, background 150ms',
          }}
        />
      </div>
      <div
        style={{
          marginTop: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          color: '#fff',
          fontSize: '12px',
          opacity: 0.9,
        }}
      >
        <span>{format(currentMs)}</span>
        <span>{format(durationMs)}</span>
      </div>
    </div>
  )
}
