import { atom } from 'jotai'

function getIconWidth() {
  return Math.min(Math.floor(document.documentElement.clientWidth / 10), 50)
}
function getIconGap() {
  return Math.min(Math.floor(document.documentElement.clientWidth / 50), 10)
}

interface Layout {
  iconWidth: number
  iconGap: number
  dialogBoxRect: DOMRect | null
  infoBoxRect: DOMRect | null
}
export const layoutAtom = atom<Layout>({
  iconWidth: getIconWidth(),
  iconGap: getIconGap(),
  dialogBoxRect: null,
  infoBoxRect: null,
})
