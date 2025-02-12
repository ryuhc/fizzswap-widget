

import { useQuery } from '@tanstack/react-query'
import { map } from 'lodash'
import { useAccount } from 'wagmi'

import { isSameAddress } from '@/utils/address'
import { callAndDecodeContractFunctions } from '@/utils/fetch'

import ERC20ABI from '@/abi/common/ERC20.json'
import ERC721ABI from '@/abi/common/ERC721.json'
import { contractAddresses, SUPPORT_CHAIN_IDS } from '@/constants/chain'
import { useApiUrl } from '@/hooks/network/useApiUrl'

interface IProps {
  chainId: SUPPORT_CHAIN_IDS,
  params: number[] | string[],
  isNft: boolean,
  spender: `0x${string}`,
  nftAddress?: string,
  amounts?: bigint[]
}

export function useAllowance({
  chainId,
  params,
  isNft,
  spender,
  nftAddress,
  amounts
}: IProps) {
  const { address: owner } = useAccount()
  const apiPath = useApiUrl()
  const { data, isFetched, refetch } = useQuery({
    queryKey: ['allowance', chainId, owner, spender, isNft, nftAddress, params.join(','), (amounts ?? []).map(amount => String(amount)).join(',')],
    queryFn: async () => {
      const callParams: any[] = []

      if (isNft) {
        for (const tokenId of params) {
          callParams.push({
            address: nftAddress,
            abi: ERC721ABI,
            functionName: 'getApproved',
            args: [tokenId]
          })
        }
      } else {
        for (const tokenAddress of params) {
          callParams.push({
            address: tokenAddress,
            abi: ERC20ABI,
            functionName: 'allowance',
            args: [owner, spender]
          })
        }
      }

      const res = await callAndDecodeContractFunctions(apiPath, contractAddresses.multicall[chainId], callParams)

      if (isNft) {
        return map(res, (address: string) => {
          return isSameAddress(address, spender as string)
        })
      }

      return map(res, (amount: bigint, i) => {
        return amount >= ((amounts ?? [])[i] ?? 0n)
      })
    },
    staleTime: 1000 * 60,
    enabled: owner && params.length > 0
  })

  return { data, refetch, isFetched: params.length === 0 || isFetched }
}