import React, { useEffect } from 'react'
import { useRipple, usePageRipple } from '@/contexts/RippleContext'

interface RippleRendererProps {
  enableClick?: boolean
  clickOptions?: {
    color?: string
    duration?: number
    size?: number
    pixelStyle?: boolean
    pixelSize?: number
  }
}

export default function RippleRenderer({
  enableClick = true,
  clickOptions = {
    color: 'rgba(74, 144, 226, 0.3)',
    duration: 800,
    size: 120,
    pixelStyle: true,
    pixelSize: 8,
  },
}: RippleRendererProps) {
  const { ripples } = useRipple()
  const { triggerRipple } = usePageRipple(clickOptions)

  // 监听点击事件
  useEffect(() => {
    if (!enableClick) return

    const handleClick = (event: MouseEvent) => {
      // 避免在某些特定元素上触发（如按钮、链接等）
      const target = event.target as HTMLElement
      const isInteractiveElement = target.closest(
        'button, a, input, textarea, select, [role="button"]'
      )

      if (!isInteractiveElement) {
        triggerRipple(event)
      }
    }

    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [enableClick, triggerRipple])

  return (
    <>
      {/* 全局波纹容器 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 9999,
          overflow: 'hidden',
        }}
      >
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className={ripple.pixelStyle ? 'pixel-ripple' : 'smooth-ripple'}
            style={{
              position: 'absolute',
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
              width: ripple.size,
              height: ripple.size,
              borderRadius: ripple.pixelStyle ? '0' : '50%',
              backgroundColor: ripple.color,
              transform: 'scale(0)',
              animation: ripple.pixelStyle
                ? `pixel-ripple-animation ${
                    ripple.duration
                  }ms steps(${Math.floor(ripple.duration / 50)}) forwards`
                : `ripple-animation ${ripple.duration}ms ease-out forwards`,
              pointerEvents: 'none',
              imageRendering: ripple.pixelStyle ? 'pixelated' : 'auto',
              ...(ripple.pixelStyle && {
                boxShadow: `
                  0 0 0 ${ripple.pixelSize}px ${ripple.color},
                  0 0 0 ${
                    ripple.pixelSize ? ripple.pixelSize * 2 : 0
                  }px rgba(0,0,0,0.1)
                `,
                filter: 'contrast(1.2) saturate(1.3)',
              }),
            }}
          />
        ))}
      </div>
    </>
  )
}

// 导出一个便捷的hook，用于手动触发波纹
export function useManualRipple() {
  const { addRipple } = useRipple()

  const triggerRippleAt = (
    x: number,
    y: number,
    options?: {
      color?: string
      duration?: number
      size?: number
      pixelStyle?: boolean
      pixelSize?: number
    }
  ) => {
    addRipple(x, y, options)
  }

  const triggerRippleFromEvent = (
    event: MouseEvent | React.MouseEvent,
    options?: {
      color?: string
      duration?: number
      size?: number
      pixelStyle?: boolean
      pixelSize?: number
    }
  ) => {
    const x = event.clientX
    const y = event.clientY
    addRipple(x, y, options)
  }

  return {
    triggerRippleAt,
    triggerRippleFromEvent,
  }
}
