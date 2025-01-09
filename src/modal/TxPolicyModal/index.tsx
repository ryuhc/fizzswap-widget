import React, { useCallback, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import { find } from 'lodash'
import styled from 'styled-components'

import useModal from '@/hooks/useModal'
import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'

import { ConfirmOnModal } from '@/components/ConfirmOnModal'

import { RiskDetail } from '@/modal/AboutRiskModal'
import { ModalClose } from '@/modal/ModalClose'
import { ModalWrapper } from '@/modal/ModalWrapper'

import { Text } from '@/styles/common'
import { device } from '@/styles/createBreakPoints'
import { ModalSubmitButton, StyledFullModal, StyledModalSubmitArea } from '@/styles/modal'

import { useSiteNotices } from '@/hooks/queries/useSiteNotices'

export function TxPolicyModal({ policy, onClose, onSubmit }: {
  policy?: string,
  onClose: () => void,
  onSubmit: () => void
}) {
  const {t, locale} = useTranslationSimplify()

  const notice = useSiteNotices()
  const [checkedPolicy, setCheckedPolicy] = useState<boolean>(false)
  const [showDetail, setShowDetail, portal, close] = useModal()

  const [confirmed, setConfirmed] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleSubmit = useCallback(() => {
    if (!confirmed || !checkedPolicy) {
      setError(t('Asset.NeedConfirmOurPolicy'))
      return
    }

    onSubmit()
  }, [checkedPolicy, confirmed])

  const articleData = useMemo(() => {
    if (!notice || notice.length === 0) {
      return ''
    }

    for (const item of notice) {
      if (item.key === policy) {
        return item.content
      }
    }

    return find(notice, item => {
      return item.key === (locale == 'ko' ? 'ko_final_agreement' : 'en_final_agreement')
    })?.content ?? ''
  }, [locale, notice, policy])

  return (
    <ModalWrapper>
      <StyledTxPolicyModal>
        <ModalClose onClose={onClose} />

        <article
          dangerouslySetInnerHTML={{ __html: articleData }}
        />

        <ConfirmOnModal
          checked={checkedPolicy}
          title={t('Asset.ShowOurPolicy')}
          onClick={() => {
            if (!checkedPolicy) {
              setCheckedPolicy(true)
              setShowDetail()
            }
          }}
        />

        <ConfirmOnModal
          checked={confirmed}
          title={t('Asset.ConfirmOurPolicyTitle')}
          onClick={() => setConfirmed(!confirmed)}
        />

        {error && (
          <div>
            <Text size={12} color="red">
              {error}
            </Text>
          </div>
        )}

        <StyledModalSubmitArea>
          <ModalSubmitButton type="secondary" onClick={() => handleSubmit()}>
            <Text weight={700}>{t('General.Confirm')}</Text>
          </ModalSubmitButton>
        </StyledModalSubmitArea>
      </StyledTxPolicyModal>

      {showDetail && portal && notice.length >= 2
        ? createPortal(
          (
            <RiskDetail
              article={locale === 'ko' ? notice[1] : notice[3]}
              onClose={close}
            />
          ) as any,
          portal,
        )
        : null}
    </ModalWrapper>
  )
}

const StyledTxPolicyModal = styled(StyledFullModal)`
  height: 720px;
  padding-top: 20px;
  padding-bottom: 120px;
  
  >article {
    max-height: calc(100vh - 250px);
    margin-bottom: 20px;
    overflow-y: auto;
    
    >p {
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 20px;
      padding-right: 20px;
    }
    >ul {
      list-style: disc;
      padding-left: 20px;
      
      li {
        margin-bottom: 5px;
        
        &:last-of-type {
          margin-bottom: 0;
        }
      }
    }
  }
  
  @media ${device.md} {
    height: 100%;

    >article {
      max-height: calc(100vh - 220px);
    }
  }
`