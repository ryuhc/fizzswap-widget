import { useMemo } from 'react'

import { isValidAddress } from '@ethereumjs/util'
import { useQuery } from '@tanstack/react-query'
import { useAccount, useChainId } from 'wagmi'

import { isSameAddress } from '@/utils/address'
import { callAndDecodeContractFunctions } from '@/utils/fetch'

import ERC20ABI from '@/abi/common/ERC20.json'
import MulticallABI from '@/abi/common/Multicall.json'
import { contractAddresses } from '@/constants/chain'
import { useApiUrl } from '@/hooks/network/useApiUrl'
import { useNativeToken } from '@/hooks/token/useNativeToken'

export function useTokenBalances(addresses: `0x${string}`[]): Record<`0x${string}`, bigint> {
  const chainId = useChainId()
  const { address: userAddress } = useAccount()
  const nativeToken = useNativeToken(chainId)
  const callParams = useMemo(() => {
    const res: any[] = []
    const nativeParam = {
      address: contractAddresses.multicall[chainId],
      abi: MulticallABI,
      functionName: 'getEthBalance',
      args: [userAddress]
    }

    for (const address of addresses) {
      if (parseInt(address) > 0 && isValidAddress(address)) {
        res.push({
          address,
          abi: ERC20ABI,
          functionName: 'balanceOf',
          args: [userAddress]
        })
      }
    }

    const nativeIndex = addresses.findIndex(address => isSameAddress(address, nativeToken))
    res.splice(nativeIndex, 0, nativeParam)

    return res
  }, [chainId, userAddress, addresses, nativeToken])

  const apiPath = useApiUrl()
  const { data } = useQuery({
    queryKey: ['balanceOf', userAddress, chainId, callParams.map(param => param.address).join(',')],
    queryFn: () => callAndDecodeContractFunctions(apiPath, contractAddresses.multicall[chainId], callParams) as Promise<bigint[]>,
    enabled: !!userAddress && addresses.length > 0,
    refetchInterval: 15 * 1000,
    staleTime: 15 * 1000
  })

  const result: Record<`0x${string}`, bigint> = useMemo(() => {
    const balances: Record<`0x${string}`, bigint> = {}

    for (let i = 0; i < callParams.length; i++) {
      const address = callParams[i].functionName === 'getEthBalance' ? nativeToken : callParams[i].address
      balances[address] = (data ?? [])[i] ?? 0n
    }

    return balances
  }, [data, callParams, nativeToken])

  return result
}