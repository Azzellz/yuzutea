import { Music } from '@/atoms/music'
import { Avatar } from 'antd'

export default function MusicLine({
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
