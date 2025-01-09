import { Token } from '@uniswap/sdk-core'

import { getWritableTokenAddress } from '@/utils/address'

import { SUPPORT_CHAIN_IDS } from '@/constants/chain'

export function createTokenEmpty(token: `0x${string}`, chainId: SUPPORT_CHAIN_IDS) {
  return new Token(
    chainId,
    getWritableTokenAddress(token, chainId),
    18,
    '',
    ''
  )
}