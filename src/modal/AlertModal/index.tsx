import React, { useCallback, useEffect, useMemo, useState } from 'react'

import styled from 'styled-components'

import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'

import { Image } from '@/components/Image'

import { ModalWrapper } from '@/modal/ModalWrapper'

import { IAlert } from '@/state/common'

import { Text } from '@/styles/common'
import { device } from '@/styles/createBreakPoints'
import {
  ModalSubmitButton,
  StyledModal,
  StyledModalSubmitArea
} from '@/styles/modal'

interface IProps extends IAlert {
  onClose: () => void
}

export function AlertModal({
  icon,
  text,
  hideIcon,
  submitTitle,
  callback,
  cancelTitle,
  onCancel,
  onClose
}: IProps) {
  const { t } = useTranslationSimplify()
  const handleSubmit = useCallback(() => {
    onClose()

    setTimeout(() => {
      callback && callback()
    }, 100)
  }, [callback, onClose])

  const [isAlertOverlay, setIsAlertOverlay] = useState<boolean>(false)
  const alertStyle = useMemo(() => {
    if (isAlertOverlay) {
      return {
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
      }
    }

    return {}
  }, [isAlertOverlay])

  useEffect(() => {
    setTimeout(() => {
      const modalOverlay = document.querySelector('#modal-overlay')

      if (Number(modalOverlay?.childNodes?.length) > 1) {
        setIsAlertOverlay(true)
      }
    }, 100)
  }, [])

  return (
    <ModalWrapper customStyle={alertStyle}>
      <StyledAlertModal>
        {!hideIcon && (
          <AlertModalIcon>
            <Image
              src={icon ?? '/img/icon/ic-modal-error.svg'}
              alt="alert"
              type="vector"
            />
          </AlertModalIcon>
        )}

        <AlertModalText>
          <Text
            size={14}
            color="black4"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </AlertModalText>

        <StyledModalSubmitArea data-type="alert">
          {cancelTitle && (
            <ModalSubmitButton
              type="gray2"
              style={{ width: '50%' }}
              onClick={() => {
                onClose()
                onCancel && onCancel()
              }}
            >
              <Text size={16} weight={700}>
                {cancelTitle ?? t('General.Cancel')}
              </Text>
            </ModalSubmitButton>
          )}

          <ModalSubmitButton
            type="secondary"
            style={{ width: cancelTitle ? '50%' : '100%' }}
            onClick={() => handleSubmit()}
          >
            <Text size={16} weight={700}>
              {submitTitle ?? t('General.Confirm')}
            </Text>
          </ModalSubmitButton>
        </StyledModalSubmitArea>
      </StyledAlertModal>
    </ModalWrapper>
  )
}

const StyledAlertModal = styled(StyledModal)`
  padding: 80px 30px 120px 30px;
  min-height: 320px;

  @media ${device.md} {
    padding: 80px 20px 120px 20px;
  }
`

const AlertModalIcon = styled('div')`
  margin-bottom: 20px;
  text-align: center;

  img {
    height: 28px;
  }
`

const AlertModalText = styled('article')`
  text-align: center;
  font-size: 14px;
`
