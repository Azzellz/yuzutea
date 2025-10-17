import { musicPlayerAtom } from '@/atoms/music'
import {
  PauseOutlined,
  CaretRightOutlined,
  UndoOutlined,
} from '@ant-design/icons'
import { Flex } from 'antd'
import { useAtom } from 'jotai'
import MusicProgressBar from './MusicProgressBar'

export default function MusicControls() {
  const [musicPlayer, setMusicPlayer] = useAtom(musicPlayerAtom)

  function handleStartMusic() {
    if (musicPlayer && musicPlayer.audio) {
      musicPlayer.audio.play()
      setMusicPlayer({ ...musicPlayer, status: 'playing' })
    }
  }

  function handlePauseMusic() {
    if (musicPlayer && musicPlayer.audio) {
      musicPlayer.audio.pause()
      setMusicPlayer({ ...musicPlayer, status: 'paused' })
    }
  }

  function handleRestartMusic() {
    if (musicPlayer && musicPlayer.audio) {
      musicPlayer.audio.currentTime = 0
      handleStartMusic()
    }
  }

  if (!musicPlayer || !musicPlayer.audio) {
    return null
  }
  if (musicPlayer.status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <Flex className="w-full" style={{ marginTop: '-6px' }} gap={4}>
      {musicPlayer.status === 'playing' ? (
        <PauseOutlined style={{ fontSize: 28 }} onClick={handlePauseMusic} />
      ) : (
        <CaretRightOutlined
          style={{ fontSize: 28 }}
          onClick={handleStartMusic}
        />
      )}
      <UndoOutlined style={{ fontSize: 22 }} onClick={handleRestartMusic} />
      <MusicProgressBar
        className="w-full"
        style={{ marginTop: '26px', marginLeft: '10px' }}
      />
    </Flex>
  )
}
