import AboutPanel from '@/components/info-box/About'
import ContactPanel from '@/components/info-box/Contact'
import GamePanel from '@/components/info-box/Game'
import AnimationPanel from '@/components/info-box/Animation'
import MusicPanel from '@/components/info-box/Music'
import { atom } from 'jotai'
import { gameAtom } from './game'
import { artistAtom } from './music'
import { animationAtom } from './animation'

export const infoAtom = atom((get) => {
  const games = get(gameAtom)
  const artists = get(artistAtom)
  const animations = get(animationAtom)

  return [
    {
      src: '/images/icon/about.png',
      title: 'About',
      content: <AboutPanel />,
    },
    {
      src: '/images/icon/contact.png',
      title: 'Contact',
      content: <ContactPanel />,
    },
    {
      images: games.map(
        (game) =>
          `//media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
      ),
      title: 'Game',
      content: <GamePanel />,
    },

    {
      images: artists.map((artist) => artist.picUrl),
      title: 'Music',
      content: <MusicPanel />,
    },
    {
      images: animations.map((animation) => animation.images.common),
      title: 'Animation',
      content: <AnimationPanel />,
    },
  ]
})
