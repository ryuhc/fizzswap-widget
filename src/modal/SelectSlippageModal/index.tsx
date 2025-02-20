import React, { useCallback, useState } from 'react'

import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'

import {
  SelectSlippageSubmitArea,
  SelectSlippageDesc,
  SelectSlippageError,
  SelectSlippageInput,
  SelectSlippageInputField,
  SelectSlippageInputUnit,
  SelectSlippageTitle,
  StyledSelectSlippageModal,
  SelectSlippageWarning,
  SelectSlippageBody
} from './styles'
import { ModalClose } from '@/modal/ModalClose'
import { ModalWrapper } from '@/modal/ModalWrapper'

import { useCommonStore } from '@/state/common'

import { Text } from '@/styles/common'
import { ModalSubmitButton } from '@/styles/modal'

interface IProps {
  onClose: () => void
  onSelect: (newValue: number) => void
}

export function SelectSlippageModal({ onClose, onSelect }: IProps) {
  const { t } = useTranslationSimplify()
  const { slippage } = useCommonStore()

  const [typedValue, setTypedValue] = useState<string>(String(slippage))
  const onInputSlippage = useCallback((value: string) => {
    setTypedValue(value)
    handleSlippageValue(value)
  }, [])
  const handleSlippageValue = useCallback(
    (_value?: string) => {
      const valueToStr = _value ?? typedValue

      // 에러 초기화
      let newError = ''
      let fixedInput = parseFloat(valueToStr)
      const prevValueUnderZero = valueToStr.split('.')[1] || ''

      if (valueToStr === '' || fixedInput === 0 || valueToStr.endsWith('.')) {
        setError(newError)
        return
      }

      // 소수점 1자리까지만 입력 허용
      if (prevValueUnderZero.length > 1) {
        // fixedInput = parseFloat(String(parseInt(valueToStr)) + '.' + prevValueUnderZero.slice(0, 1))
      }

      if (fixedInput >= 0.3 && fixedInput < 0.5) {
        // 애매하게 낮은 값 입력 시
        newError = t('General.WarningLowSlippage')
      } else if (fixedInput > 1 && fixedInput <= 50) {
        // 애매하게 높은 값 입력 시
        newError = t('General.WarningHighSlippage')
      } else if (fixedInput > 50) {
        // 너무 높은 값 입력 시
        fixedInput = 50
        newError = t('General.MaxSlippageError')
      }

      // 버튼 옵션 값중 하나가 아니라면 초기화
      setError(newError)

      if (valueToStr === String(fixedInput)) {
        return
      }

      // @ts-ignore
      setTypedValue(Number.isNaN(fixedInput) ? 0.3 : fixedInput)
    },
    [typedValue]
  )

  const [error, setError] = useState<string>('')

  const onConfirm = useCallback(() => {
    onSelect(Number(typedValue))
    onClose()
  }, [onClose, onSelect, typedValue])
  const handleSubmit = useCallback(() => {
    if (!typedValue) {
      return
    }

    onConfirm()
  }, [typedValue, onConfirm])

  return (
    <ModalWrapper>
      <StyledSelectSlippageModal>
        <ModalClose onClose={onClose} />

        <SelectSlippageTitle>
          <Text size={20} weight={700}>
            {t('Widget.SlippagePop1')}
          </Text>
        </SelectSlippageTitle>

        <SelectSlippageBody>
          <SelectSlippageDesc>
            <Text size={14} color="black2">
              {t('Widget.SlippagePop2')}
            </Text>
          </SelectSlippageDesc>

          <SelectSlippageInput>
            <SelectSlippageInputField
              type="text"
              value={typedValue}
              inputMode="decimal"
              placeholder={t('General.SelfInput')}
              onChange={(e) => onInputSlippage(e.target.value)}
              onKeyDown={(e) => {
                if (e.code === 'KeyE') {
                  e.preventDefault()
                  return false
                }
              }}
            />
            <SelectSlippageInputUnit>
              <Text size={18} color="gray" weight={700}>
                %
              </Text>
            </SelectSlippageInputUnit>
          </SelectSlippageInput>

          {/*
        <SelectSlippageError>
          <Text size={14}>{error}</Text>
        </SelectSlippageError>
        */}

          <SelectSlippageWarning>
            <li>
              <Text size={14} weight={500} color="black2">
                {t('Widget.SlippagePop3')}
              </Text>
            </li>
            <li>
              <Text
                size={14}
                weight={500}
                color="black2"
                dangerouslySetInnerHTML={{ __html: t('Widget.SlippagePop4') }}
              />
            </li>
            <li>
              <Text size={14} weight={500} color="black2">
                {t('Widget.SlippagePop5')}
              </Text>
            </li>
          </SelectSlippageWarning>
        </SelectSlippageBody>

        <SelectSlippageSubmitArea>
          <ModalSubmitButton type="secondary" onClick={() => handleSubmit()}>
            <Text weight={700}>{t('Widget.OK')}</Text>
          </ModalSubmitButton>
        </SelectSlippageSubmitArea>
      </StyledSelectSlippageModal>
    </ModalWrapper>
  )
}
