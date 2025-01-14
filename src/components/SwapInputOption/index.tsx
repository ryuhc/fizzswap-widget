import { ChangeEvent, useCallback, useMemo, useState } from 'react'

import styled from 'styled-components'
import { useChainId } from 'wagmi'

import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'

import { Text } from '@/styles/common'
import { device } from '@/styles/createBreakPoints'

import { SUPPORT_CHAIN_IDS } from '@/constants/chain'
import { ITokenItem } from '@/hooks/queries/useTokenList'
import { divBN, isNativeToken, mulBN, toReadableBN } from '@/utils'

export function SwapInputOption({ token, typedField, onSelect, balance }: {
  token: ITokenItem,
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

  const [selected, setSelected]  = useState<string>('')
  const handleSelect = useCallback((amount: string) => {
    onSelect(
      isNativeInput ?
        amount
        : toReadableBN(
          amount === '100'
            ? String(balance)
            : mulBN(balance, divBN(amount, 100)),
          token.decimal,
          token.decimal
        )
      ,
      typedField
    )
    setSelected(amount)
  }, [onSelect, typedField, isNativeInput, balance, token.decimal])

  return (
    <StyledSwapInputOption>
      <SwapInputOptionItem onClick={() => handleSelect('0')}>
        <Text size={14} color="gray">{t('V3.PoolCreateClearAll')}</Text>
      </SwapInputOptionItem>
      {options.map(amount => {
        return (
          <SwapInputOptionItem key={amount} onClick={() => handleSelect(amount)}>
            <Text size={12} color={selected === amount ? 'black2' : 'gray'} weight={selected === amount ? 700 : 500}>{amount} {isNativeInput ? token.symbol : '%'}</Text>
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