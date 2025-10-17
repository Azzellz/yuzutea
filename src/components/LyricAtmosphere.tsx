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
  useEffect(() => {
    if (musicPlayer?.audio) {
      musicPlayer.audio.addEventListener('timeupdate', () => {
        setCurrentTime(Math.round(musicPlayer.audio.currentTime * 1000))
      })
    }
  }, [musicPlayer])

  // 当歌词列表更换（切歌）时，清空位置映射，确保新歌曲重新布局
  useEffect(() => {
    posMapRef.current.clear()
  }, [musicPlayer?.lyrics])

  // 计算当前应显示的歌词：仅显示时间不超过当前时间的最新 5 条
  const visibleLyrics = useMemo(() => {
    const all = musicPlayer?.lyrics ?? []
    const active = all.filter((l) => currentTime >= l.time)
    return active.slice(-3)
  }, [musicPlayer?.lyrics, currentTime])

  // 生成不重叠坐标，并在句子首次出现后固定其位置
  const positions = useMemo(() => {
    const k = visibleLyrics.length
    if (k === 0) return [] as { x: number; y: number }[]

    // 预设槽位（数量 ≥ 同屏最多显示数量），以避免重叠
    const slots = [
      { x: -140, y: -80 },
      { x: 140, y: -80 },
      { x: -140, y: 80 },
      { x: 140, y: 80 },
      { x: 0, y: 0 },
      { x: 0, y: 120 },
      { x: 0, y: -120 },
    ]

    // 当前可见歌词已占用的槽位（按已固定位置统计）
    const usedSlotIndices = new Set<number>()
    for (const l of visibleLyrics) {
      const p = posMapRef.current.get(l.time)
      if (p) usedSlotIndices.add(p.slot)
    }

    const jitter = (min: number, max: number) =>
      Math.random() * (max - min) + min

    // 按照当前可见顺序为“首次出现”的句子分配空闲槽位
    for (const l of visibleLyrics) {
      if (!posMapRef.current.has(l.time)) {
        // 找到一个未占用的槽位
        let slotIndex = -1
        for (let i = 0; i < slots.length; i++) {
          if (!usedSlotIndices.has(i)) {
            slotIndex = i
            break
          }
        }
        // 如果极端情况没有空槽（理论上不会发生，因为最多显示 5），则回退到随机槽
        if (slotIndex === -1) {
          slotIndex = Math.floor(Math.random() * slots.length)
        }
        usedSlotIndices.add(slotIndex)

        const base = slots[slotIndex]
        posMapRef.current.set(l.time, {
          x: Math.round(base.x + jitter(-20, 200)),
          y: Math.round(base.y + jitter(-16, 106)),
          slot: slotIndex,
        })
      }
    }

    // 返回当前可见歌词对应的固定位置
    return visibleLyrics.map((l) => {
      const p = posMapRef.current.get(l.time)
      return { x: p?.x ?? 0, y: p?.y ?? 0 }
    })
  }, [visibleLyrics])

  return (
    <div
      style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        color: 'white',
        fontSize: '24px',
        pointerEvents: 'none',
      }}
    >
      {visibleLyrics.map((item, index) => (
        <div
          key={item.time}
          style={{
            opacity: 1,
            position: 'absolute',
            transform: `translate(${positions[index]?.x || 0}px, ${
              positions[index]?.y || 0
            }px)`,
            whiteSpace: 'nowrap',
            textShadow: '0 0 6px rgba(0,0,0,0.4)',
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  )
}
