import About from '@/components/info-box/About'
import Contact from '@/components/info-box/Contact'
import Game from '@/components/info-box/Game'
import Animation from '@/components/info-box/Animation'
import Music from '@/components/info-box/Music'
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
      content: <About />,
    },
    {
      src: '/images/icon/contact.png',
      title: 'Contact',
      content: <Contact />,
    },
    {
      images: games.map(
        (game) =>
          `//media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
      ),
      title: 'Game',
      content: <Game />,
    },

    {
      images: artists.map((artist) => artist.picUrl),
      title: 'Music',
      content: <Music />,
    },
    {
      images: animations.map((animation) => animation.images.common),
      title: 'Animation',
      content: <Animation />,
    },
  ]
})
