import { artistAtom, musicAtom } from '@/atoms/music'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import Avatar from '../Avatar'

export default function Music() {
  const [music, setMusic] = useAtom(musicAtom)
  const [, setArtists] = useAtom(artistAtom)
  const getMusic = async () => {
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
    getMusic()
  }, [setMusic])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {music.map((item) => (
        <div
          key={item.songId}
          style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
        >
          <Avatar src={item.picUrl} alt={item.songName} size="small" />
          <div>
            {item.songName}
            {item.artists.map((artist) => (
              <span key={artist.artistId}>{artist.artistName}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
