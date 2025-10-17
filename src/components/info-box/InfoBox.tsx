import { TraceTransformHookProps, useTraceTransform } from '@/hooks/transform'
import InfoAvatar from './InfoAvatar'
import { memo, useCallback, useEffect, useState } from 'react'
import { useParentLayout } from '@/hooks/layout'
import { INFO_BOX } from '@/consts/layout'
import { useAtom } from 'jotai'
import { gameAtom } from '@/atoms/game'
import { infoAtom } from '@/atoms/info'
import { layoutAtom } from '@/atoms/layout'
import { artistAtom, musicAtom } from '@/atoms/music'
import { animationAtom } from '@/atoms/animation'

interface InfoBoxProps extends TraceTransformHookProps {}
const InfoBox = memo((props: InfoBoxProps) => {
  const { transformStyle } = useTraceTransform(props)
  const [index, setIndex] = useState(0)
  const { parentRef, parentWidth, parentHeight } =
    useParentLayout<HTMLDivElement>()
  const [infos] = useAtom(infoAtom)

  // 初始化游戏列表
  const [, setGames] = useAtom(gameAtom)
  const [layout, setLayout] = useAtom(layoutAtom)

  const getGames = useCallback(async () => {
    try {
      const res = await fetch('https://steam-api.yuzutea.org')
      const data = await res.json()
      const sortedGames = data.recently_games.games.sort(
        (a: any, b: any) => b.playtime_forever - a.playtime_forever
      )
      setGames(sortedGames)
    } catch (error) {
      console.error('获取游戏列表失败', error)
    }
  }, [setGames])

  // 初始化音乐列表
  const [, setMusic] = useAtom(musicAtom)
  const [, setArtists] = useAtom(artistAtom)
  const getMusic = useCallback(async () => {
    try {
      const res = await fetch(
        'https://ncm-api-exv6dxrlyq.yuzutea.org/listen/data/report'
      )
      const data = await res.json()

      const artists = data.data?.topArtistBlock?.sections
      const musicItems = data.data?.wallpaperBlock?.items?.slice(0, 5) || []
      setArtists(artists)
      setMusic(musicItems)
    } catch (error) {
      console.error('获取音乐列表失败', error)
    }
  }, [setArtists, setMusic])

  // 初始化动画列表
  const [, setAnimations] = useAtom(animationAtom)
  const getAnimations = useCallback(async () => {
    try {
      const res = await fetch(
        'https://bangumi-api.yuzutea.org/v0/users/1138478/collections?limit=30&offset=0'
      )
      const data = await res.json()
      setAnimations(data.data?.map((item: any) => item.subject) || [])
    } catch (error) {
      console.error('获取动画列表失败', error)
    }
  }, [setAnimations])

  useEffect(() => {
    getGames()
    getMusic()
    getAnimations()
  }, [])

  useEffect(() => {
    const rects = parentRef.current?.getClientRects()
    if (rects) {
      setLayout((prev) => ({
        ...prev,
        infoBoxRect: rects[0],
      }))
    }
  }, [])

  const baseHeight = 275
  const parentTopOffset =
    parentHeight > baseHeight ? baseHeight - parentHeight * 0.1 : baseHeight

  return (
    <div
      ref={parentRef}
      className="info-box"
      style={{ transform: transformStyle, top: parentTopOffset + 'px' }}
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
            <InfoAvatar
              key={item.title}
              alt={item.title}
              src={item.src}
              images={item.images}
              shape="rounded"
              onClick={() => setIndex(i)}
              size={INFO_BOX.iconWidth}
              showIndicators={false}
              showControls={false}
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
      <div className="content">{infos[index].content}</div>
    </div>
  )
})
export default InfoBox
