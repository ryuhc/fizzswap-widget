'use client'

import { useEffect } from 'react'

import { useDebounce,useWindowSize } from '@uidotdev/usehooks'

import { useCommonStore } from '@/state/common'

export function useWindowInfo() {
  const size = useWindowSize()
  const { setWindowInfo } = useCommonStore()
  const debouncedSize = useDebounce(size, 500)

  useEffect(() => {
    setWindowInfo(debouncedSize)
  }, [debouncedSize])

  return debouncedSize
}