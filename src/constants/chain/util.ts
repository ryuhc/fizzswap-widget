import { isSameAddress } from '@/utils/address'
import { subBN } from '@/utils/number'

import { contractAddresses } from '@/constants/chain/address'
import { MIN_AMOUNT_FOR_FEE, SUPPORT_CHAIN_IDS } from '@/constants/chain/config'

export function getAvailableBalance(
  amount: string,
  chainId: SUPPORT_CHAIN_IDS,
  tokenAddress: `0x${string}`
) {
  const isNative = isSameAddress(
    contractAddresses.native[chainId],
    tokenAddress
  )

  return isNative ? subBN(amount, MIN_AMOUNT_FOR_FEE) : amount
}
