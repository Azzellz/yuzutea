import { artistAtom, musicAtom, musicPlayerAtom } from '@/atoms/music'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { getMusicPlayer } from '@/utils/music'
import { Flex } from 'antd'
import MusicLine from './MusicLine'
import MusicControls from './MusicControls'

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

      <div className="content flex-v">
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
