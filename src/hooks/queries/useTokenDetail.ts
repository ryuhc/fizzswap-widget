import { useQuery } from '@tanstack/react-query'
import { useChainId } from 'wagmi'

import type { ITokenItem } from '@/hooks/queries/useTokenList'

import { SUPPORT_CHAIN_IDS } from '@/constants/chain'
import { useApiUrl } from '@/hooks/network/useApiUrl'

export function useTokenDetail(address: `0x${string}`): ITokenItem {
  const chainId = useChainId() as SUPPORT_CHAIN_IDS
  const path = useApiUrl()
  const { data } = useQuery({
    queryKey: ['tokenDetail', chainId, address],
    queryFn: async () => {
      return fetch(`${path}/tokens/${address.toLowerCase()}`).then((res) => {
        return res.json()
      })
    },
    staleTime: 15 * 1000,
    refetchInterval: 15 * 1000
  })

  return data?.token
}
