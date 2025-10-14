import { atom } from 'jotai'

export interface Music {
  songId: number
  songName: string
  artists: {
    artistId: number
    artistName: string
  }[]
  picId: number
  picUrl: string
}
export interface Artist {
  artistId: number
  artistName: string
  picUrl: string
}
export const musicAtom = atom<Music[]>([])
export const artistAtom = atom<Artist[]>([])
