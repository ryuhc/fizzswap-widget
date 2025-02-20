import { useMemo } from 'react'

import { contractAddresses } from '@/constants/chain'

export function useContractAddresses() {
  return useMemo(() => {
    return contractAddresses
  }, [])
}
