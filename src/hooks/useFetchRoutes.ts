import { useCallback, useState } from 'react'

import { useChainId } from 'wagmi'

import { toReadableBN } from '@/utils/number'

import { ISwapStore } from '@/state/swap'

import { SUPPORT_CHAIN_IDS } from '@/constants/chain'
import { ITokenItem } from '@/hooks/queries/useTokenList'
import { useSwapRoutes } from '@/state/swap/queries/useSwapRoutes'

interface IProps {
  inputToken: ITokenItem
  outputToken: ITokenItem
  amount: string
  isPos: boolean
  updateValue: ISwapStore['updateValue']
  setPriceImpact: ISwapStore['setPriceImpact']
}

export interface ISwapPath {
  address: `0x${string}`
  fee: string
  fromAmount: string
  fromToken: ITokenItem
  toAmount: string
  toToken: ITokenItem
  type: 'v2' | 'v3'
}

export interface ISwapRoute {
  toBasePrice: any
  fromBasePrice: any
  fromAmount: string
  path: ISwapPath[]
  toAmount: string
  priceImpact: string
}

export interface ISwapRoutes {
  fromToken: ITokenItem
  toToken: ITokenItem
  best: ISwapRoute
  others: ISwapRoute[]
  fee: string
}

export function useFetchRoutes({
  inputToken,
  outputToken,
  amount,
  isPos,
  updateValue,
  setPriceImpact
}: IProps) {
  const chainId = useChainId() as SUPPORT_CHAIN_IDS
  const { data, refetch, isFetching } = useSwapRoutes({
    inputToken,
    outputToken,
    amount,
    isPos
  })

  const [updatedAt, setUpdatedAt] = useState<number>(0)
  const fetchRoute = useCallback(async () => {
    const res = await refetch().then(({ data }) => data as ISwapRoutes)
    const outputDecimal = isPos ? outputToken.decimal : inputToken.decimal

    setUpdatedAt(new Date().valueOf())

    setPriceImpact(Number(res?.best?.priceImpact ?? 0))
    updateValue(
      toReadableBN(
        isPos ? res.best.toAmount : res.best.fromAmount,
        outputDecimal,
        outputDecimal
      ),
      isPos ? 1 : 0
    )

    return { ...res, isPos }
  }, [isPos, inputToken, outputToken, chainId, isPos])

  return { data, refetch, isFetching, fetchRoute, updatedAt }
}
