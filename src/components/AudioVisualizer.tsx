import React, { useRef, useEffect, useState, useCallback, CSSProperties } from 'react'

// 可视化类型
export type VisualizationType = 'bars' | 'wave' | 'circle' | 'particles' | 'spectrum'

// 颜色主题
export type ColorTheme = 'rainbow' | 'blue' | 'green' | 'red' | 'purple' | 'gradient' | 'custom'

// 音频可视化组件属性接口
export interface AudioVisualizerProps {
  // 音频源
  audioSrc?: string
  audioElement?: HTMLAudioElement
  
  // 可视化类型
  type?: VisualizationType
  
  // 画布尺寸
  width?: number
  height?: number
  
  // 颜色主题
  colorTheme?: ColorTheme
  customColors?: string[]
  
  // 频谱分析参数
  fftSize?: number // 2048, 4096, 8192 等
  smoothingTimeConstant?: number // 0-1
  
  // 可视化参数
  barCount?: number // 频谱条数量
  barWidth?: number // 频谱条宽度
  barGap?: number // 频谱条间距
  sensitivity?: number // 敏感度 0-1
  
  // 动画参数
  animationSpeed?: number // 动画速度
  decay?: number // 衰减速度
  
  // 样式
  className?: string
  style?: CSSProperties
  canvasStyle?: CSSProperties
  
  // 控制选项
  showControls?: boolean
  autoPlay?: boolean
  loop?: boolean
  
  // 回调函数
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onError?: (error: Error) => void
  onFrequencyData?: (data: Uint8Array) => void
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioSrc,
  audioElement,
  type = 'bars',
  width = 800,
  height = 300,
  colorTheme = 'rainbow',
  customColors = [],
  fftSize = 2048,
  smoothingTimeConstant = 0.8,
  barCount = 64,
  barWidth = 8,
  barGap = 2,
  sensitivity = 1,
  animationSpeed = 1,
  decay = 0.95,
  className = '',
  style = {},
  canvasStyle = {},
  showControls = true,
  autoPlay = false,
  loop = false,
  onPlay,
  onPause,
  onEnded,
  onError,
  onFrequencyData
}) => {
  // 引用
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const animationRef = useRef<number>()
  
  // 状态
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  // 频谱数据
  const frequencyDataRef = useRef<Uint8Array>()
  const previousDataRef = useRef<Float32Array>()
  
  // 初始化音频上下文和分析器
  const initAudioContext = useCallback(async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      
      const audioContext = audioContextRef.current
      const audio = audioElement || audioRef.current
      
      if (!audio) {
        throw new Error('音频元素未找到')
      }
      
      // 创建分析器节点
      if (!analyserRef.current) {
        analyserRef.current = audioContext.createAnalyser()
        analyserRef.current.fftSize = fftSize
        analyserRef.current.smoothingTimeConstant = smoothingTimeConstant
      }
      
      // 创建音频源节点
      if (!sourceRef.current) {
        sourceRef.current = audioContext.createMediaElementSource(audio)
        sourceRef.current.connect(analyserRef.current)
        analyserRef.current.connect(audioContext.destination)
      }
      
      // 初始化频谱数据数组
      const bufferLength = analyserRef.current.frequencyBinCount
      frequencyDataRef.current = new Uint8Array(bufferLength)
      previousDataRef.current = new Float32Array(barCount)
      
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '音频初始化失败'
      setError(errorMessage)
      onError?.(err instanceof Error ? err : new Error(errorMessage))
    }
  }, [audioElement, fftSize, smoothingTimeConstant, barCount, onError])
  
  // 获取频谱数据
  const getFrequencyData = useCallback(() => {
    if (!analyserRef.current || !frequencyDataRef.current) return null
    
    analyserRef.current.getByteFrequencyData(frequencyDataRef.current)
    onFrequencyData?.(frequencyDataRef.current)
    
    return frequencyDataRef.current
  }, [onFrequencyData])
  
  // 处理频谱数据，转换为可视化数据
  const processFrequencyData = useCallback((data: Uint8Array) => {
    const processed = new Float32Array(barCount)
    const binSize = Math.floor(data.length / barCount)
    
    for (let i = 0; i < barCount; i++) {
      let sum = 0
      const start = i * binSize
      const end = Math.min(start + binSize, data.length)
      
      for (let j = start; j < end; j++) {
        sum += data[j]
      }
      
      const average = sum / (end - start)
      const normalized = (average / 255) * sensitivity
      
      // 应用衰减效果
      if (previousDataRef.current) {
        const previous = previousDataRef.current[i] || 0
        processed[i] = Math.max(normalized, previous * decay)
        previousDataRef.current[i] = processed[i]
      } else {
        processed[i] = normalized
      }
    }
    
    return processed
  }, [barCount, sensitivity, decay])
  
  // 播放音频
  const playAudio = useCallback(async () => {
    try {
      const audio = audioElement || audioRef.current
      if (!audio) return
      
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume()
      }
      
      await audio.play()
      setIsPlaying(true)
      onPlay?.()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '播放失败'
      setError(errorMessage)
      onError?.(err instanceof Error ? err : new Error(errorMessage))
    }
  }, [audioElement, onPlay, onError])
  
  // 暂停音频
  const pauseAudio = useCallback(() => {
    const audio = audioElement || audioRef.current
    if (!audio) return
    
    audio.pause()
    setIsPlaying(false)
    onPause?.()
  }, [audioElement, onPause])
  
  // 切换播放状态
  const togglePlayback = useCallback(async () => {
    if (isPlaying) {
      pauseAudio()
    } else {
      await playAudio()
    }
  }, [isPlaying, playAudio, pauseAudio])
  
  // 设置音量
  const handleVolumeChange = useCallback((newVolume: number) => {
    const audio = audioElement || audioRef.current
    if (!audio) return
    
    audio.volume = newVolume
    setVolume(newVolume)
  }, [audioElement])
  
  // 设置播放进度
  const handleSeek = useCallback((time: number) => {
    const audio = audioElement || audioRef.current
    if (!audio) return
    
    audio.currentTime = time
    setCurrentTime(time)
  }, [audioElement])
  
  // 监听音频事件
  useEffect(() => {
    const audio = audioElement || audioRef.current
    if (!audio) return
    
    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleEnded = () => {
      setIsPlaying(false)
      onEnded?.()
    }
    const handleError = () => {
      setError('音频加载失败')
      setIsLoading(false)
    }
    
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    
    return () => {
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [audioElement, onEnded])
  
  // 初始化音频上下文
  useEffect(() => {
    const audio = audioElement || audioRef.current
    if (audio && audio.readyState >= 2) {
      initAudioContext()
    }
  }, [audioElement, initAudioContext])
  
  // 自动播放
  useEffect(() => {
    if (autoPlay && !isLoading) {
      playAudio()
    }
  }, [autoPlay, isLoading, playAudio])
  
  // 获取颜色
  const getColor = useCallback((index: number, intensity: number) => {
    if (customColors.length > 0) {
      return customColors[index % customColors.length]
    }
    
    switch (colorTheme) {
      case 'rainbow':
        const hue = (index / barCount) * 360
        return `hsl(${hue}, 70%, ${50 + intensity * 30}%)`
      case 'blue':
        return `rgba(0, 150, 255, ${0.3 + intensity * 0.7})`
      case 'green':
        return `rgba(0, 255, 150, ${0.3 + intensity * 0.7})`
      case 'red':
        return `rgba(255, 50, 50, ${0.3 + intensity * 0.7})`
      case 'purple':
        return `rgba(150, 50, 255, ${0.3 + intensity * 0.7})`
      case 'gradient':
        const ratio = index / barCount
        const r = Math.floor(255 * (1 - ratio) + 50 * ratio)
        const g = Math.floor(50 * (1 - ratio) + 255 * ratio)
        const b = Math.floor(150)
        return `rgba(${r}, ${g}, ${b}, ${0.3 + intensity * 0.7})`
      default:
        return `rgba(255, 255, 255, ${0.3 + intensity * 0.7})`
    }
  }, [colorTheme, customColors, barCount])
  
  // 渲染频谱条
  const renderBars = useCallback((ctx: CanvasRenderingContext2D, data: Float32Array) => {
    const totalWidth = (barWidth + barGap) * barCount - barGap
    const startX = (width - totalWidth) / 2
    
    for (let i = 0; i < barCount; i++) {
      const barHeight = data[i] * height * 0.8
      const x = startX + i * (barWidth + barGap)
      const y = height - barHeight
      
      const color = getColor(i, data[i])
      ctx.fillStyle = color
      ctx.fillRect(x, y, barWidth, barHeight)
      
      // 添加顶部高光
      if (barHeight > 5) {
        ctx.fillStyle = `rgba(255, 255, 255, ${data[i] * 0.5})`
        ctx.fillRect(x, y, barWidth, 2)
      }
    }
  }, [width, height, barCount, barWidth, barGap, getColor])
  
  // 渲染波形
  const renderWave = useCallback((ctx: CanvasRenderingContext2D, data: Float32Array) => {
    ctx.beginPath()
    ctx.strokeStyle = getColor(0, 0.8)
    ctx.lineWidth = 2
    
    const sliceWidth = width / barCount
    let x = 0
    
    for (let i = 0; i < barCount; i++) {
      const v = data[i]
      const y = height / 2 + (v - 0.5) * height * 0.8
      
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
      
      x += sliceWidth
    }
    
    ctx.stroke()
    
    // 填充波形下方区域
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, getColor(0, 0.3))
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = gradient
    ctx.fill()
  }, [width, height, barCount, getColor])
  
  // 渲染圆形频谱
  const renderCircle = useCallback((ctx: CanvasRenderingContext2D, data: Float32Array) => {
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) * 0.3
    
    for (let i = 0; i < barCount; i++) {
      const angle = (i / barCount) * Math.PI * 2
      const barHeight = data[i] * radius * 0.8
      
      const x1 = centerX + Math.cos(angle) * radius
      const y1 = centerY + Math.sin(angle) * radius
      const x2 = centerX + Math.cos(angle) * (radius + barHeight)
      const y2 = centerY + Math.sin(angle) * (radius + barHeight)
      
      ctx.beginPath()
      ctx.strokeStyle = getColor(i, data[i])
      ctx.lineWidth = Math.max(1, barWidth / 2)
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }
    
    // 绘制中心圆
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.1, 0, Math.PI * 2)
    ctx.fillStyle = getColor(0, 0.5)
    ctx.fill()
  }, [width, height, barCount, barWidth, getColor])
  
  // 渲染粒子效果
  const renderParticles = useCallback((ctx: CanvasRenderingContext2D, data: Float32Array) => {
    for (let i = 0; i < barCount; i++) {
      const intensity = data[i]
      if (intensity < 0.1) continue
      
      const particleCount = Math.floor(intensity * 10)
      for (let j = 0; j < particleCount; j++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const size = intensity * 5
        
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = getColor(i, intensity)
        ctx.fill()
      }
    }
  }, [width, height, barCount, getColor])
  
  // 渲染频谱图
  const renderSpectrum = useCallback((ctx: CanvasRenderingContext2D, data: Float32Array) => {
    const imageData = ctx.createImageData(width, height)
    const pixels = imageData.data
    
    for (let x = 0; x < width; x++) {
      const dataIndex = Math.floor((x / width) * barCount)
      const intensity = data[dataIndex] || 0
      const barHeight = Math.floor(intensity * height)
      
      for (let y = height - barHeight; y < height; y++) {
        const pixelIndex = (y * width + x) * 4
        const color = getColor(dataIndex, intensity)
        
        // 解析颜色
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
        if (match) {
          pixels[pixelIndex] = parseInt(match[1])     // R
          pixels[pixelIndex + 1] = parseInt(match[2]) // G
          pixels[pixelIndex + 2] = parseInt(match[3]) // B
          pixels[pixelIndex + 3] = Math.floor((parseFloat(match[4]) || 1) * 255) // A
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0)
  }, [width, height, barCount, getColor])
  
  // 动画循环
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    
    // 清空画布
    ctx.clearRect(0, 0, width, height)
    
    // 获取频谱数据
    const rawData = getFrequencyData()
    if (!rawData) {
      animationRef.current = requestAnimationFrame(animate)
      return
    }
    
    // 处理频谱数据
    const processedData = processFrequencyData(rawData)
    
    // 根据类型渲染
    switch (type) {
      case 'bars':
        renderBars(ctx, processedData)
        break
      case 'wave':
        renderWave(ctx, processedData)
        break
      case 'circle':
        renderCircle(ctx, processedData)
        break
      case 'particles':
        renderParticles(ctx, processedData)
        break
      case 'spectrum':
        renderSpectrum(ctx, processedData)
        break
    }
    
    animationRef.current = requestAnimationFrame(animate)
  }, [width, height, type, getFrequencyData, processFrequencyData, renderBars, renderWave, renderCircle, renderParticles, renderSpectrum])
  
  // 开始/停止动画
  useEffect(() => {
    if (isPlaying) {
      animate()
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, animate])
  
  return (
    <div className={`audio-visualizer ${className}`} style={style}>
      {/* 音频元素 */}
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          loop={loop}
          style={{ display: 'none' }}
        />
      )}
      
      {/* 可视化画布 */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          border: '1px solid #333',
          borderRadius: '8px',
          backgroundColor: '#000',
          ...canvasStyle
        }}
      />
      
      {/* 控制面板 */}
      {showControls && (
        <div className="audio-controls" style={{
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px'
        }}>
          {/* 播放/暂停按钮 */}
          <button
            onClick={togglePlayback}
            style={{
              padding: '8px 16px',
              backgroundColor: isPlaying ? '#ff4757' : '#2ed573',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            disabled={isLoading}
          >
            {isLoading ? '加载中...' : isPlaying ? '⏸️ 暂停' : '▶️ 播放'}
          </button>
          
          {/* 音量控制 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px' }}>🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              style={{ width: '80px' }}
            />
            <span style={{ fontSize: '12px', minWidth: '30px' }}>
              {Math.round(volume * 100)}%
            </span>
          </div>
          
          {/* 进度条 */}
          {duration > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
              <span style={{ fontSize: '12px', minWidth: '40px' }}>
                {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}
              </span>
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: '12px', minWidth: '40px' }}>
                {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* 错误信息 */}
      {error && (
        <div style={{
          marginTop: '12px',
          padding: '8px 12px',
          backgroundColor: '#ff4757',
          color: '#fff',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          错误: {error}
        </div>
      )}
    </div>
  )
}

export default AudioVisualizer