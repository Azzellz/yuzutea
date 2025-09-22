// 静态资源类型声明文件
// 支持在TypeScript中导入各种静态文件

// 图片文件
declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.gif' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

declare module '*.avif' {
  const src: string
  export default src
}

declare module '*.ico' {
  const src: string
  export default src
}

// 字体文件
declare module '*.woff' {
  const src: string
  export default src
}

declare module '*.woff2' {
  const src: string
  export default src
}

declare module '*.ttf' {
  const src: string
  export default src
}

declare module '*.otf' {
  const src: string
  export default src
}

declare module '*.eot' {
  const src: string
  export default src
}

// 音频文件
declare module '*.mp3' {
  const src: string
  export default src
}

declare module '*.wav' {
  const src: string
  export default src
}

declare module '*.ogg' {
  const src: string
  export default src
}

declare module '*.m4a' {
  const src: string
  export default src
}

// 视频文件
declare module '*.mp4' {
  const src: string
  export default src
}

declare module '*.webm' {
  const src: string
  export default src
}

declare module '*.mov' {
  const src: string
  export default src
}

// 文档文件
declare module '*.pdf' {
  const src: string
  export default src
}

declare module '*.txt' {
  const src: string
  export default src
}

// 数据文件
declare module '*.json' {
  const value: any
  export default value
}

declare module '*.csv' {
  const src: string
  export default src
}

// 3D模型文件
declare module '*.gltf' {
  const src: string
  export default src
}

declare module '*.glb' {
  const src: string
  export default src
}

declare module '*.fbx' {
  const src: string
  export default src
}

declare module '*.obj' {
  const src: string
  export default src
}

// CSS文件
declare module '*.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.scss' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.sass' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.less' {
  const classes: { [key: string]: string }
  export default classes
}

// 其他常见文件
declare module '*.md' {
  const src: string
  export default src
}

declare module '*.xml' {
  const src: string
  export default src
}

declare module '*.yaml' {
  const src: string
  export default src
}

declare module '*.yml' {
  const src: string
  export default src
}