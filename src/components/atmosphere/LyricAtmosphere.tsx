import { musicPlayerAtom } from '@/atoms/music'
import { useAtom } from 'jotai'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function LyricAtmosphere() {
  const [musicPlayer] = useAtom(musicPlayerAtom)
  const [currentTime, setCurrentTime] = useState(0)
  // 每句歌词首次出现后固定位置：使用 ref 保存映射，避免随渲染变化而改变
  const posMapRef = useRef<Map<number, { x: number; y: number; slot: number }>>(
    new Map()
  )
  // 容器尺寸测量，用于将坐标限制在容器范围内
  const containerRef = useRef<HTMLDivElement>(null)
  const [bounds, setBounds] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  })
  // 文本测量：用离屏 canvas 估算宽度，确保避免相交
  const measureText = useMemo(() => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    return (
      text: string,
      fontSize = 24,
      fontFamily = 'system-ui'
    ): { w: number; h: number } => {
      if (!ctx)
        return {
          w: Math.max(1, text.length) * fontSize * 0.6,
          h: fontSize * 1.2,
        }
      ctx.font = `${fontSize}px ${fontFamily}`
      const metrics = ctx.measureText(text)
      const w = metrics.width
      const h = fontSize * 1.2
      return { w, h }
    }
  }, [])

  // 渐变与染色参数
  const FADE_OUT_MS = 100
  const BASE_COLOR = '#ffffff'
  const HIGHLIGHT_COLOR = '#ffd54f'
  const DEFAULT_LINE_MS = 4000
  // 分词函数：中文按字、英文按单词、标点单独成词
  const tokenize = (text: string) => {
    const m = text.match(/[\u4e00-\u9fff]|[A-Za-z0-9]+(?:'[A-Za-z0-9]+)?|[^\s\w]/g)
    return m ?? []
  }
  // 颜色插值：线性混合
  const mixColor = (a: string, b: string, t: number) => {
    const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
    const parse = (hex: string) => {
      const h = hex.replace('#', '')
      const r = parseInt(h.slice(0, 2), 16)
      const g = parseInt(h.slice(2, 4), 16)
      const b = parseInt(h.slice(4, 6), 16)
      return [r, g, b]
    }
    const [r1, g1, b1] = parse(a)
    const [r2, g2, b2] = parse(b)
    const k = clamp01(t)
    const r = Math.round(r1 + (r2 - r1) * k)
    const g = Math.round(g1 + (g2 - g1) * k)
    const _b = Math.round(b1 + (b2 - b1) * k)
    return `rgb(${r}, ${g}, ${_b})`
  }
  // 行结束时间：下一行开始或兜底
  const getLineEndTime = (t: number) => {
    const lyrics = musicPlayer?.lyrics ?? []
    const idx = lyrics.findIndex((l) => l.time === t)
    if (idx === -1 || idx === lyrics.length - 1) return t + DEFAULT_LINE_MS
    return lyrics[idx + 1].time
  }

  // 可见项跟踪与渐隐队列
  const prevVisibleRef = useRef<number[]>([])
  const exitMapRef = useRef<Map<number, number>>(new Map()) // time -> exitStart(ms)

  useEffect(() => {
    if (musicPlayer?.audio) {
      musicPlayer.audio.addEventListener('timeupdate', () => {
        setCurrentTime(Math.round(musicPlayer.audio.currentTime * 1000))
      })
    }
  }, [musicPlayer])

  // 测量容器尺寸并随窗口变化更新
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => {
      const rect = el.getBoundingClientRect()
      setBounds({ width: rect.width, height: rect.height })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // 当歌词列表更换（切歌）时，清空位置与渐隐映射，确保新歌曲重新布局
  useEffect(() => {
    posMapRef.current.clear()
    exitMapRef.current.clear()
    prevVisibleRef.current = []
  }, [musicPlayer?.lyrics])

  // 仅显示时间不超过当前时间的最新 3 条（含历史行，以便并行显示）
  const visibleLyrics = useMemo(() => {
    const all = musicPlayer?.lyrics ?? []
    const active = all.filter((l) => currentTime >= l.time)
    return active.slice(-3)
  }, [musicPlayer?.lyrics, currentTime])

  // 跟踪从可见集中移除的项，触发渐隐，并清理已完成的渐隐项
  useEffect(() => {
    const prev = prevVisibleRef.current
    const curr = visibleLyrics.map((l) => l.time)
    const removed = prev.filter((t) => !curr.includes(t))
    for (const t of removed) {
      if (!exitMapRef.current.has(t)) {
        exitMapRef.current.set(t, currentTime)
      }
    }
    // 清理过期的渐隐项
    for (const [t, start] of exitMapRef.current) {
      if (currentTime - start >= FADE_OUT_MS) {
        exitMapRef.current.delete(t)
      }
    }
    prevVisibleRef.current = curr
  }, [visibleLyrics, currentTime])

  // 用于渲染的集合：可见项 + 渐隐中的项
  const displayLyrics = useMemo(() => {
    const result = [...visibleLyrics]
    const visibleSet = new Set(visibleLyrics.map((l) => l.time))
    for (const [t, start] of exitMapRef.current) {
      if (currentTime - start < FADE_OUT_MS) {
        const l = musicPlayer?.lyrics.find((x) => x.time === t)
        if (l && !visibleSet.has(t)) {
          result.push(l)
        }
      }
    }
    return result
  }, [visibleLyrics, currentTime, musicPlayer?.lyrics])

  // 生成不重叠坐标，并在句子首次出现后固定其位置；坐标被限制在容器范围内
  useMemo(() => {
    const W = bounds.width || 500
    const H = bounds.height || 500
    const Mx = 20 // 横向安全边距
    const My = 20 // 纵向安全边距

    // 工具函数
    const clamp = (v: number, min: number, max: number) =>
      Math.max(min, Math.min(max, v))
    const jitter = (min: number, max: number) =>
      Math.random() * (max - min) + min
    const intersect = (
      a: { x: number; y: number; w: number; h: number },
      b: { x: number; y: number; w: number; h: number }
    ) =>
      !(
        a.x > b.x + b.w ||
        a.x + a.w < b.x ||
        a.y > b.y + b.h ||
        a.y + a.h < b.y
      )

    // 已在屏幕上的矩形（包括可见与渐隐中的项），用于新歌词防碰撞
    const activeTimes: number[] = []
    const activeExitTimes: number[] = []
    for (const [t, start] of exitMapRef.current) {
      if (currentTime - start < FADE_OUT_MS) activeExitTimes.push(t)
    }
    activeTimes.push(...visibleLyrics.map((l) => l.time), ...activeExitTimes)

    const existingRects: { x: number; y: number; w: number; h: number }[] = []
    const usedSlotIndices = new Set<number>()
    for (const t of activeTimes) {
      const p = posMapRef.current.get(t)
      const l = musicPlayer?.lyrics.find((x) => x.time === t)
      if (p && l) {
        const { w, h } = measureText(l.text)
        existingRects.push({ x: p.x, y: p.y, w, h })
        if (typeof p.slot === 'number') usedSlotIndices.add(p.slot)
      }
    }

    // 预设槽位（基于容器尺寸的网格中心）
    const slots = [
      { x: W * 0.2, y: H * 0.2 },
      { x: W * 0.8, y: H * 0.2 },
      { x: W * 0.2, y: H * 0.5 },
      { x: W * 0.8, y: H * 0.5 },
      { x: W * 0.5, y: H * 0.8 },
      { x: W * 0.5, y: H * 0.2 },
      { x: W * 0.3, y: H * 0.8 },
      { x: W * 0.7, y: H * 0.8 },
      { x: W * 0.5, y: H * 0.5 },
    ]

    // 为“首次出现”的句子分配空闲槽位，保证不与 existingRects 相交
    for (const l of visibleLyrics) {
      if (!posMapRef.current.has(l.time)) {
        const { w, h } = measureText(l.text)

        // 优先尝试空闲槽位
        let chosenSlotIndex = -1
        for (let i = 0; i < slots.length; i++) {
          if (usedSlotIndices.has(i)) continue
          const centerX = slots[i].x + jitter(-10, 10)
          const centerY = slots[i].y + jitter(-8, 8)
          const x = clamp(Math.round(centerX - w / 2), Mx, W - Mx - w)
          const y = clamp(Math.round(centerY - h / 2), My, H - My - h)
          const candidate = { x, y, w, h }
          if (!existingRects.some((r) => intersect(candidate, r))) {
            chosenSlotIndex = i
            posMapRef.current.set(l.time, { x, y, slot: i })
            existingRects.push(candidate)
            usedSlotIndices.add(i)
            break
          }
        }

        // 如果所有槽位都冲突，进行有限次随机尝试
        if (!posMapRef.current.has(l.time)) {
          const tries = 40
          for (let t = 0; t < tries; t++) {
            const x = clamp(
              Math.round(Mx + Math.random() * (W - 2 * Mx - w)),
              Mx,
              W - Mx - w
            )
            const y = clamp(
              Math.round(My + Math.random() * (H - 2 * My - h)),
              My,
              H - My - h
            )
            const candidate = { x, y, w, h }
            if (!existingRects.some((r) => intersect(candidate, r))) {
              const i =
                chosenSlotIndex !== -1
                  ? chosenSlotIndex
                  : Math.floor(Math.random() * slots.length)
              posMapRef.current.set(l.time, { x, y, slot: i })
              existingRects.push(candidate)
              usedSlotIndices.add(i)
              break
            }
          }
        }

        // 最后兜底：若仍未找到，则将其放在容器中心下方依次偏移
        if (!posMapRef.current.has(l.time)) {
          const baseX = clamp(Math.round(W * 0.5 - w / 2), Mx, W - Mx - w)
          let y = clamp(Math.round(H * 0.6 - h / 2), My, H - My - h)
          let candidate = { x: baseX, y, w, h }
          let step = 0
          while (
            existingRects.some((r) => intersect(candidate, r)) &&
            step < 20
          ) {
            y = clamp(y + h + 8, My, H - My - h)
            candidate = { x: baseX, y, w, h }
            step++
          }
          const i =
            chosenSlotIndex !== -1
              ? chosenSlotIndex
              : Math.floor(Math.random() * slots.length)
          posMapRef.current.set(l.time, {
            x: candidate.x,
            y: candidate.y,
            slot: i,
          })
          existingRects.push(candidate)
          usedSlotIndices.add(i)
        }
      }
    }
  }, [visibleLyrics, bounds, measureText, currentTime, musicPlayer?.lyrics])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        color: 'white',
        fontSize: '28px',
        pointerEvents: 'none',
      }}
    >
      {displayLyrics.map((item) => {
        const pos = posMapRef.current.get(item.time)
        const isVisible = visibleLyrics.some((l) => l.time === item.time)
        const tokens = tokenize(item.text)
        const lyrics = musicPlayer?.lyrics ?? []
        const i = lyrics.findIndex((x) => x.time === item.time)
        const endTime = i !== -1 && i < lyrics.length - 1 ? lyrics[i + 1].time : item.time + DEFAULT_LINE_MS
        const duration = Math.max(800, endTime - item.time)
        const progress = Math.max(0, Math.min(1, (currentTime - item.time) / duration))
        const exitStart = exitMapRef.current.get(item.time) ?? currentTime
        const lineOpacity = isVisible ? 1 : Math.max(0, Math.min(1, 1 - (currentTime - exitStart) / FADE_OUT_MS))
        return (
          <div
            key={item.time}
            style={{
              position: 'absolute',
              transform: `translate(${pos?.x || 0}px, ${pos?.y || 0}px)`,
              whiteSpace: 'nowrap',
              textShadow: '0 0 6px rgba(0,0,0,0.4)',
              willChange: 'opacity, transform, color',
              opacity: lineOpacity,
            }}
          >
            {tokens.map((tk, idx) => {
              const parts = Math.max(1, tokens.length)
              const local = Math.max(0, Math.min(1, progress * parts - idx))
              const color = mixColor(BASE_COLOR, HIGHLIGHT_COLOR, local)
              const isPunct = /[^\w\u4e00-\u9fff]/.test(tk)
              return (
                <span
                  key={idx}
                  style={{
                    color,
                    transition: 'color 200ms linear',
                    marginRight: isPunct ? '0.15em' : '0.35em',
                  }}
                >
                  {tk}
                </span>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
