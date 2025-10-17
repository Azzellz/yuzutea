import { artistAtom, musicAtom, Music, musicPlayerAtom } from '@/atoms/music'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { Avatar } from 'antd'
import { getMusicPlayer } from '@/utils/music'
import { Flex } from 'antd'
import {
  CaretRightOutlined,
  PauseOutlined,
  UndoOutlined,
} from '@ant-design/icons'

function MusicLine({
  item,
  onClick,
  isActive,
}: {
  item: Music
  isActive: boolean
  onClick: (musicId: number) => void
}) {
  return (
    <div
      key={item.songId}
      style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        cursor: 'pointer',
      }}
      onClick={() => onClick(item.songId)}
    >
      <Avatar src={item.picUrl} alt={item.songName} size={36} shape="square" />
      <div>
        <span style={{ color: isActive ? 'orange' : '#f8c1fa' }}>
          {item.songName}
        </span>
        <span> - </span>
        {item.artists.map((artist) => (
          <span key={artist.artistId} style={{ color: '#9982D4' }}>
            {artist.artistName}
          </span>
        ))}
      </div>
    </div>
  )
}

function MusicControls() {
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
    <Flex style={{ marginTop: '-6px' }} gap={12}>
      {musicPlayer.status === 'playing' ? (
        <PauseOutlined style={{ fontSize: 28 }} onClick={handlePauseMusic} />
      ) : (
        <CaretRightOutlined
          style={{ fontSize: 28 }}
          onClick={handleStartMusic}
        />
      )}
      <UndoOutlined style={{ fontSize: 22 }} onClick={handleRestartMusic} />
    </Flex>
  )
}

export default function MusicPanel() {
  const [music, setMusic] = useAtom(musicAtom)
  const [musicPlayer, setMusicPlayer] = useAtom(musicPlayerAtom)
  const [, setArtists] = useAtom(artistAtom)
  const getMusicList = async () => {
    try {
      const res = await fetch(
        'https://ncm-api-exv6dxrlyq.yuzutea.org/listen/data/report'
      )
      const data = await res.json()

      setArtists(data.data?.topArtistBlock?.sections)
      setMusic(data.data?.wallpaperBlock?.items?.slice(0, 5) || [])
    } catch (error) {
      console.error('获取音乐列表失败', error)
    }
  }
  useEffect(() => {
    getMusicList()
  }, [setMusic])

  async function handlePlayMusic(musicId: number) {
    // 删除之前的音乐播放器
    if (musicPlayer) {
      musicPlayer.audio.pause()
      musicPlayer.audio.currentTime = 0
      musicPlayer.audio.remove()
    }

    // 获取新的音乐播放器
    const player = await getMusicPlayer(musicId)
    setMusicPlayer(player)
    if (player.audio) {
      player.audio.play()
    }

    // 加载完成后修改状态
    const handleCanPlay = () => {
      setMusicPlayer({ ...player, status: 'playing' })
      player.audio.removeEventListener('canplay', handleCanPlay)
    }
    player.audio.addEventListener('canplay', handleCanPlay)
  }

  return (
    <div className="panel">
      <Flex align="center" gap={12}>
        <h2>MUSIC</h2>
        <MusicControls />
      </Flex>

      <div className="content flex-col-list">
        {music.map((item) => (
          <MusicLine
            key={item.songId}
            item={item}
            onClick={handlePlayMusic}
            isActive={item.songId === musicPlayer?.songId}
          />
        ))}
      </div>
    </div>
  )
}
