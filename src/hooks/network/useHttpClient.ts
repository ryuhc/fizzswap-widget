import { useMemo } from 'react'

import { createPublicClient, http } from 'viem'
import { useChainId } from 'wagmi'

import { SUPPORT_CHAIN_IDS } from '@/constants/chain'
import { useEnvContext } from '@/context/EnvProvider'
import { useSupportChains } from '@/hooks/network/useSupportChains'

export function useHttpClient(customUrl?: string) {
  const chainId = useChainId() as SUPPORT_CHAIN_IDS
  const supportChains = useSupportChains()
  const targetChain = useMemo(() => {
    return supportChains.find(item => item.id === chainId)
  }, [chainId, supportChains])

  const env = useEnvContext()
  const client = useMemo(() => {
    return createPublicClient({
      chain: targetChain,
      transport: http(customUrl ?? (env.VITE_LIVE_RPC ?? targetChain?.rpcUrls.public.http), {
        timeout: 60 * 1000,
        retryCount: 5,
        retryDelay: 3 * 1000
      }),
    })
  }, [env, targetChain, customUrl])

  return client
}