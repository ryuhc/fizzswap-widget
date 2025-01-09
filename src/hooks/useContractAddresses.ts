import { useMemo } from 'react'

import { contractAddresses, contractAddressesInternal } from '@/constants/chain'
import { useEnvContext } from '@/context/EnvProvider'

export function useContractAddresses() {
  const env = useEnvContext()

  return useMemo(() => {
    return env.isInternalProd ? contractAddressesInternal : contractAddresses
  }, [env])
}