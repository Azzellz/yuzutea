import React, { useState, useEffect, useRef, CSSProperties } from 'react'

export type AvatarShape = 'circle' | 'square' | 'rounded'
export type AvatarSize = 'small' | 'medium' | 'large' | number
export type CarouselTransition = 'fade' | 'slide' | 'none'

interface AvatarProps {
  /** 头像图片地址（单张图片模式） */
  src?: string
  /** 轮播图片数组（轮播模式） */
  images?: string[]
  /** 头像尺寸 */
  size?: AvatarSize
  /** 头像形状 */
  shape?: AvatarShape
  /** 替代文本 */
  alt?: string
  /** 图片加载失败时的备用内容 */
  fallback?: React.ReactNode
  /** 边框宽度 */
  borderWidth?: number
  /** 边框颜色 */
  borderColor?: string
  /** 自定义样式 */
  style?: CSSProperties
  /** 自定义类名 */
  className?: string
  /** 点击事件 */
  onClick?: () => void
  
  // 轮播相关属性
  /** 是否自动播放轮播 */
  autoPlay?: boolean
  /** 轮播间隔时间（毫秒） */
  interval?: number
  /** 轮播过渡效果 */
  transition?: CarouselTransition
  /** 过渡动画持续时间（毫秒） */
  transitionDuration?: number
  /** 鼠标悬停时是否暂停轮播 */
  pauseOnHover?: boolean
  /** 轮播切换回调 */
  onImageChange?: (currentIndex: number, image: string) => void
  /** 是否显示轮播控制按钮 */
  showControls?: boolean
  /** 是否显示指示器 */
  showIndicators?: boolean
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  images,
  size = 'medium',
  shape = 'circle',
  alt = 'Avatar',
  fallback,
  borderWidth = 0,
  borderColor = '#e0e0e0',
  style,
  className,
  onClick,
  // 轮播相关属性
  autoPlay = true,
  interval = 3000,
  transition = 'fade',
  transitionDuration = 500,
  pauseOnHover = true,
  onImageChange,
  showControls = false,
  showIndicators = false,
}) => {
  const [imageError, setImageError] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 判断是否为轮播模式
  const isCarouselMode = images && images.length > 1
  
  // 获取当前显示的图片
  const getCurrentImage = (): string | undefined => {
    if (isCarouselMode) {
      return images[currentImageIndex]
    }
    return src
  }

  // 轮播逻辑
  const nextImage = () => {
    if (!isCarouselMode) return
    
    const nextIndex = (currentImageIndex + 1) % images.length
    setCurrentImageIndex(nextIndex)
    onImageChange?.(nextIndex, images[nextIndex])
  }

  // 跳转到指定图片
  const goToImage = (index: number) => {
    if (!isCarouselMode || index < 0 || index >= images.length) return
    
    setCurrentImageIndex(index)
    onImageChange?.(index, images[index])
  }

  // 上一张图片
  const prevImage = () => {
    if (!isCarouselMode) return
    
    const prevIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
    setCurrentImageIndex(prevIndex)
    onImageChange?.(prevIndex, images[prevIndex])
  }

  // 播放/暂停控制
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // 开始轮播
  const startCarousel = () => {
    if (!isCarouselMode || !isPlaying || isPaused) return
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    intervalRef.current = setInterval(nextImage, interval)
  }

  // 停止轮播
  const stopCarousel = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // 处理鼠标悬停
  const handleMouseEnter = () => {
    if (pauseOnHover && isCarouselMode) {
      setIsPaused(true)
      stopCarousel()
    }
  }

  const handleMouseLeave = () => {
    if (pauseOnHover && isCarouselMode) {
      setIsPaused(false)
    }
  }

  // 轮播效果管理
  useEffect(() => {
    if (isCarouselMode && isPlaying && !isPaused) {
      startCarousel()
    } else {
      stopCarousel()
    }

    return () => stopCarousel()
  }, [isCarouselMode, isPlaying, isPaused, interval, currentImageIndex])

  // 清理定时器
  useEffect(() => {
    return () => stopCarousel()
  }, [])

  // 获取尺寸值
  const getSizeValue = (size: AvatarSize): number => {
    if (typeof size === 'number') return size
    
    const sizeMap = {
      small: 32,
      medium: 50,
      large: 80,
    }
    return sizeMap[size]
  }

  // 获取边框半径
  const getBorderRadius = (shape: AvatarShape, size: number): string => {
    switch (shape) {
      case 'circle':
        return '50%'
      case 'square':
        return '0'
      case 'rounded':
        return `${size * 0.15}px`
      default:
        return '50%'
    }
  }

  const sizeValue = getSizeValue(size)
  const borderRadius = getBorderRadius(shape, sizeValue)

  const avatarStyle: CSSProperties = {
    width: sizeValue,
    height: sizeValue,
    borderRadius,
    border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : 'none',
    overflow: 'hidden',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    cursor: onClick ? 'pointer' : 'default',
    userSelect: 'none',
    flexShrink: 0,
    position: 'relative',
    ...style,
  }

  const imageStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: transition === 'fade' ? `opacity ${transitionDuration}ms ease-in-out` : 'none',
  }

  // 轮播图片容器样式
  const carouselContainerStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  }

  // 轮播图片样式
  const carouselImageStyle: CSSProperties = {
    ...imageStyle,
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 1,
    transition: transition === 'fade' ? `opacity ${transitionDuration}ms ease-in-out` : 
               transition === 'slide' ? `transform ${transitionDuration}ms ease-in-out` : 'none',
  }

  // 控制按钮样式
  const controlButtonStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    zIndex: 2,
    opacity: 0,
    transition: 'opacity 0.3s ease',
  }

  // 指示器样式
  const indicatorsStyle: CSSProperties = {
    position: 'absolute',
    bottom: '8px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '4px',
    zIndex: 2,
  }

  const indicatorStyle: CSSProperties = {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  }

  const defaultFallback = (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e0e0e0',
        color: '#999',
        fontSize: sizeValue * 0.4,
        fontWeight: 'bold',
      }}
    >
      {alt.charAt(0).toUpperCase()}
    </div>
  )

  const handleImageError = () => {
    setImageError(true)
  }

  // 渲染轮播图片
  const renderCarouselImages = () => {
    if (!isCarouselMode) return null

    return (
      <div style={carouselContainerStyle}>
        {images.map((image, index) => (
          <img
            key={`${image}-${index}`}
            src={image}
            alt={`${alt} ${index + 1}`}
            style={{
              ...carouselImageStyle,
              opacity: transition === 'fade' ? (index === currentImageIndex ? 1 : 0) : 1,
              transform: transition === 'slide' 
                ? `translateX(${(index - currentImageIndex) * 100}%)` 
                : 'none',
              zIndex: index === currentImageIndex ? 1 : 0,
            }}
            onError={index === currentImageIndex ? handleImageError : undefined}
          />
        ))}
      </div>
    )
  }

  // 渲染控制按钮
  const renderControls = () => {
    if (!isCarouselMode || !showControls) return null

    return (
      <>
        <button
          style={{ ...controlButtonStyle, left: '8px' }}
          onClick={(e) => {
            e.stopPropagation()
            prevImage()
          }}
          aria-label="Previous image"
        >
          ‹
        </button>
        <button
          style={{ ...controlButtonStyle, right: '8px' }}
          onClick={(e) => {
            e.stopPropagation()
            nextImage()
          }}
          aria-label="Next image"
        >
          ›
        </button>
        <button
          style={{
            ...controlButtonStyle,
            top: '8px',
            left: '8px',
            transform: 'none',
            width: '20px',
            height: '20px',
            fontSize: '10px',
          }}
          onClick={(e) => {
            e.stopPropagation()
            togglePlayPause()
          }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </>
    )
  }

  // 渲染指示器
  const renderIndicators = () => {
    if (!isCarouselMode || !showIndicators) return null

    return (
      <div style={indicatorsStyle}>
        {images.map((_, index) => (
          <button
            key={index}
            style={{
              ...indicatorStyle,
              backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
            }}
            onClick={(e) => {
              e.stopPropagation()
              goToImage(index)
            }}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`avatar ${className || ''}`.trim()}
      style={{
        ...avatarStyle,
        '&:hover .avatarControls': {
          opacity: 1,
        }
      } as CSSProperties}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {isCarouselMode ? (
        <>
          {renderCarouselImages()}
          <div 
            className="avatar-controls"
            style={{ 
              opacity: showControls ? 1 : 0,
              transition: 'opacity 0.3s ease',
              '&:hover': { opacity: 1 }
            } as CSSProperties}
          >
            {renderControls()}
          </div>
          {renderIndicators()}
        </>
      ) : (
        <>
          {src && !imageError ? (
            <img
              src={src}
              alt={alt}
              style={imageStyle}
              onError={handleImageError}
            />
          ) : (
            fallback || defaultFallback
          )}
        </>
      )}
    </div>
  )
}

export default Avatar