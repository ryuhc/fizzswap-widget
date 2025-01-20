import { useMemo } from 'react'

import { silicon } from '@/constants/chain'
import { useEnvContext } from '@/context/EnvProvider'

export function useSupportChains() {
  const env = useEnvContext()
  const supportChains = useMemo(() => {
    return env.SUPPORT_CHAINS ?? [silicon]
  }, [env])

  return supportChains
}