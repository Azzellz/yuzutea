import { extend } from '@react-three/fiber'
import { Object3D } from 'three'
import * as THREE from 'three'

// 扩展 JSX 元素类型以支持 Three.js 对象
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // ========== 几何体 ==========
      // 基础几何体
      boxGeometry: ReactThreeFiber.Object3DNode<
        THREE.BoxGeometry,
        typeof THREE.BoxGeometry
      >
      sphereGeometry: ReactThreeFiber.Object3DNode<
        THREE.SphereGeometry,
        typeof THREE.SphereGeometry
      >
      planeGeometry: ReactThreeFiber.Object3DNode<
        THREE.PlaneGeometry,
        typeof THREE.PlaneGeometry
      >
      cylinderGeometry: ReactThreeFiber.Object3DNode<
        THREE.CylinderGeometry,
        typeof THREE.CylinderGeometry
      >
      coneGeometry: ReactThreeFiber.Object3DNode<
        THREE.ConeGeometry,
        typeof THREE.ConeGeometry
      >
      torusGeometry: ReactThreeFiber.Object3DNode<
        THREE.TorusGeometry,
        typeof THREE.TorusGeometry
      >
      torusKnotGeometry: ReactThreeFiber.Object3DNode<
        THREE.TorusKnotGeometry,
        typeof THREE.TorusKnotGeometry
      >
      circleGeometry: ReactThreeFiber.Object3DNode<
        THREE.CircleGeometry,
        typeof THREE.CircleGeometry
      >
      ringGeometry: ReactThreeFiber.Object3DNode<
        THREE.RingGeometry,
        typeof THREE.RingGeometry
      >
      dodecahedronGeometry: ReactThreeFiber.Object3DNode<
        THREE.DodecahedronGeometry,
        typeof THREE.DodecahedronGeometry
      >
      icosahedronGeometry: ReactThreeFiber.Object3DNode<
        THREE.IcosahedronGeometry,
        typeof THREE.IcosahedronGeometry
      >
      octahedronGeometry: ReactThreeFiber.Object3DNode<
        THREE.OctahedronGeometry,
        typeof THREE.OctahedronGeometry
      >
      tetrahedronGeometry: ReactThreeFiber.Object3DNode<
        THREE.TetrahedronGeometry,
        typeof THREE.TetrahedronGeometry
      >
      bufferGeometry: ReactThreeFiber.Object3DNode<
        THREE.BufferGeometry,
        typeof THREE.BufferGeometry
      >
      instancedBufferGeometry: ReactThreeFiber.Object3DNode<
        THREE.InstancedBufferGeometry,
        typeof THREE.InstancedBufferGeometry
      >
      extrudeGeometry: ReactThreeFiber.Object3DNode<
        THREE.ExtrudeGeometry,
        typeof THREE.ExtrudeGeometry
      >
      latheGeometry: ReactThreeFiber.Object3DNode<
        THREE.LatheGeometry,
        typeof THREE.LatheGeometry
      >
      parametricGeometry: ReactThreeFiber.Object3DNode<
        THREE.ParametricGeometry,
        typeof THREE.ParametricGeometry
      >
      shapeGeometry: ReactThreeFiber.Object3DNode<
        THREE.ShapeGeometry,
        typeof THREE.ShapeGeometry
      >
      tubeGeometry: ReactThreeFiber.Object3DNode<
        THREE.TubeGeometry,
        typeof THREE.TubeGeometry
      >
      edgesGeometry: ReactThreeFiber.Object3DNode<
        THREE.EdgesGeometry,
        typeof THREE.EdgesGeometry
      >
      wireframeGeometry: ReactThreeFiber.Object3DNode<
        THREE.WireframeGeometry,
        typeof THREE.WireframeGeometry
      >

      // ========== 材质 ==========
      meshBasicMaterial: ReactThreeFiber.Object3DNode<
        THREE.MeshBasicMaterial,
        typeof THREE.MeshBasicMaterial
      >
      meshStandardMaterial: ReactThreeFiber.Object3DNode<
        THREE.MeshStandardMaterial,
        typeof THREE.MeshStandardMaterial
      >
      meshPhongMaterial: ReactThreeFiber.Object3DNode<
        THREE.MeshPhongMaterial,
        typeof THREE.MeshPhongMaterial
      >
      meshLambertMaterial: ReactThreeFiber.Object3DNode<
        THREE.MeshLambertMaterial,
        typeof THREE.MeshLambertMaterial
      >
      meshPhysicalMaterial: ReactThreeFiber.Object3DNode<
        THREE.MeshPhysicalMaterial,
        typeof THREE.MeshPhysicalMaterial
      >
      meshToonMaterial: ReactThreeFiber.Object3DNode<
        THREE.MeshToonMaterial,
        typeof THREE.MeshToonMaterial
      >
      meshNormalMaterial: ReactThreeFiber.Object3DNode<
        THREE.MeshNormalMaterial,
        typeof THREE.MeshNormalMaterial
      >
      meshMatcapMaterial: ReactThreeFiber.Object3DNode<
        THREE.MeshMatcapMaterial,
        typeof THREE.MeshMatcapMaterial
      >
      meshDepthMaterial: ReactThreeFiber.Object3DNode<
        THREE.MeshDepthMaterial,
        typeof THREE.MeshDepthMaterial
      >
      meshDistanceMaterial: ReactThreeFiber.Object3DNode<
        THREE.MeshDistanceMaterial,
        typeof THREE.MeshDistanceMaterial
      >
      lineBasicMaterial: ReactThreeFiber.Object3DNode<
        THREE.LineBasicMaterial,
        typeof THREE.LineBasicMaterial
      >
      lineDashedMaterial: ReactThreeFiber.Object3DNode<
        THREE.LineDashedMaterial,
        typeof THREE.LineDashedMaterial
      >
      pointsMaterial: ReactThreeFiber.Object3DNode<
        THREE.PointsMaterial,
        typeof THREE.PointsMaterial
      >
      spriteMaterial: ReactThreeFiber.Object3DNode<
        THREE.SpriteMaterial,
        typeof THREE.SpriteMaterial
      >
      shadowMaterial: ReactThreeFiber.Object3DNode<
        THREE.ShadowMaterial,
        typeof THREE.ShadowMaterial
      >
      shaderMaterial: ReactThreeFiber.Object3DNode<
        THREE.ShaderMaterial,
        typeof THREE.ShaderMaterial
      >
      rawShaderMaterial: ReactThreeFiber.Object3DNode<
        THREE.RawShaderMaterial,
        typeof THREE.RawShaderMaterial
      >

      // ========== 网格和对象 ==========
      mesh: ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>
      instancedMesh: ReactThreeFiber.Object3DNode<
        THREE.InstancedMesh,
        typeof THREE.InstancedMesh
      >
      skinnedMesh: ReactThreeFiber.Object3DNode<
        THREE.SkinnedMesh,
        typeof THREE.SkinnedMesh
      >
      group: ReactThreeFiber.Object3DNode<THREE.Group, typeof THREE.Group>
      object3D: ReactThreeFiber.Object3DNode<
        THREE.Object3D,
        typeof THREE.Object3D
      >
      scene: ReactThreeFiber.Object3DNode<THREE.Scene, typeof THREE.Scene>
      sprite: ReactThreeFiber.Object3DNode<THREE.Sprite, typeof THREE.Sprite>
      lOD: ReactThreeFiber.Object3DNode<THREE.LOD, typeof THREE.LOD>
      line: ReactThreeFiber.Object3DNode<THREE.Line, typeof THREE.Line>
      lineLoop: ReactThreeFiber.Object3DNode<
        THREE.LineLoop,
        typeof THREE.LineLoop
      >
      lineSegments: ReactThreeFiber.Object3DNode<
        THREE.LineSegments,
        typeof THREE.LineSegments
      >
      points: ReactThreeFiber.Object3DNode<THREE.Points, typeof THREE.Points>
      bone: ReactThreeFiber.Object3DNode<THREE.Bone, typeof THREE.Bone>
      skeleton: ReactThreeFiber.Object3DNode<
        THREE.Skeleton,
        typeof THREE.Skeleton
      >

      // ========== 灯光 ==========
      ambientLight: ReactThreeFiber.Object3DNode<
        THREE.AmbientLight,
        typeof THREE.AmbientLight
      >
      directionalLight: ReactThreeFiber.Object3DNode<
        THREE.DirectionalLight,
        typeof THREE.DirectionalLight
      >
      pointLight: ReactThreeFiber.Object3DNode<
        THREE.PointLight,
        typeof THREE.PointLight
      >
      spotLight: ReactThreeFiber.Object3DNode<
        THREE.SpotLight,
        typeof THREE.SpotLight
      >
      hemisphereLight: ReactThreeFiber.Object3DNode<
        THREE.HemisphereLight,
        typeof THREE.HemisphereLight
      >
      rectAreaLight: ReactThreeFiber.Object3DNode<
        THREE.RectAreaLight,
        typeof THREE.RectAreaLight
      >
      lightProbe: ReactThreeFiber.Object3DNode<
        THREE.LightProbe,
        typeof THREE.LightProbe
      >

      // ========== 相机 ==========
      perspectiveCamera: ReactThreeFiber.Object3DNode<
        THREE.PerspectiveCamera,
        typeof THREE.PerspectiveCamera
      >
      orthographicCamera: ReactThreeFiber.Object3DNode<
        THREE.OrthographicCamera,
        typeof THREE.OrthographicCamera
      >
      arrayCamera: ReactThreeFiber.Object3DNode<
        THREE.ArrayCamera,
        typeof THREE.ArrayCamera
      >
      cubeCamera: ReactThreeFiber.Object3DNode<
        THREE.CubeCamera,
        typeof THREE.CubeCamera
      >
      stereoCamera: ReactThreeFiber.Object3DNode<
        THREE.StereoCamera,
        typeof THREE.StereoCamera
      >

      // ========== 辅助对象 ==========
      axesHelper: ReactThreeFiber.Object3DNode<
        THREE.AxesHelper,
        typeof THREE.AxesHelper
      >
      arrowHelper: ReactThreeFiber.Object3DNode<
        THREE.ArrowHelper,
        typeof THREE.ArrowHelper
      >
      boxHelper: ReactThreeFiber.Object3DNode<
        THREE.BoxHelper,
        typeof THREE.BoxHelper
      >
      box3Helper: ReactThreeFiber.Object3DNode<
        THREE.Box3Helper,
        typeof THREE.Box3Helper
      >
      cameraHelper: ReactThreeFiber.Object3DNode<
        THREE.CameraHelper,
        typeof THREE.CameraHelper
      >
      directionalLightHelper: ReactThreeFiber.Object3DNode<
        THREE.DirectionalLightHelper,
        typeof THREE.DirectionalLightHelper
      >
      gridHelper: ReactThreeFiber.Object3DNode<
        THREE.GridHelper,
        typeof THREE.GridHelper
      >
      polarGridHelper: ReactThreeFiber.Object3DNode<
        THREE.PolarGridHelper,
        typeof THREE.PolarGridHelper
      >
      hemisphereLightHelper: ReactThreeFiber.Object3DNode<
        THREE.HemisphereLightHelper,
        typeof THREE.HemisphereLightHelper
      >
      planeHelper: ReactThreeFiber.Object3DNode<
        THREE.PlaneHelper,
        typeof THREE.PlaneHelper
      >
      pointLightHelper: ReactThreeFiber.Object3DNode<
        THREE.PointLightHelper,
        typeof THREE.PointLightHelper
      >
      skeletonHelper: ReactThreeFiber.Object3DNode<
        THREE.SkeletonHelper,
        typeof THREE.SkeletonHelper
      >
      spotLightHelper: ReactThreeFiber.Object3DNode<
        THREE.SpotLightHelper,
        typeof THREE.SpotLightHelper
      >

      // ========== 纹理 ==========
      texture: ReactThreeFiber.Object3DNode<THREE.Texture, typeof THREE.Texture>
      canvasTexture: ReactThreeFiber.Object3DNode<
        THREE.CanvasTexture,
        typeof THREE.CanvasTexture
      >
      compressedTexture: ReactThreeFiber.Object3DNode<
        THREE.CompressedTexture,
        typeof THREE.CompressedTexture
      >
      cubeTexture: ReactThreeFiber.Object3DNode<
        THREE.CubeTexture,
        typeof THREE.CubeTexture
      >
      dataTexture: ReactThreeFiber.Object3DNode<
        THREE.DataTexture,
        typeof THREE.DataTexture
      >
      dataTexture2DArray: ReactThreeFiber.Object3DNode<
        THREE.DataTexture2DArray,
        typeof THREE.DataTexture2DArray
      >
      dataTexture3D: ReactThreeFiber.Object3DNode<
        THREE.DataTexture3D,
        typeof THREE.DataTexture3D
      >
      depthTexture: ReactThreeFiber.Object3DNode<
        THREE.DepthTexture,
        typeof THREE.DepthTexture
      >
      videoTexture: ReactThreeFiber.Object3DNode<
        THREE.VideoTexture,
        typeof THREE.VideoTexture
      >

      // ========== 控制器和动画 ==========
      animationMixer: ReactThreeFiber.Object3DNode<
        THREE.AnimationMixer,
        typeof THREE.AnimationMixer
      >
      keyframeTrack: ReactThreeFiber.Object3DNode<
        THREE.KeyframeTrack,
        typeof THREE.KeyframeTrack
      >
      animationClip: ReactThreeFiber.Object3DNode<
        THREE.AnimationClip,
        typeof THREE.AnimationClip
      >

      // ========== MeshLine 扩展 ==========
      meshLineGeometry: ReactThreeFiber.Object3DNode<any, any>
      meshLineMaterial: ReactThreeFiber.Object3DNode<any, any>
    }
  }
}

// 为自定义材质和扩展提供类型支持
declare module '@react-three/fiber' {
  interface ThreeElements {
    // 自定义材质
    layerMaterial: Object3DNode<any, any>
    
    // MeshLine 扩展
    meshLineGeometry: Object3DNode<any, any>
    meshLineMaterial: Object3DNode<any, any>
    
    // 其他常用扩展
    instancedBufferAttribute: Object3DNode<any, any>
    bufferAttribute: Object3DNode<any, any>
    
    // 后处理相关
    effectComposer: Object3DNode<any, any>
    renderPass: Object3DNode<any, any>
    shaderPass: Object3DNode<any, any>
    bloomPass: Object3DNode<any, any>
    filmPass: Object3DNode<any, any>
    dotScreenPass: Object3DNode<any, any>
    glitchPass: Object3DNode<any, any>
    maskPass: Object3DNode<any, any>
    copyShader: Object3DNode<any, any>
    
    // 物理引擎相关
    rigidBody: Object3DNode<any, any>
    collider: Object3DNode<any, any>
    
    // 音频相关
    audio: Object3DNode<any, any>
    positionalAudio: Object3DNode<any, any>
    audioListener: Object3DNode<any, any>
    
    // 其他实用组件
    html: Object3DNode<any, any>
    text: Object3DNode<any, any>
    billboard: Object3DNode<any, any>
    image: Object3DNode<any, any>
    plane: Object3DNode<any, any>
    box: Object3DNode<any, any>
    sphere: Object3DNode<any, any>
    cylinder: Object3DNode<any, any>
    cone: Object3DNode<any, any>
    torus: Object3DNode<any, any>
    torusKnot: Object3DNode<any, any>
    circle: Object3DNode<any, any>
    ring: Object3DNode<any, any>
    tube: Object3DNode<any, any>
    extrude: Object3DNode<any, any>
    lathe: Object3DNode<any, any>
    parametric: Object3DNode<any, any>
    tetrahedron: Object3DNode<any, any>
    octahedron: Object3DNode<any, any>
    dodecahedron: Object3DNode<any, any>
    icosahedron: Object3DNode<any, any>
  }
}

export {}
