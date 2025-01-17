import { useCallback } from 'react'

import styled from 'styled-components'

import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'

import { useSwapState } from '@/state/swap'

import { Text } from '@/styles/common'

export function SwapTab() {
  const { t } = useTranslationSimplify()
  const { typedField, focusOnField, clearInput } = useSwapState()
  const onClickTab = useCallback((field: number) => {
    clearInput()
    focusOnField(field)
  }, [])

  return (
    <StyledSwapTab>
      <SwapInputModeOption $type="buy" $selected={typedField === 0} onClick={() => onClickTab(0)}>
        <Text color={typedField === 0 ? 'white' : 'gray'} weight={700}>{t('General.Buy')}</Text>
      </SwapInputModeOption>
      <SwapInputModeOption $type="sell" $selected={typedField === 1} onClick={() => onClickTab(1)}>
        <Text color={typedField === 1 ? 'white' : 'gray'} weight={700}>{t('General.Sell')}</Text>
      </SwapInputModeOption>
    </StyledSwapTab>
  )
}

const StyledSwapTab = styled('div')`
  display: flex;
  gap: 10px;
`

const SwapInputModeOption = styled('button')<{ $type: string, $selected: boolean }>`
  flex: 2;
  height: 48px;
  border-radius: 8px;
  background: ${({ theme, $type, $selected }) => {
    return $selected ? (
      $type === 'buy' ? '#FD5040' : '#007AFF'
    ) : theme.colors.gray4
  }};
`