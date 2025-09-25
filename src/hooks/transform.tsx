import { useState, useMemo, useEffect } from 'react'

export interface TraceTransformHookProps {
  mousePosition?: { x: number; y: number }
  transformXRate?: number
  transformYRate?: number
  parallaxIntensity?: number
}
export function useTraceTransform({
  mousePosition,
  transformXRate = 100,
  transformYRate = 100,
  parallaxIntensity = 0.02,
}: TraceTransformHookProps) {
  const [transform, setTransform] = useState({ x: 0, y: 0 })

  // 使用 useMemo 来避免每次渲染都创建新的默认对象
  const defaultMousePosition = useMemo(() => ({ x: 0, y: 0 }), [])
  const currentMousePosition = mousePosition || defaultMousePosition

  // 视差效果计算
  useEffect(() => {
    const parallaxX = currentMousePosition.x * parallaxIntensity * 30
    const parallaxY = currentMousePosition.y * parallaxIntensity * 20

    setTransform({ x: parallaxX, y: parallaxY })
  }, [currentMousePosition.x, currentMousePosition.y, parallaxIntensity])

  const transformX = transform.x * transformXRate
  const transformY = transform.y * transformYRate
  const transformStyle = `translate(calc(-50% + ${transformX}px), ${transformY}px) rotateY(${transformX}deg) rotateX(${transformY}deg)`

  return { transformStyle }
}
