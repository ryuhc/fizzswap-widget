import { useMemo } from 'react'

import { contractAddresses, SUPPORT_CHAIN_IDS } from '@/constants/chain'

export function useNativeToken(chainId: SUPPORT_CHAIN_IDS): `0x${string}` {
  return useMemo(() => {
    return contractAddresses.native[chainId]
  }, [chainId])
}