import { useTheme } from 'styled-components'

import useMediaQuery from '@/hooks/ui/useMediaQuery'

export function useIsMobile() {
  const { breakpoints } = useTheme()
  const isMobile = useMediaQuery(breakpoints.down('md'))

  return isMobile
}
