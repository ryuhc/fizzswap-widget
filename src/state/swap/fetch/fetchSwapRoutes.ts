import { createQueryStr } from '@/utils/fetch'

export interface ISwapRoutingParam {
  from: `0x${string}`,
  to: `0x${string}`,
  amount: string,
  useOutput: boolean
}

export async function fetchSwapRoutes(path: string, params: ISwapRoutingParam) {
  try {
    const res = await fetch(`${path}/exchange/swap${createQueryStr(params)}`)
    return await res.json().then(data => data.data)
  } catch {
    return null
  }
}