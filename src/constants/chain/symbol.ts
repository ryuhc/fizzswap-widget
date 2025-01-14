import { silicon, siliconSepolia } from '@/constants/chain/config'

export const NATIVE_SYMBOL: { [x: number]: string } = {
  [silicon.id]: 'ETH',
  [siliconSepolia.id]: 'ETH',
}

export const GOV_TOKEN_SYMBOL: { [x: number]: string } = {
  [silicon.id]: 'FIZZ',
  [siliconSepolia.id]: 'FIZZ',
}

export const VOTING_TOKEN_SYMBOL: { [x: number]: string } = {
  [silicon.id]: 'vFIZZ',
  [siliconSepolia.id]: 'vFIZZ',
}