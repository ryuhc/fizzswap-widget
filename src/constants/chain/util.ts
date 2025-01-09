import { isSameAddress } from '@/utils/address'
import { subBN } from '@/utils/number'

import { contractAddresses } from '@/constants/chain/address'
import { DEFAULT_CHAIN_ID, MIN_AMOUNT_FOR_FEE, SUPPORT_CHAIN_IDS, SUPPORT_CHAINS } from '@/constants/chain/config'

export function isSupportChainId(chainId: SUPPORT_CHAIN_IDS) {
  return !!SUPPORT_CHAINS.find(item => item.id === chainId)
}

export function fetchChainId(id: SUPPORT_CHAIN_IDS) {
  return (isSupportChainId(Number(id) as SUPPORT_CHAIN_IDS) ? id : DEFAULT_CHAIN_ID) as SUPPORT_CHAIN_IDS
}

export function getAvailableBalance(amount: string, chainId: SUPPORT_CHAIN_IDS, tokenAddress: `0x${string}`) {
  const isNative = isSameAddress(contractAddresses.native[chainId], tokenAddress)

  return isNative ? subBN(amount, MIN_AMOUNT_FOR_FEE) : amount
}