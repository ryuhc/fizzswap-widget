import { computePoolAddress, FeeAmount } from '@uniswap/v3-sdk'

import { createTokenEmpty } from '@/utils/token'

import { Text } from '@/styles/common'

import { contractAddresses, INIT_CODE_HASH_V3, SUPPORT_CHAIN_IDS } from '@/constants/chain'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export function isSameAddress(addrA: string | `0x${string}`, addrB: string | `0x${string}`) {
  return addrA.toLowerCase() === addrB.toLowerCase()
}

export function getMaskedAddress(addr = '', front: number, back: number, mask: number) {
  return addr.slice(0, front) + '∙'.repeat(mask) + addr.slice(addr.length - back, addr.length)
}

export function getReadableTokenAddress(address: string, chainId: SUPPORT_CHAIN_IDS) {
  return (address === contractAddresses.wNative[chainId] ? contractAddresses.native[chainId] : address) as `0x${string}`
}

export function getWritableTokenAddress(address: string, chainId: SUPPORT_CHAIN_IDS) {
  return (address === contractAddresses.native[chainId] ? contractAddresses.wNative[chainId] : address) as `0x${string}`
}

export function getWritablePoolAddress(address: string, version: 'v2' | 'v3') {
  return (version === 'v2' ? ZERO_ADDRESS : address) as `0x${string}`
}

export function isNativeToken(address: string, chainId: SUPPORT_CHAIN_IDS) {
  return address === contractAddresses.native[chainId]
}

export function isWNativeToken(address: string, chainId: SUPPORT_CHAIN_IDS) {
  return address === contractAddresses.wNative[chainId]
}

export function computePoolAddressV3(factoryAddress: `0x${string}`, fee: string, token0: `0x${string}`, token1: `0x${string}`, chainId: SUPPORT_CHAIN_IDS) {
  return computePoolAddress({
    factoryAddress,
    tokenA: createTokenEmpty(token0, chainId),
    tokenB: createTokenEmpty(token1, chainId),
    fee: fee as unknown as FeeAmount,
    initCodeHashManualOverride: INIT_CODE_HASH_V3[chainId]
  })
}

export function getHighlightedAddress(address: string, len = 3) {
  if (!address) {
    return ''
  }

  if (address.length < 7) {
    return address
  }

  return (
    <div>
      <Text color="primaryActive">{address.slice(0, len)}</Text>
      <Text>{address.slice(3, address.length - len)}</Text>
      <Text color="primaryActive">{address.slice(address.length - len, address.length)}</Text>
    </div>
  )
}