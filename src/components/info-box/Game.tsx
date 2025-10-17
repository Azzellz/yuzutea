import { gameAtom } from '@/atoms/game'
import { Avatar } from 'antd'
import { useAtom } from 'jotai'

export default function GamePanel() {
  const [games] = useAtom(gameAtom)
  const avatarPrefix =
    '//media.steampowered.com/steamcommunity/public/images/apps/'
  return (
    <div className="panel">
      <h2>GAME</h2>
      <div className="content flex-col-list">
        {games.map((game) => (
          <div
            key={game.appid}
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <Avatar
              src={`${avatarPrefix}${game.appid}/${game.img_icon_url}.jpg`}
              alt={game.name}
              size={36}
              shape="square"
            />
            <span style={{ color: '#db42b4' }}>{game.name}</span>
            <span> - </span>
            <span style={{ color: '#51839c' }}>
              {Math.floor(game.playtime_forever / 60)}h
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
