import { TraceTransformHookProps, useTraceTransform } from '@/hooks/transform'
import Avatar from '../Avatar'
import { memo, useCallback, useEffect, useState } from 'react'
import { useParentLayout } from '@/hooks/layout'
import { INFO_BOX } from '@/consts/layout'
import { useAtom } from 'jotai'
import { gameAtom } from '@/atoms/game'
import { infoAtom } from '@/atoms/info'
import { layoutAtom } from '@/atoms/layout'

interface InfoBoxProps extends TraceTransformHookProps {}
const InfoBox = memo((props: InfoBoxProps) => {
  const { transformStyle } = useTraceTransform(props)
  const [index, setIndex] = useState(0)
  const { parentRef, parentWidth } = useParentLayout<HTMLDivElement>()
  const [infos] = useAtom(infoAtom)

  // 初始化游戏列表
  const [, setGames] = useAtom(gameAtom)
  const [, setInfos] = useAtom(infoAtom)
  const [layout] = useAtom(layoutAtom)

  const getGames = useCallback(async () => {
    try {
      const res = await fetch('https://api.yuzutea.org/steam-web')
      const data = await res.json()
      const sortedGames = data.recently_games.games.sort(
        (a: any, b: any) => b.playtime_forever - a.playtime_forever
      )
      setGames(sortedGames)
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
      <div className="options" style={{ gap: layout.iconGap }}>
        {infos.map((item, i) => {
          const marginRight =
            (infos.length - i) * (layout.iconWidth + layout.iconGap) +
            layout.iconWidth
          const selectedTranslateX =
            parentWidth - marginRight + layout.iconWidth
          const unselectedTranslateX =
            i < index ? layout.iconWidth + layout.iconGap : 0

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
