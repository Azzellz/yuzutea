import { TraceTransformHookProps, useTraceTransform } from '@/hooks/transform'
import Avatar from './Avatar'
import { memo, useEffect, useState } from 'react'
import { useTyped } from '@/hooks/typed'
import { useParentLayout } from '@/hooks/layout'
import { INFO_BOX } from '@/consts/layout'

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
  const url = '//api.yuzutea.org/steam-web'
  const [games, setGames] = useState<Game[]>([])
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setGames(data.recently_games.games)
      })
  }, [])
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

interface InfoBoxProps extends TraceTransformHookProps {}
const InfoBox = memo((props: InfoBoxProps) => {
  const { transformStyle } = useTraceTransform(props)
  const [index, setIndex] = useState(0)
  const { parentRef, parentWidth } = useParentLayout<HTMLDivElement>()

  return (
    <div
      ref={parentRef}
      className="info-box"
      style={{ transform: transformStyle }}
    >
      <div className="options">
        {infoList.map((item, i) => {
          const marginRight =
            (infoList.length - i) * (INFO_BOX.iconWidth + INFO_BOX.iconGap) +
            INFO_BOX.iconWidth
          const selectedTranslateX =
            parentWidth - marginRight + 2 * INFO_BOX.padding
          const unselectedTranslateX =
            i < index ? INFO_BOX.iconWidth + INFO_BOX.iconGap : 0

          return (
            <Avatar
              key={item.title}
              alt={item.title}
              src={item.avatar}
              shape="rounded"
              onClick={() => setIndex(i)}
              size={INFO_BOX.iconWidth}
              style={{
                border: index === i ? '2px solid #fff' : 'none',
                transition: 'all 0.3s ease-out',
                transform:
                  index === i
                    ? `translateX(-${selectedTranslateX}px) scale(${INFO_BOX.iconScale})`
                    : `translateX(${
                        i < index ? `${unselectedTranslateX}px` : 0
                      })`,
              }}
            />
          )
        })}
      </div>
      <div className="title">
        <h2>{infoList[index].title}</h2>
      </div>
      <div className="content">{infoList[index].content}</div>
    </div>
  )
})
export default InfoBox
