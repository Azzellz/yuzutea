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
      <div className="content flex-v">
        {games.map((game) => (
          <div
            key={game.appid}
            className="flex-h-center pointer"
            onClick={() => {
              window.open(`https://store.steampowered.com/app/${game.appid}`)
            }}
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
