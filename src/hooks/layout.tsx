import { useRef, useState, useLayoutEffect, useCallback } from 'react'

export function useParentLayout<T extends HTMLDivElement>() {
  const parentRef = useRef<T>(null)
  const [parentWidth, setParentWidth] = useState(0)
  const [parentHeight, setParentHeight] = useState(0)

  // 封装测量逻辑
  const measureElement = useCallback(() => {
    if (parentRef.current) {
    //   const rect = parentRef.current.getBoundingClientRect()
      const width = parentRef.current.offsetWidth
      const height = parentRef.current.offsetHeight
      
      // 确保元素已经渲染完成（有实际尺寸）
      if (width > 0 || height > 0) {
        setParentWidth(width)
        setParentHeight(height)
        return true
      }
    }
    return false
  }, [])

  useLayoutEffect(() => {
    // 首次测量
    measureElement()
    
    const observers: Array<() => void> = []
    
    if (parentRef.current) {
      // 1. ResizeObserver - 最直接监听元素尺寸变化
      if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            // 使用 ResizeObserver 提供的尺寸信息，更精确
            const { width, height } = entry.contentRect
            setParentWidth(Math.round(width))
            setParentHeight(Math.round(height))
          }
        })
        resizeObserver.observe(parentRef.current)
        observers.push(() => resizeObserver.disconnect())
      }
      
      // 2. MutationObserver - 监听子元素的变化
      const mutationObserver = new MutationObserver((mutations) => {
        let shouldMeasure = false
        
        mutations.forEach((mutation) => {
          // 监听子元素的添加/删除
          if (mutation.type === 'childList') {
            shouldMeasure = true
          }
          // 监听可能影响布局的属性变化
          else if (mutation.type === 'attributes') {
            // const target = mutation.target as HTMLElement
            const attrName = mutation.attributeName
            
            // 监听可能影响尺寸的属性
            if (attrName === 'style' || 
                attrName === 'class' || 
                attrName === 'width' || 
                attrName === 'height') {
              shouldMeasure = true
            }
          }
          // 监听文本内容变化（可能导致换行）
          else if (mutation.type === 'characterData') {
            shouldMeasure = true
          }
        })
        
        if (shouldMeasure) {
          // 使用 requestAnimationFrame 确保在下一帧测量
          requestAnimationFrame(() => {
            measureElement()
          })
        }
      })
      
      // 监听父元素及其所有子元素的变化
      mutationObserver.observe(parentRef.current, {
        childList: true,        // 监听子元素添加/删除
        subtree: true,          // 监听所有后代元素
        attributes: true,       // 监听属性变化
        attributeFilter: ['style', 'class', 'width', 'height'], // 只监听影响布局的属性
        characterData: true,    // 监听文本内容变化
        characterDataOldValue: false
      })
      observers.push(() => mutationObserver.disconnect())
    }

    // 3. 监听窗口大小变化（响应式布局）
    const handleResize = () => {
      measureElement()
    }
    window.addEventListener('resize', handleResize)
    observers.push(() => window.removeEventListener('resize', handleResize))
    
    // 4. 监听字体加载完成（可能影响文本尺寸）
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        measureElement()
      })
    }

    return () => {
      observers.forEach(cleanup => cleanup())
    }
  }, [measureElement])

  // 提供手动刷新的方法
  const refresh = useCallback(() => {
    measureElement()
  }, [measureElement])

  return {
    parentRef,
    parentWidth,
    parentHeight,
    refresh, // 允许手动刷新尺寸
  }
}
