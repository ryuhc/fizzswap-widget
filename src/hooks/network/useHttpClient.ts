import { useMemo } from 'react'

import { createPublicClient, http } from 'viem'
import { useChainId } from 'wagmi'

import { silicon, SUPPORT_CHAIN_IDS } from '@/constants/chain'
import { useSupportChains } from '@/hooks/network/useSupportChains'

export function useHttpClient(customUrl?: string) {
  const chainId = useChainId() as SUPPORT_CHAIN_IDS
  const supportChains = useSupportChains()
  const targetChain = useMemo(() => {
    return supportChains.find(item => item.id === chainId) ?? silicon
  }, [chainId, supportChains])

  const client = useMemo(() => {
    return createPublicClient({
      chain: targetChain,
      transport: http(customUrl ?? targetChain?.rpcUrls?.default?.http[0] ?? '', {
        timeout: 60 * 1000,
        retryCount: 5,
        retryDelay: 3 * 1000
      }),
    })
  }, [targetChain, customUrl])

  return client
}