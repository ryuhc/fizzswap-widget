import { useMemo } from 'react'

import { encodeFunctionData } from 'viem'


import { useContractAddresses } from '@/hooks/useContractAddresses'
import { ISwapRoutes } from '@/hooks/useFetchRoutes'
import { getWritablePoolAddress, getWritableTokenAddress, isSameAddress } from '@/utils/address'
import { calcTxDeadline } from '@/utils/common'
import { mulBN, toWritableUnit } from '@/utils/number'

import type { ITokenItem } from '@/hooks/queries/useTokenList'

import UniversalRouterABI from '@/abi/exchange/UniversalRouter.json'
import { SUPPORT_CHAIN_IDS } from '@/constants/chain/index'

interface IProps {
  account: `0x${string}`
  chainId: SUPPORT_CHAIN_IDS,
  slippage: number,
  inputToken: ITokenItem,
  outputToken: ITokenItem,
  inputValue: string,
  outputValue: string,
  isPos: boolean,
  routes: ISwapRoutes
}

export interface SwapCall {
  method: string,
  params: (string | SwapParams)[],
  value: string
}
export interface SwapParams {
  to: string,
  path: `0x${string}`[],
  pool: `0x${string}`[],
  deadline: number
}

export enum SWAP_TYPE {
  ETH_TO_TOKEN,
  TOKEN_TO_ETH,
  TOKEN_TO_TOKEN
}

export function useSwapCall({
  account,
  chainId,
  slippage,
  inputToken,
  outputToken,
  inputValue,
  outputValue,
  isPos,
  routes
}: IProps) {
  const contractAddresses = useContractAddresses()
  const swapType: SWAP_TYPE = useMemo(() => {
    if (isSameAddress(contractAddresses.native[chainId], inputToken?.address ?? '')) {
      return SWAP_TYPE.ETH_TO_TOKEN
    }

    if (isSameAddress(contractAddresses.native[chainId], outputToken?.address ?? '')) {
      return SWAP_TYPE.TOKEN_TO_ETH
    }

    return SWAP_TYPE.TOKEN_TO_TOKEN
  }, [chainId, inputToken, outputToken, contractAddresses])
  const swapParams: SwapParams = useMemo(() => {
    const pairs: `0x${string}`[] = []
    const tokens: `0x${string}`[] = []

    for (const path of routes.best.path) {
      pairs.push(getWritablePoolAddress(path.address, path.type))
      tokens.push(getWritableTokenAddress(path.toToken.address, chainId))
    }

    if (tokens.length > 0) {
      tokens.unshift(getWritableTokenAddress(routes.best.path[0].fromToken.address, chainId))
    }

    return {
      to: account ?? '0x',
      path: tokens,
      pool: pairs,
      deadline: calcTxDeadline()
    }
  }, [account, routes.best.path, chainId, contractAddresses])

  const maxInput = useMemo(() => {
    return !inputValue ? '0' : mulBN(inputValue ?? 0, (100 + slippage) / 100)
  }, [inputValue, slippage])
  const minOutput = useMemo(() => {
    return !outputValue ? '0' : mulBN(outputValue ?? 0, (100 - slippage) / 100).toString()
  }, [outputValue, slippage])

  const swapCall = useMemo(() => {
    const tx: SwapCall = {
      method: '',
      params: [],
      value: '0'
    }
    const fromAmount = toWritableUnit(inputValue ?? 0, inputToken?.decimal ?? 1)
    const toAmount = toWritableUnit(outputValue ?? 0, outputToken?.decimal ?? 1)

    const maxInputToWei = toWritableUnit(maxInput ?? 0, inputToken?.decimal ?? 1)
    const minOutputToWei = toWritableUnit(minOutput ?? 0, outputToken?.decimal ?? 1)

    if (swapType === SWAP_TYPE.ETH_TO_TOKEN) {
      if(isPos) {
        tx.method = 'swapExactETHForTokens'
        tx.params = [minOutputToWei, swapParams]
      } else {
        tx.method = 'swapETHForExactTokens'
        tx.params = [toAmount, swapParams]
      }

      tx.value = fromAmount
    } else {
      const swapToNative = swapType === SWAP_TYPE.TOKEN_TO_ETH

      if(isPos) {
        tx.method = swapToNative ? 'swapExactTokensForETH' : 'swapExactTokensForTokens'
        tx.params = [fromAmount, minOutputToWei, swapParams]
      } else {
        tx.method = swapToNative ? 'swapTokensForExactETH' : 'swapTokensForExactTokens'
        tx.params = [toAmount, maxInputToWei, swapParams]
      }
    }

    const methodInterface = UniversalRouterABI.find(row => {
      return row.type === 'function' && tx.method === row.name
    })

    return {
      tx,
      to: contractAddresses.universalRouter[chainId],
      value: tx.value,
      abi: UniversalRouterABI,
      methodInterface,
      args: tx.params,
      data: methodInterface && account ? encodeFunctionData({
        abi: UniversalRouterABI,
        functionName: tx.method,
        args: tx.params
      }) : ''
    }
  }, [account, chainId, swapType, isPos, inputToken, inputValue, outputToken, outputValue, swapParams, maxInput, minOutput, contractAddresses])

  return { swapType, swapCall, swapParams, maxInput, minOutput }
}