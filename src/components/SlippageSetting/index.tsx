import { useCallback } from 'react'
import { createPortal } from 'react-dom'

import styled from 'styled-components'

import useModal from '@/hooks/useModal'
import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'

import { SelectSlippageModal } from '@/modal/SelectSlippageModal'

import { useCommonStore } from '@/state/common'

import { Text } from '@/styles/common'

export function SlippageSetting() {
  const { t } = useTranslationSimplify()
  const { slippage, setSlippage } = useCommonStore()
  const [show, setShow, portal, close] = useModal()

  const handleSelect = useCallback((newValue: number) => {
    setSlippage(newValue)
    setShow()
  }, [])

  return (
    <StyledSlippageSetting className="slippage-setting">
      <StyledSlippageSettingContent onClick={() => setShow()}>
        <StyledSlippageLabel>
          <Text color="black4" size={12}>{t('General.Slippage')}</Text>
        </StyledSlippageLabel>
        <div>
          <Text color="black4" size={12} weight={700}>{slippage}%</Text>
        </div>
      </StyledSlippageSettingContent>

      {
        show && portal ? (
          createPortal((
            <SelectSlippageModal onClose={close} onSelect={handleSelect} /> as any
          ), portal)
        ) : null
      }
    </StyledSlippageSetting>
  )
}

const StyledSlippageSetting = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`
const StyledSlippageSettingContent = styled('div')`
  width: auto;
  padding: 3px 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.bodyBackground};
  display: flex;
  align-items: center;
  cursor: pointer;
`

const StyledSlippageLabel = styled('div')`
  margin-right: 10px;
`