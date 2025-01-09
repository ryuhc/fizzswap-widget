import { useMemo } from 'react'

import { silicon, siliconSepolia } from '@/constants/chain'
import { useEnvContext } from '@/context/EnvProvider'

export function useSupportChains() {
  const env = useEnvContext()
  const supportChains = useMemo(() => {
    return env.isInternalProd ? [siliconSepolia] : env.PROFILE === 'prod' ? [silicon] : [silicon, siliconSepolia]
  }, [env])

  return supportChains
}