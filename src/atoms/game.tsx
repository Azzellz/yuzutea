import { atom } from 'jotai'

export interface Game {
  appid: string
  name: string
  img_icon_url: string
  playtime_forever: number
}
export const gameAtom = atom<Game[]>([])
