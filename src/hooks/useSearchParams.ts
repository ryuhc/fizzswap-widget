import { useMemo } from 'react'

export function useSearchParams() {
  const searchParams = useMemo(() => {
    return new URLSearchParams(window.location.search)
  }, [])

  return searchParams
}
