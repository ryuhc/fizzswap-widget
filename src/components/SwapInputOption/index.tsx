import { ChangeEvent, useCallback, useMemo } from 'react'

import styled from 'styled-components'
import { useChainId } from 'wagmi'

import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'

import { Text } from '@/styles/common'
import { device } from '@/styles/createBreakPoints'

import { SUPPORT_CHAIN_IDS } from '@/constants/chain'
import { ITokenItem } from '@/hooks/queries/useTokenList'
import { divBN, isNativeToken, mulBN, toReadableBN } from '@/utils'

export function SwapInputOption({ token, amount, typedField, onSelect, balance }: {
  token: ITokenItem,
  amount: string,
  balance: bigint,
  typedField: number,
  onSelect: (e: ChangeEvent<HTMLInputElement> | string, field?: number) => Promise<void>
}) {
  const chainId = useChainId() as SUPPORT_CHAIN_IDS
  const isNativeInput = useMemo(() => {
    return isNativeToken(token.address, chainId)
  }, [token, chainId])
  const options = useMemo(() => {
    return isNativeInput ? ['0.001', '0.01', '0.05', '0.1'] : ['25', '50', '75', '100']
  }, [isNativeInput])

  const { t } = useTranslationSimplify()

  const handleSelect = useCallback((selected: string) => {
    onSelect(
      isNativeInput ?
        selected
        : toReadableBN(
          selected === '100'
            ? String(balance)
            : mulBN(balance, divBN(selected, 100)),
          token.decimal,
          token.decimal
        )
      ,
      typedField
    )
  }, [onSelect, typedField, isNativeInput, balance, token.decimal])

  return (
    <StyledSwapInputOption>
      <SwapInputOptionItem onClick={() => handleSelect('0')}>
        <Text size={14} color="gray">{t('V3.PoolCreateClearAll')}</Text>
      </SwapInputOptionItem>
      {options.map(option => {
        return (
          <SwapInputOptionItem key={option} onClick={() => handleSelect(option)}>
            <Text size={12} color={amount === option ? 'black2' : 'gray'} weight={amount === option ? 700 : 500}>{option} {isNativeInput ? token.symbol : '%'}</Text>
          </SwapInputOptionItem>
        )
      })}
    </StyledSwapInputOption>
  )
}

const StyledSwapInputOption = styled('section')`
  display: flex;
  gap: 8px 4px;
  margin-top: 10px;

  @media ${device.md} {
    flex-wrap: wrap;
  }
`

const SwapInputOptionItem = styled('button')`
  padding: 0 8px;
  height: 26px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.bodyBackground};
`