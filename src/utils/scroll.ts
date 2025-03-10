export const preventScroll = () => {
  const currentScrollY = window.scrollY
  document.body.style.position = 'fixed'
  document.body.style.width = '100%'
  document.body.style.top = `-${currentScrollY}px` // 현재 스크롤 위치
  document.body.style.overflowY = 'scroll'
  return currentScrollY
}

export const allowScroll = (prevScrollY?: number) => {
  document.body.style.position = ''
  document.body.style.width = ''
  document.body.style.top = ''
  document.body.style.overflowY = ''

  if (prevScrollY) {
    window.scrollTo(0, prevScrollY)
  }
}
