import { silicon, siliconSepolia } from '@/constants/chain/config'

export const DOCS_URL = 'https://docs.fizzswap.io'

export const EXPLORER_URLS: { [x: number]: string } = {
  [silicon.id]: silicon.blockExplorers?.default?.url ?? '',
  [siliconSepolia.id]: siliconSepolia.blockExplorers?.default?.url ?? ''
}

export const EXPLORER_NAMES: { [x: number]: string } = {
  [silicon.id]: 'Silicon Scope',
  [siliconSepolia.id]: 'Silicon Scope'
}
