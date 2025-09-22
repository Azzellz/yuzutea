import { Mesh, PlaneGeometry, Group, Vector3, MathUtils, Texture } from 'three'
import {
  useRef,
  useState,
  useLayoutEffect,
  ReactNode,
  useCallback,
  useMemo,
} from 'react'
import {
  createRoot,
  events,
  extend,
  useFrame,
  RootState,
} from '@react-three/fiber'
import { Plane, useAspect, useTexture } from '@react-three/drei'
import {
  EffectComposer,
  DepthOfField,
  Vignette,
} from '@react-three/postprocessing'
import { MaskFunction } from 'postprocessing'
import Fireflies from './Fireflies'
import DialogBox from './DialogBox'
import bg0Url from '@/assets/image/bg0.png'
import starsUrl from '@/assets/image/stars.png'
import groundUrl from '@/assets/image/ground.png'
import characterUrl from '@/assets/image/character.png'
import bg1Url from '@/assets/image/bg1.png'
import bg2Url from '@/assets/image/bg2.png'
import '@/materials/layerMaterial'
import { DomEvent } from '@react-three/fiber/dist/declarations/src/core/events'
import { LYRICS } from '@/consts/lyrics'
import InfoBox from './InfoBox'

// 定义层级配置的类型
interface LayerConfig {
  texture: Texture
  x: number
  y: number
  z: number
  factor?: number
  scaleFactor?: number
  wiggle?: number
  scale: [number, number, number]
}

function Experience() {
  const scaleN = useAspect(1600, 1000, 1.05)
  const scaleW = useAspect(1600, 1000, 1.05)
  const textures = useTexture([
    bg0Url,
    starsUrl,
    groundUrl,
    characterUrl,
    bg1Url,
    bg2Url,
  ])
  const group = useRef<Group>(null)
  const layersRef = useRef<any[]>([])
  const [movement] = useState(() => new Vector3())
  const [temp] = useState(() => new Vector3())

  // 使用useMemo来稳定Fireflies的props
  const firefliesProps = useMemo(
    () => ({
      count: 20,
      radius: 80,
      colors: ['white', 'yellow', 'red'],
    }),
    []
  )

  const layers: LayerConfig[] = [
    { texture: textures[0], x: 0, y: 0, z: 0, factor: 0.005, scale: scaleW },
    { texture: textures[1], x: 0, y: 0, z: 10, factor: 0.005, scale: scaleW },
    // { texture: textures[2], x: 0, y: 0, z: 20, scale: scaleW },
    {
      texture: textures[3],
      x: 0,
      y: 0,
      z: 30,
      scaleFactor: 0.83,
      scale: scaleN,
    },
    {
      texture: textures[4],
      x: 0,
      y: 0,
      z: 40,
      factor: 0.03,
      scaleFactor: 1,
      wiggle: 0.6,
      scale: scaleW,
    },
    {
      texture: textures[5],
      x: -20,
      y: -20,
      z: 49,
      factor: 0.04,
      scaleFactor: 1.3,
      wiggle: 1,
      scale: scaleW,
    },
  ]

  useFrame((state, _delta) => {
    movement.lerp(temp.set(state.pointer.x, state.pointer.y * 0.2, 0), 0.2)
    if (!group.current) return
    group.current.position.x = MathUtils.lerp(
      group.current.position.x,
      state.pointer.x * 20,
      0.05
    )
    group.current.rotation.x = MathUtils.lerp(
      group.current.rotation.x,
      state.pointer.y / 20,
      0.05
    )
    group.current.rotation.y = MathUtils.lerp(
      group.current.rotation.y,
      -state.pointer.x / 2,
      0.05
    )
    // layersRef.current[4].uniforms.time.value =
    //   layersRef.current[5].uniforms.time.value += delta
  }, 1)

  return (
    <group ref={group}>
      <Fireflies {...firefliesProps} />
      {layers.map(
        (
          {
            scale,
            texture,
            // ref,
            factor = 0,
            scaleFactor = 1,
            wiggle = 0,
            x,
            y,
            z,
          },
          i
        ) => (
          <Plane
            scale={scale}
            args={[1, 1, wiggle ? 10 : 1, wiggle ? 10 : 1]}
            position={[x, y, z]}
            key={i}
            // ref={ref}
          >
            <layerMaterial
              movement={movement}
              textr={texture}
              factor={factor}
              ref={(el: any) => (layersRef.current[i] = el)}
              wiggle={wiggle}
              scale={scaleFactor}
            />
          </Plane>
        )
      )}
    </group>
  )
}

function Effects() {
  const ref = useRef<any>()
  useLayoutEffect(() => {
    if (ref.current?.maskPass) {
      const maskMaterial = ref.current.maskPass.getFullscreenMaterial()
      maskMaterial.maskFunction = MaskFunction.MULTIPLY_RGB_SET_ALPHA
    }
  })
  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <DepthOfField
        ref={ref}
        target={[0, 0, 30]}
        bokehScale={8}
        focalLength={0.1}
        width={1024}
      />
      <Vignette />
    </EffectComposer>
  )
}

function FallbackScene() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#010101',
      }}
    >
      <img
        src="/ogimage.jpg"
        alt="Zustand Bear"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
  )
}

export default function Scene() {
  const [error, setError] = useState<Error | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // 使用useCallback来稳定回调函数引用
  const handleMousePositionChange = useCallback(
    (position: { x: number; y: number }) => {
      setMousePosition(position)
    },
    []
  )

  if (error) {
    return <FallbackScene />
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas
        onError={setError}
        onMousePositionChange={handleMousePositionChange}
      >
        <Experience />
        <Effects />
      </Canvas>
      <DialogBox
        loop={true}
        messages={LYRICS[0]}
        mousePosition={mousePosition}
      />
      <InfoBox mousePosition={mousePosition} parallaxIntensity={0.0075} />
    </div>
  )
}

// 定义Canvas组件的props类型
interface CanvasProps {
  children: ReactNode
  onError?: (error: Error) => void
  onMousePositionChange?: (position: { x: number; y: number }) => void
}

function Canvas({ children, onError, onMousePositionChange }: CanvasProps) {
  extend({ Mesh, PlaneGeometry, Group })
  const canvas = useRef<HTMLCanvasElement>(null)
  const root = useRef<any>(null)

  // 使用useCallback来稳定事件处理函数
  const handleMouseMove = useCallback(
    (event: DomEvent, state: RootState) => {
      const normalizedX = (event.clientX / state.size.width) * 2 - 1
      const normalizedY = -(event.clientY / state.size.height) * 2 + 1

      state.pointer.set(normalizedX, normalizedY)
      state.raycaster.setFromCamera(state.pointer, state.camera)

      // 将鼠标位置传递给外部组件
      onMousePositionChange?.({
        x: normalizedX,
        y: normalizedY,
      })
    },
    [onMousePositionChange]
  )

  useLayoutEffect(() => {
    try {
      if (!root.current && canvas.current) {
        root.current = createRoot(canvas.current).configure({
          events,
          orthographic: true,
          gl: { antialias: false },
          camera: { zoom: 5, position: [0, 0, 200], far: 300, near: 50 },
          onCreated: (state: RootState) => {
            const rootElement = document.getElementById('root')
            if (rootElement) {
              state.events.connect?.(rootElement)
            }
            state.setEvents({
              compute: handleMouseMove,
            })
          },
        })
      }

      const resize = () => {
        if (root.current) {
          root.current.configure({
            width: window.innerWidth,
            height: window.innerHeight,
          })
        }
      }

      window.addEventListener('resize', resize)
      if (root.current) {
        root.current.render(children)
      }

      return () => window.removeEventListener('resize', resize)
    } catch (e) {
      onError?.(e as Error)
    }
  }, [children, onError, onMousePositionChange, handleMouseMove])

  return (
    <canvas
      ref={canvas}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'block',
      }}
    />
  )
}
