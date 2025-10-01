import Details from './components/Details'
import Scene from './components/Scene'
import { RippleProvider } from './contexts/RippleContext'
import RippleRenderer from './components/RippleRenderer'

export default function App() {

  return (
    <RippleProvider>
      <Scene />
      <Details />
      {/* <AudioVisualizerDemo /> */}
      <RippleRenderer
        enableClick={true}
        clickOptions={{
          color: 'white',
          duration: 1200,
          size: 15,
          pixelStyle: true,
          pixelSize: 4,
        }}
      />
    </RippleProvider>
  )
}
