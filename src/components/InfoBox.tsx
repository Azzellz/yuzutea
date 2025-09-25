import { TraceTransformHookProps, useTraceTransform } from '@/hooks/transform'
import Avatar from './Avatar'
import { memo, useCallback, useEffect, useState } from 'react'
import { useTyped } from '@/hooks/typed'
import { useParentLayout } from '@/hooks/layout'
import { INFO_BOX } from '@/consts/layout'
import { atom, useAtom } from 'jotai'
import { Popover } from 'antd'

function About() {
  const { el } = useTyped({
    messages: [
      'Yuzutea^1000\nA FE-Programmer, love ACGN culture.^1000\nずっとプログラミングでいいのに。',
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 10,
        }}
      >
        <Popover
          content={<img src="/images/qrcode/qq.png" alt="qq" width={100} />}
        >
          <img src="/images/icon/qq.png" alt="qq" width={20} />
        </Popover>
        <Popover
          content={
            <img src="/images/qrcode/wechat.jpg" alt="wechat" width={100} />
          }
        >
          <img src="/images/icon/wechat.png" alt="wechat" width={25} />
        </Popover>
      </div>
      <span ref={el}></span>
    </div>
  )
}

function Animation() {
  const { el } = useTyped({
    messages: [
      '1.FULLMETAL ALCHEMIST: ^500 ♥♥♥♥♥\n2.Made in abyss: ^500 ♥♥♥♥♥\n3.Overload: ^500 ♥♥♥♥♥\n4.Ajin: ^500 ♥♥♥♥♥',
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
const gameAtom = atom<Game[]>([])

function Game() {
  const [games] = useAtom(gameAtom)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {games.map((game) => (
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

interface InfoBoxProps extends TraceTransformHookProps {}
const infoAtom = atom([
  {
    src: '/images/icon/about.png',
    title: 'About',
    content: <About />,
  },
  {
    src: '/images/icon/contact.png',
    title: 'Contact',
    content: <Contact />,
  },
  {
    title: 'Game',
    content: <Game />,
  },
  {
    images: [
      '/images/icon/animation01.png',
      '/images/icon/animation02.png',
      '/images/icon/animation03.png',
      '/images/icon/animation04.png',
    ],
    title: 'Animation',
    content: <Animation />,
  },
  {
    images: [
      '/images/icon/music01.png',
      '/images/icon/music02.png',
      '/images/icon/music03.png',
      '/images/icon/music04.png',
    ],
    title: 'Music',
    content: 'Favorite musics',
  },
])
const InfoBox = memo((props: InfoBoxProps) => {
  const { transformStyle } = useTraceTransform(props)
  const [index, setIndex] = useState(0)
  const { parentRef, parentWidth } = useParentLayout<HTMLDivElement>()
  const [infos] = useAtom(infoAtom)

  // 初始化游戏列表
  const [, setGames] = useAtom(gameAtom)
  const [, setInfos] = useAtom(infoAtom)
  const getGames = useCallback(async () => {
    try {
      const res = await fetch('//api.yuzutea.org/steam-web')
      const data = await res.json()
      const sortedGames = data.recently_games.games.sort(
        (a: any, b: any) => b.playtime_forever - a.playtime_forever
      )
      setInfos((prev) => {
        return prev.map((item) => {
          if (item.title === 'Game') {
            return {
              ...item,
              images: sortedGames.map(
                (game: any) =>
                  `//media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
              ),
            }
          }
          return item
        })
      })
      setGames(sortedGames)
    } catch (error) {
      console.error('获取游戏列表失败', error)
    }
  }, [setGames])
  useEffect(() => {
    getGames()
  }, [getGames])

  return (
    <div
      ref={parentRef}
      className="info-box"
      style={{ transform: transformStyle }}
    >
      <div className="options">
        {infos.map((item, i) => {
          const marginRight =
            (infos.length - i) * (INFO_BOX.iconWidth + INFO_BOX.iconGap) +
            INFO_BOX.iconWidth
          const selectedTranslateX =
            parentWidth - marginRight + 2 * INFO_BOX.padding
          const unselectedTranslateX =
            i < index ? INFO_BOX.iconWidth + INFO_BOX.iconGap : 0

          return (
            <Avatar
              key={item.title}
              alt={item.title}
              src={item.src}
              images={item.images}
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
        <h2>{infos[index].title}</h2>
      </div>
      <div className="content">{infos[index].content}</div>
    </div>
  )
})
export default InfoBox
