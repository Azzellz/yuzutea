import { artistAtom, musicAtom, Music } from '@/atoms/music'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import Avatar from '../Avatar'
import { getMusic } from '@/utils/music'

function MusicLine({
  item,
  onClick,
}: {
  item: Music
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
        <span style={{ color: '#f8c1fa' }}>{item.songName}</span>
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

export default function MusicPanel() {
  const [music, setMusic] = useAtom(musicAtom)
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
    const { audio } = await getMusic(musicId)
    if (audio) {
      audio.play()
    }
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {music.map((item) => (
        <MusicLine key={item.songId} item={item} onClick={handlePlayMusic} />
      ))}
    </div>
  )
}
