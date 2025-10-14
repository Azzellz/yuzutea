import { atom } from 'jotai'

export interface Animation {
  images: {
    small: string
    grid: string
    large: string
    medium: string
    common: string
  }
  name: string
  name_cn: string
  short_summary: string
  tags: {
    name: string
    count: number
  }[]
  score: number
  rank: number
  collection_total: number
  eps: number
  id: number
  volumns: number
}
export const animationAtom = atom<Animation[]>([])
