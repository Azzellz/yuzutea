import { gameAtom } from '@/atoms/game'
import Avatar from '../Avatar'
import { useAtom } from 'jotai'

export default function Game() {
  const [games] = useAtom(gameAtom)
  const avatarPrefix =
    '//media.steampowered.com/steamcommunity/public/images/apps/'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {games.map((game) => (
        <div
          key={game.appid}
          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <Avatar
            src={`${avatarPrefix}${game.appid}/${game.img_icon_url}.jpg`}
            alt={game.name}
            size="small"
            shape="rounded"
          />
          <span>{game.name}</span>
          <span> - </span>
          <span>{Math.floor(game.playtime_forever / 60)}h</span>
        </div>
      ))}
    </div>
  )
}
