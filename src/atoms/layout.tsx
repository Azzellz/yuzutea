import { atom } from 'jotai'

function getIconWidth() {
  return Math.min(Math.floor(document.documentElement.clientWidth / 10), 50)
}
function getIconGap() {
  return Math.min(Math.floor(document.documentElement.clientWidth / 50), 10)
}

export const layoutAtom = atom({
  iconWidth: getIconWidth(),
  iconGap: getIconGap(),
})
