import React from 'react'
import { useCallback, useMemo } from 'react'

import { DefaultTheme, useTheme } from 'styled-components'

const maybeReactUseSyncExternalStore: undefined | any = (React as any)[
  'useSyncExternalStore' + ''
]

function useMediaQueryImpl(query: string) {
  const getDefaultSnapshot = useCallback(() => false, [])

  const getServerSnapshot = useMemo(() => {
    if (matchMedia) {
      return () => matchMedia!(query).matches
    }

    return getDefaultSnapshot
  }, [getDefaultSnapshot, query])

  const [getSnapshot, subscribe] = useMemo(() => {
    if (matchMedia === null) {
      return [getDefaultSnapshot, () => () => {}]
    }

    const mediaQueryList = matchMedia(query)

    return [
      () => mediaQueryList.matches,
      (notify: () => void) => {
        // fix Safari < 14
        mediaQueryList.addListener(notify)
        return () => {
          mediaQueryList.removeListener(notify)
        }
      },
    ]
  }, [getDefaultSnapshot, query])

  const match = maybeReactUseSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  )

  return match
}

export default function useMediaQuery(
  queryInput: string | ((theme: DefaultTheme) => string),
) {
  const theme = useTheme()

  const supportMatchMedia =
    typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined'

  let query = typeof queryInput === 'function' ? queryInput(theme) : queryInput
  query = query.replace(/^@media( ?)/m, '')

  const match = useMediaQueryImpl(query)

  if (!supportMatchMedia) return false
  return match
}
