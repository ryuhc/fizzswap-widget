import { useCallback, useEffect } from 'react'

import { debounce } from 'lodash'

import { useCommonStore } from '@/state/common'

export function useScroll() {
  const { scroll, setScroll } = useCommonStore()
  const updateScrollData = useCallback(debounce(() => {
    setScroll({ x: window.scrollX, y: window.scrollY })
  }, 50), [])

  useEffect(() => {
    window.addEventListener('scroll', updateScrollData)

    return () => {
      window.removeEventListener('scroll', updateScrollData)
    }
  }, [])

  return scroll
}