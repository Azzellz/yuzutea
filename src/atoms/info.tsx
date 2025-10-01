import About from '@/components/info-box/About'
import Contact from '@/components/info-box/Contact'
import Game from '@/components/info-box/Game'
import Animation from '@/components/info-box/Animation'
import { atom } from 'jotai'

export const infoAtom = atom([
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
