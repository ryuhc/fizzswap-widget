import { silicon, siliconSepolia, SUPPORT_CHAIN_IDS } from '@/constants/chain/config'

export const NATIVE_SYMBOL: { [x: SUPPORT_CHAIN_IDS]: string } = {
  [silicon.id]: 'ETH',
  [siliconSepolia.id]: 'ETH',
}

export const GOV_TOKEN_SYMBOL: { [x: SUPPORT_CHAIN_IDS]: string } = {
  [silicon.id]: 'FIZZ',
  [siliconSepolia.id]: 'FIZZ',
}

export const VOTING_TOKEN_SYMBOL: { [x: SUPPORT_CHAIN_IDS]: string } = {
  [silicon.id]: 'vFIZZ',
  [siliconSepolia.id]: 'vFIZZ',
}