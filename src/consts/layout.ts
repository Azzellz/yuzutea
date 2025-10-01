function getIconWidth() {
  return Math.min(Math.floor(document.documentElement.clientWidth / 10), 50)
}
function getIconGap() {
  return Math.min(Math.floor(document.documentElement.clientWidth / 50), 10)
}

export const INFO_BOX = {
  iconWidth: getIconWidth(),
  iconGap: getIconGap(),
  iconScale: 1.5,
  padding: 25,
}
window.addEventListener('resize', () => {
  INFO_BOX.iconWidth = getIconWidth()
  INFO_BOX.iconGap = getIconGap()
})
