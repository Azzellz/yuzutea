import React, { useState } from 'react'
import AudioVisualizer, { VisualizationType, ColorTheme } from './AudioVisualizer'

const AudioVisualizerDemo: React.FC = () => {
  const [currentType, setCurrentType] = useState<VisualizationType>('bars')
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>('rainbow')
  const [audioSrc, setAudioSrc] = useState<string>('')
  
  // 示例音频文件（可以替换为实际的音频文件）
  const sampleAudios = [
    { name: '示例音频 1', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
    { name: '示例音频 2', url: 'https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav' },
    { name: '本地音频', url: '' }
  ]
  
  const visualizationTypes: { value: VisualizationType; label: string }[] = [
    { value: 'bars', label: '频谱条' },
    { value: 'wave', label: '波形' },
    { value: 'circle', label: '圆形频谱' },
    { value: 'particles', label: '粒子效果' },
    { value: 'spectrum', label: '频谱图' }
  ]
  
  const colorThemes: { value: ColorTheme; label: string }[] = [
    { value: 'rainbow', label: '彩虹' },
    { value: 'blue', label: '蓝色' },
    { value: 'green', label: '绿色' },
    { value: 'red', label: '红色' },
    { value: 'purple', label: '紫色' },
    { value: 'gradient', label: '渐变' }
  ]
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAudioSrc(url)
    }
  }
  
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        🎵 音频律动可视化组件演示
      </h1>
      
      {/* 控制面板 */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0, color: '#555' }}>🎛️ 控制面板</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {/* 音频源选择 */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#666' }}>
              音频源:
            </label>
            <select
              value={audioSrc}
              onChange={(e) => setAudioSrc(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">选择音频...</option>
              {sampleAudios.map((audio, index) => (
                <option key={index} value={audio.url}>
                  {audio.name}
                </option>
              ))}
            </select>
            
            <div style={{ marginTop: '8px' }}>
              <label style={{ fontSize: '12px', color: '#666' }}>或上传本地文件:</label>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                style={{
                  width: '100%',
                  padding: '4px',
                  fontSize: '12px',
                  marginTop: '4px'
                }}
              />
            </div>
          </div>
          
          {/* 可视化类型 */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#666' }}>
              可视化类型:
            </label>
            <select
              value={currentType}
              onChange={(e) => setCurrentType(e.target.value as VisualizationType)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              {visualizationTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* 颜色主题 */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#666' }}>
              颜色主题:
            </label>
            <select
              value={currentTheme}
              onChange={(e) => setCurrentTheme(e.target.value as ColorTheme)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              {colorThemes.map((theme) => (
                <option key={theme.value} value={theme.value}>
                  {theme.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* 主要可视化器 */}
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '30px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0, color: '#555' }}>🎨 主要可视化器</h3>
        <AudioVisualizer
          audioSrc={audioSrc}
          type={currentType}
          colorTheme={currentTheme}
          width={800}
          height={300}
          showControls={true}
          autoPlay={false}
          barCount={64}
          barWidth={8}
          barGap={2}
          sensitivity={1}
          fftSize={2048}
          smoothingTimeConstant={0.8}
          onPlay={() => console.log('播放开始')}
          onPause={() => console.log('播放暂停')}
          onEnded={() => console.log('播放结束')}
          onError={(error) => console.error('播放错误:', error)}
          onFrequencyData={(data) => {
            // 可以在这里处理频谱数据
            // console.log('频谱数据:', data)
          }}
        />
      </div>
      
      {/* 多种效果对比 */}
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '30px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0, color: '#555' }}>🔄 多种效果对比</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
          {visualizationTypes.slice(0, 4).map((type) => (
            <div key={type.value} style={{ textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>{type.label}</h4>
              <AudioVisualizer
                audioSrc={audioSrc}
                type={type.value}
                colorTheme={currentTheme}
                width={360}
                height={200}
                showControls={false}
                autoPlay={false}
                barCount={32}
                barWidth={6}
                barGap={1}
                sensitivity={0.8}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* 不同颜色主题 */}
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '30px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0, color: '#555' }}>🌈 不同颜色主题</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          {colorThemes.map((theme) => (
            <div key={theme.value} style={{ textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>{theme.label}</h4>
              <AudioVisualizer
                audioSrc={audioSrc}
                type="bars"
                colorTheme={theme.value}
                width={240}
                height={120}
                showControls={false}
                autoPlay={false}
                barCount={24}
                barWidth={6}
                barGap={1}
                sensitivity={0.6}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* 使用说明 */}
      <div style={{
        backgroundColor: '#e8f4fd',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #b3d9ff'
      }}>
        <h3 style={{ marginTop: 0, color: '#0066cc' }}>📖 使用说明</h3>
        <ul style={{ color: '#333', lineHeight: '1.6' }}>
          <li><strong>音频源:</strong> 选择示例音频或上传本地音频文件</li>
          <li><strong>可视化类型:</strong> 支持频谱条、波形、圆形频谱、粒子效果和频谱图</li>
          <li><strong>颜色主题:</strong> 提供多种预设颜色主题，也可自定义颜色</li>
          <li><strong>参数调节:</strong> 可调节频谱条数量、宽度、间距、敏感度等参数</li>
          <li><strong>音频控制:</strong> 支持播放、暂停、音量调节和进度控制</li>
          <li><strong>实时分析:</strong> 使用Web Audio API实时分析音频频谱数据</li>
        </ul>
        
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '6px', border: '1px solid #ffeaa7' }}>
          <strong>💡 提示:</strong> 由于浏览器安全策略，某些音频文件可能需要用户交互才能播放。建议使用本地音频文件进行测试。
        </div>
      </div>
    </div>
  )
}

export default AudioVisualizerDemo