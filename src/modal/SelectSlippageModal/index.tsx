import React, { useCallback, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import { find,map } from 'lodash'
import styled from 'styled-components'


import useModal from '@/hooks/useModal'
import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'

import { Image } from '@/components/Image'

import {
  SelectSlippageSubmitArea,
  SelectSlippageDefaultIcon,
  SelectSlippageDesc,
  SelectSlippageError,
  SelectSlippageInput,
  SelectSlippageInputField,
  SelectSlippageInputIcon,
  SelectSlippageInputUnit,
  SelectSlippageOption,
  SelectSlippageOptions,
  SelectSlippageTitle,
  StyledSelectSlippageModal
} from './styles'
import { ModalClose } from '@/modal/ModalClose'
import { ModalWrapper } from '@/modal/ModalWrapper'

import { useCommonStore } from '@/state/common'

import { SubmitButton, Text } from '@/styles/common'
import { ModalSubmitButton, StyledModalTitle } from '@/styles/modal'


import CheckIcon from '@/assets/img/icon/ic-check-primary.svg'
import ErrorIcon from '@/assets/img/icon/ic-error-red.svg'
import SlippageIcon from '@/assets/img/icon/ic-slippage-default-en.svg'

interface IProps {
  currentValue: number,
  onClose: () => void,
  onSelect: (newValue: number) => void
}

function RegradingHighSlippage({
  onConfirm,
  onClose
}: {
  onConfirm: () => void,
  onClose: () => void
}) {
  const { t } = useTranslationSimplify()

  return (
    <ModalWrapper>
      <StyledSelectSlippageModal>
        <ModalClose onClose={onClose} />
        <StyledModalTitle style={{ margin: '30px 0 65px 0' }}>
          <Image sx={{ marginRight: '10px' }} src={ErrorIcon} alt="alert" type="vector" />
          {t('General.AboutSetSlippage')}
        </StyledModalTitle>

        <HighSlippageWarning>
          <HighSlippageWarningTitle><Image src={CheckIcon} alt="check" type="vector" /></HighSlippageWarningTitle>
          <HighSlippageWarningText><Text size={12} weight={500}>{t('General.AboutSetSlippageItem1')}</Text></HighSlippageWarningText>
        </HighSlippageWarning>
        <HighSlippageWarning>
          <HighSlippageWarningTitle><Image src={CheckIcon} alt="check" type="vector" /></HighSlippageWarningTitle>
          <HighSlippageWarningText><Text size={12} weight={500}>{t('General.AboutSetSlippageItem2')}</Text></HighSlippageWarningText>
        </HighSlippageWarning>
        <HighSlippageWarning>
          <HighSlippageWarningTitle><Image src={CheckIcon} alt="check" type="vector" /></HighSlippageWarningTitle>
          <HighSlippageWarningText><Text size={12} weight={500}>{t('General.AboutSetSlippageItem3')}</Text></HighSlippageWarningText>
        </HighSlippageWarning>

        <SelectSlippageSubmitArea>
          <ModalSubmitButton type="secondary" onClick={() => onConfirm()}>
            <Text size={14} weight={700}>{t('Asset.CopyNoticeConfirm')}</Text>
          </ModalSubmitButton>
        </SelectSlippageSubmitArea>
      </StyledSelectSlippageModal>
    </ModalWrapper>
  )
}

export function SelectSlippageModal({ currentValue, onClose, onSelect }: IProps) {
  const { t } = useTranslationSimplify()
  const { slippage } = useCommonStore()

  const slippageOptions = useMemo(() => {
    const res = [0.3, 0.5, 1, 5, 10, 20, 50]

    return map(res, option => {
      return {
        value: option,
        isDefault: option === slippage
      }
    })
  }, [slippage])

  const [selectedOption, setSelectedOption] = useState<number>(slippage)
  const onSelectOption = useCallback((option: { value: number, isDefault: boolean }) => {
    if (option.value === selectedOption) {
      return
    }

    setSelectedOption(option.value)
    setTypedValue(String(option.value))

    handleSlippageValue(String(option.value))
  }, [selectedOption])
  const [typedValue, setTypedValue] = useState<string>(String(slippage))
  const onInputSlippage = useCallback((value: string) => {
    setTypedValue(value)
    handleSlippageValue(value)
  }, [])
  const handleSlippageValue = useCallback((_value?: string) => {
    const valueToStr = _value ?? typedValue

    // 에러 초기화
    let newError = ''
    let fixedInput = parseFloat(valueToStr)
    const prevValueUnderZero = valueToStr.split('.')[1] || ''

    if(valueToStr === '' || fixedInput === 0 || valueToStr.endsWith('.')) {
      setError(newError)
      return
    }

    // 소수점 1자리까지만 입력 허용
    if(prevValueUnderZero.length > 1) {
      fixedInput = parseFloat(String(parseInt(valueToStr)) + '.' + prevValueUnderZero.slice(0, 1))
    }

    if(fixedInput < 0.3) { // 너무 낮은 값 입력 시
      fixedInput = 0.3
      newError = t('General.MinSlippageError')
    }
    else if(fixedInput >= 0.3 && fixedInput < 0.5) { // 애매하게 낮은 값 입력 시
      newError = t('General.WarningLowSlippage')
    }
    else if(fixedInput > 1 && fixedInput <= 50) {  // 애매하게 높은 값 입력 시
      newError = t('General.WarningHighSlippage')
    }
    else if(fixedInput > 50) { // 너무 높은 값 입력 시
      fixedInput = 50
      newError = t('General.MaxSlippageError')
    }

    // 버튼 옵션 값중 하나가 아니라면 초기화
    setSelectedOption(isValidOption(fixedInput) ? fixedInput : 0)
    setError(newError)

    if(valueToStr === String(fixedInput)) {
      return
    }

    // @ts-ignore
    setTypedValue(Number.isNaN(fixedInput) ? 0.3 : fixedInput)
  }, [typedValue])

  const [error, setError] = useState<string>('')
  const isValidOption = useCallback((value: number) => {
    return !!find(slippageOptions, option => {
      return option.value === value
    })
  }, [slippageOptions])

  const onConfirm = useCallback(() => {
    onSelect(Number(typedValue))
    onClose()
  }, [typedValue])
  const handleSubmit = useCallback(() => {
    if (!typedValue) {
      return
    }

    if (Number(typedValue) >= 5) {
      return setShow()
    }

    onConfirm()
  }, [typedValue, onConfirm])

  const [show, setShow, portal, close] = useModal()

  return (
    <ModalWrapper>
      <StyledSelectSlippageModal>
        <ModalClose onClose={onClose} />

        <SelectSlippageTitle>
          <Text size={20} weight={700}>{t('General.SetSlippage')}</Text>
        </SelectSlippageTitle>

        <SelectSlippageDesc>
          <Text size={14} color="black2" dangerouslySetInnerHTML={{ __html: t('General.SetSlippageNotice') }} />
        </SelectSlippageDesc>

        {/*
        <SelectSlippageOptions>
          {slippageOptions.map(option => {
            return (
              <SelectSlippageOption key={option.value} className={option.value === selectedOption ? 'selected' : ''} onClick={() => onSelectOption(option)}>
                <Text>{option.value}%</Text>
                {option.value === 0.5 && (
                  <SelectSlippageDefaultIcon><Image src={SlippageIcon} alt="default" type="vector" /></SelectSlippageDefaultIcon>
                )}
              </SelectSlippageOption>
            )
          })}
        </SelectSlippageOptions>
        */}

        <SelectSlippageInput>
          <SelectSlippageInputField
            type="text"
            value={typedValue}
            inputMode="decimal"
            placeholder={t('General.SelfInput')}
            onChange={e => onInputSlippage(e.target.value)}
            onKeyDown={e => {
              if (e.code === 'KeyE') {
                e.preventDefault()
                return false
              }
            }}
          />
          <SelectSlippageInputUnit>
            <Text size={18} color="gray" weight={700}>%</Text>
          </SelectSlippageInputUnit>
          {error && (
            <SelectSlippageInputIcon>
              <Image src={ErrorIcon} alt="error" type="vector" />
            </SelectSlippageInputIcon>
          )}
        </SelectSlippageInput>

        <SelectSlippageError>
          <Text size={12}>{error}</Text>
        </SelectSlippageError>

        <SelectSlippageSubmitArea>
          <ModalSubmitButton type="secondary" onClick={() => handleSubmit()}>
            <Text weight={700}>{t('General.Confirm')}</Text>
          </ModalSubmitButton>
        </SelectSlippageSubmitArea>
      </StyledSelectSlippageModal>

      {show && portal ? createPortal(
        <RegradingHighSlippage
          onConfirm={onConfirm}
          onClose={close}
        /> as any,
        portal
      ) : null}
    </ModalWrapper>
  )
}

const HighSlippageWarning = styled('dl')`
  display: flex;
  margin-bottom: 16px;
  
  &:last-of-type {
    margin-bottom: 0;
  }
`
const HighSlippageWarningTitle = styled('dt')`
  width: 16px;
  margin-right: 14px;
`
const HighSlippageWarningText = styled('dd')`
  width: calc(100% - 30px);
`
const ConfirmHighSlippage = styled(SubmitButton)`
  width: 100%;
  height: 48px;
  bottom: 0;
  left: 0;
  position: absolute;
`