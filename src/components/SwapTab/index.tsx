import styled from 'styled-components'

import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'

import { useSwapState } from '@/state/swap'

import { Text } from '@/styles/common'

export function SwapTab() {
  const { t } = useTranslationSimplify()
  const { typedField, focusOnField } = useSwapState()

  return (
    <StyledSwapTab>
      <SwapInputModeOption $type="buy" $selected={typedField === 0} onClick={() => focusOnField(0)}>
        <Text color={typedField === 0 ? 'white' : 'gray'} weight={700}>{t('General.Buy')}</Text>
      </SwapInputModeOption>
      <SwapInputModeOption $type="sell" $selected={typedField === 1} onClick={() => focusOnField(1)}>
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