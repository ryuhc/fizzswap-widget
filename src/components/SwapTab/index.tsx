import styled from 'styled-components'

import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'

import { useSwapState } from '@/state/swap'

import { Text } from '@/styles/common'

export function SwapTab() {
  const { t } = useTranslationSimplify()
  const { mode, setMode } = useSwapState()

  return (
    <StyledSwapTab>
      <SwapInputModeOption
        $type="buy"
        $selected={mode === 'buy'}
        onClick={() => setMode('buy')}
      >
        <Text color={mode === 'buy' ? 'white' : 'gray'} weight={700}>
          {t('Widget.Buy')}
        </Text>
      </SwapInputModeOption>
      <SwapInputModeOption
        $type="sell"
        $selected={mode === 'sell'}
        onClick={() => setMode('sell')}
      >
        <Text color={mode === 'sell' ? 'white' : 'gray'} weight={700}>
          {t('Widget.Sell')}
        </Text>
      </SwapInputModeOption>
    </StyledSwapTab>
  )
}

const StyledSwapTab = styled('div')`
  display: flex;
  gap: 10px;
`

const SwapInputModeOption = styled('button')<{
  $type: string
  $selected: boolean
}>`
  flex: 2;
  height: 48px;
  border-radius: 8px;
  background: ${({ theme, $type, $selected }) => {
    return $selected
      ? $type === 'buy'
        ? '#FD5040'
        : '#007AFF'
      : theme.colors.gray4
  }};
`
