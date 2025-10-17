import Details from './components/Details'
import Scene from './components/r3f/Scene'
import { RippleProvider } from './contexts/RippleContext'
import RippleRenderer from './components/r3f/RippleRenderer'
import LyricsAtmosphere from './components/atmosphere/LyricAtmosphere'
import AtomsphereContainer from './components/atmosphere/AtomsphereContainer'
import { isMobile } from './utils'

export default function App() {
  return (
    <RippleProvider>
      <Scene />
      <Details />
      {!isMobile() && (
        <AtomsphereContainer>
          <LyricsAtmosphere />
        </AtomsphereContainer>
      )}
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
