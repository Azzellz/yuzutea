import About from '@/components/info-box/About'
import Contact from '@/components/info-box/Contact'
import Game from '@/components/info-box/Game'
import Animation from '@/components/info-box/Animation'
import Music from '@/components/info-box/Music'
import { atom } from 'jotai'
import { gameAtom } from './game'
import { artistAtom } from './music'

export const infoAtom = atom((get) => {
  const games = get(gameAtom)
  const artists = get(artistAtom)
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
      images: artists.map((artist) => artist.picUrl),
      title: 'Music',
      content: <Music />,
    },
  ]
})
