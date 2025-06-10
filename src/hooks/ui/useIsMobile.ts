import useMediaQuery from '@/hooks/ui/useMediaQuery'

import { device } from '@/styles/createBreakPoints'

export function useIsMobile() {
  return useMediaQuery(device.md)
}