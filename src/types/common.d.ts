export interface IFetchListOptions {
  skip?: number
  take?: number
  keyword?: string
  userAddress?: string
}

export interface IFetchUserListOptions {
  skip?: number
  take?: number
  keyword?: string
}

export interface IBridgeMinter {
  minAmount: string
  minter: `0x${string}`
  taxRate: string
  originChain: string
  toChains: BridgeChain
}

export type BridgeChain = Record<
  string,
  {
    chainFee: string
    chainFeeWithData: string
    usable: boolean
  }
>
