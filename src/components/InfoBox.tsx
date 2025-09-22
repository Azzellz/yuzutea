import { TransformHookProps, useTransform } from '@/hooks/transform'
import Avatar from './Avatar'
import { memo, useEffect, useState } from 'react'
import { useTyped } from '@/hooks/typed'

function About() {
  const { el } = useTyped({
    messages: [
      'Yuzutea^1000\nA FE-Programmer, love ACGN culture.^1000\nずっと真夜中でいいのに。',
    ],
  })
  return (
    <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
      <span ref={el}></span>
    </div>
  )
}

function Contact() {
  const { el } = useTyped({
    messages: ['Email: flin00806@gmail.com'],
  })
  return (
    <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
      <span ref={el}></span>
    </div>
  )
}

function Animation() {
  const { el } = useTyped({
    messages: [
      '1.FULLMETAL ALCHEMIST: ^500 ♥♥♥♥♥\n2.Made in abyss: ^500 ♥♥♥♥♥',
    ],
  })
  return (
    <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
      <span ref={el}></span>
    </div>
  )
}

interface Game {
  appid: string
  name: string
  img_icon_url: string
  playtime_forever: number
}
function Game() {
  const url = 'https://api.yuzutea.org/steam-web'
  const [games, setGames] = useState<Game[]>([])
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setGames(data.recently_games.games)
      })
  }, [games])
  const sortedGames = games.sort(
    (a, b) => b.playtime_forever - a.playtime_forever
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {sortedGames.map((game) => (
        <div
          key={game.appid}
          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <Avatar
            src={`//media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
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

const infoList = [
  {
    avatar: '/images/avatar-about.png',
    title: 'About',
    content: <About />,
  },
  {
    avatar: '',
    title: 'Contact',
    content: <Contact />,
  },
  {
    avatar: '',
    title: 'Game',
    content: <Game />,
  },
  {
    // avatar: '/images/avatar-animation.png',
    title: 'Animation',
    content: <Animation />,
  },
  {
    avatar: '/images/avatar-music.png',
    title: 'Music',
    content: 'Favorite musics',
  },
]

interface InfoBoxProps extends TransformHookProps {}
const InfoBox = memo((props: InfoBoxProps) => {
  const { transformStyle } = useTransform(props)
  const [index, setIndex] = useState(0)

  return (
    <div className="info-box" style={{ transform: transformStyle }}>
      <div className="options">
        {infoList.map((item, i) => (
          <Avatar
            src={item.avatar}
            alt={item.title}
            shape="rounded"
            onClick={() => setIndex(i)}
            size={50}
            style={{
              border: index === i ? '2px solid #fff' : 'none',
              transition: 'all 0.3s ease-out',
              transform:
                index === i
                  ? `translateX(-${i * (50 + 10) + 100}px) scale(1.5)`
                  : `translateX(${i < index ? `calc(50px + 10px)` : 0})`,
            }}
          />
        ))}
      </div>
      <div className="title">
        <h2>{infoList[index].title}</h2>
      </div>
      <div className="content">{infoList[index].content}</div>
    </div>
  )
})
export default InfoBox
