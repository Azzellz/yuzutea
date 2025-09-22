import React, { useState, CSSProperties } from 'react'

export type AvatarShape = 'circle' | 'square' | 'rounded'
export type AvatarSize = 'small' | 'medium' | 'large' | number

interface AvatarProps {
  /** 头像图片地址 */
  src?: string
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
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  size = 'medium',
  shape = 'circle',
  alt = 'Avatar',
  fallback,
  borderWidth = 0,
  borderColor = '#e0e0e0',
  style,
  className,
  onClick,
}) => {
  const [imageError, setImageError] = useState(false)

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
    ...style,
  }

  const imageStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
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

  return (
    <div
      className={`avatar ${className || ''}`.trim()}
      style={avatarStyle}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
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
    </div>
  )
}

export default Avatar