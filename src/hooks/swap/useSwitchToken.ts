import { ChangeEvent, useCallback } from 'react'

import BN from 'bignumber.js'

import { isSameAddress } from '@/utils/address'
import { subBN, toReadableBN } from '@/utils/number'

import { MIN_AMOUNT_FOR_FEE } from '@/constants/chain/index'
import { ITokenItem } from '@/hooks/queries/useTokenList'
import { ISwapStore } from '@/state/swap/index'

interface IProps {
  inputToken: ITokenItem,
  outputToken: ITokenItem,
  selectToken: ISwapStore['selectToken'],
  inputValue: ISwapStore['inputValue'],
  outputValue: ISwapStore['outputValue'],
  onInput: (e: ChangeEvent<HTMLInputElement> | string, field?: number) => void,
  typedField: ISwapStore['typedField'],
  nativeAddress: `0x${string}`,
  isMaxInput: ISwapStore['isMaxInput'],
  balances: Record<`0x${string}`, bigint>,
  isFetching: boolean
}

export function useSwitchToken({
  inputToken,
  outputToken,
  inputValue,
  outputValue,
  selectToken,
  onInput,
  typedField,
  nativeAddress,
  isMaxInput,
  balances,
  isFetching
}: IProps) {
  const refreshEstimate = useCallback((_inputToken: ITokenItem) => {
    const newInput = isMaxInput ? toReadableBN(balances[_inputToken.address] ?? 0n, _inputToken.decimal, _inputToken.decimal) : (typedField === 0 ? inputValue : outputValue)
    const fixedNewInput = isMaxInput && isSameAddress(_inputToken.address, nativeAddress) ? subBN(newInput, MIN_AMOUNT_FOR_FEE) : newInput

    onInput(new BN(fixedNewInput).comparedTo('0') === -1 ? '0' : fixedNewInput)
  }, [isMaxInput, balances, typedField, inputValue, outputValue, nativeAddress, onInput])
  const onSwitch = useCallback(() => {
    if (!inputToken.address || !outputToken.address || isFetching) {
      return
    }

    selectToken(0, outputToken)
    selectToken(1, inputToken)

    refreshEstimate(outputToken)
  }, [inputToken, outputToken, isFetching, selectToken, refreshEstimate])

  return { onSwitch, refreshEstimate }
}