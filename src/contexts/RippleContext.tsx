import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface Ripple {
  id: number
  x: number
  y: number
  size: number
  color: string
  duration: number
  pixelStyle?: boolean
  pixelSize?: number
}

interface RippleContextType {
  ripples: Ripple[]
  addRipple: (x: number, y: number, options?: Partial<Pick<Ripple, 'color' | 'duration' | 'size' | 'pixelStyle' | 'pixelSize'>>) => void
  removeRipple: (id: number) => void
}

const RippleContext = createContext<RippleContextType | undefined>(undefined)

interface RippleProviderProps {
  children: ReactNode
  defaultColor?: string
  defaultDuration?: number
  defaultSize?: number
  defaultPixelStyle?: boolean
  defaultPixelSize?: number
}

export function RippleProvider({
  children,
  defaultColor = 'rgba(255, 255, 255, 0.6)',
  defaultDuration = 600,
  defaultSize = 100,
  defaultPixelStyle = false,
  defaultPixelSize = 8,
}: RippleProviderProps) {
  const [ripples, setRipples] = useState<Ripple[]>([])

  const addRipple = useCallback(
    (x: number, y: number, options: Partial<Pick<Ripple, 'color' | 'duration' | 'size' | 'pixelStyle' | 'pixelSize'>> = {}) => {
      const newRipple: Ripple = {
        id: Date.now() + Math.random(),
        x,
        y,
        color: options.color || defaultColor,
        duration: options.duration || defaultDuration,
        size: options.size || defaultSize,
        pixelStyle: options.pixelStyle !== undefined ? options.pixelStyle : defaultPixelStyle,
        pixelSize: options.pixelSize || defaultPixelSize,
      }

      setRipples(prev => [...prev, newRipple])

      // 动画结束后自动移除波纹
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
      }, newRipple.duration)
    },
    [defaultColor, defaultDuration, defaultSize, defaultPixelStyle, defaultPixelSize]
  )

  const removeRipple = useCallback((id: number) => {
    setRipples(prev => prev.filter(ripple => ripple.id !== id))
  }, [])

  const value: RippleContextType = {
    ripples,
    addRipple,
    removeRipple,
  }

  return (
    <RippleContext.Provider value={value}>
      {children}
    </RippleContext.Provider>
  )
}

export function useRipple() {
  const context = useContext(RippleContext)
  if (context === undefined) {
    throw new Error('useRipple must be used within a RippleProvider')
  }
  return context
}

// 自定义hook，用于在页面任意位置添加波纹效果
export function usePageRipple(options?: {
  color?: string
  duration?: number
  size?: number
  pixelStyle?: boolean
  pixelSize?: number
}) {
  const { addRipple } = useRipple()

  const triggerRipple = useCallback(
    (event: MouseEvent | React.MouseEvent) => {
      const x = event.clientX
      const y = event.clientY
      addRipple(x, y, options)
    },
    [addRipple, options]
  )

  return { triggerRipple }
}