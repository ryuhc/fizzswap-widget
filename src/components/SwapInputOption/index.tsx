import styled from 'styled-components'
import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { ITokenItem } from '@/hooks/queries/useTokenList'
import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'
import { Text } from '@/styles/common'
import { device } from '@/styles/createBreakPoints'

export function SwapInputOption({ token, typedField, onSelect }: {
  token: ITokenItem,
  typedField: number,
  onSelect: (e: ChangeEvent<HTMLInputElement> | string, field?: number) => Promise<void>
}) {
  const options = useMemo(() => {
    return ['0.001', '0.01', '0.05', '0.1']
  }, [])

  const { t } = useTranslationSimplify()

  const [selected, setSelected]  = useState<string>('')
  const handleSelect = useCallback((amount: string) => {
    onSelect(amount, typedField)
    setSelected(amount)
  }, [onSelect, typedField])

  return (
    <StyledSwapInputOption>
      <SwapInputOptionItem onClick={() => handleSelect('0')}>
        <Text size={14} color="gray">{t('V3.PoolCreateClearAll')}</Text>
      </SwapInputOptionItem>
      {options.map(amount => {
        return (
          <SwapInputOptionItem key={amount} onClick={() => handleSelect(amount)}>
            <Text size={12} color={selected === amount ? 'black2' : 'gray'} weight={selected === amount ? 700 : 500}>{amount} {token.symbol}</Text>
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