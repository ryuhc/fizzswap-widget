import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'

import styled from 'styled-components'

import useModal from '@/hooks/useModal'
import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'

import { ConfirmOnModal } from '@/components/ConfirmOnModal'
import { Image } from '@/components/Image'

import { ModalClose } from '@/modal/ModalClose'
import { ModalWrapper } from '@/modal/ModalWrapper'

import { Text } from '@/styles/common'
import { device } from '@/styles/createBreakPoints'
import {
  ModalSubmitButton,
  StyledFullModal,
  StyledModalSubmitArea,
  StyledModalTitle,
} from '@/styles/modal'

import CheckIconWhite from '@/assets/img/icon/ic-check-wh.svg'
import { useSiteNotices } from '@/hooks/queries/useSiteNotices'

interface IProps {
  onDisabled: () => void
  onClose: () => void
}

export function RiskDetail({
  article,
  onClose,
}: {
  article: {
    title: string
    content: string
  }
  onClose: () => void
}) {
  const {t} = useTranslationSimplify()

  return (
    <ModalWrapper>
      <StyledRiskDetail>
        <ModalClose onClose={onClose} />
        <RiskDetailTitle>{article.title}</RiskDetailTitle>

        <RiskDetailArticle
          className="scrollable"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <StyledModalSubmitArea>
          <ModalSubmitButton type="secondary" onClick={onClose}>
            <Text size={16} weight={700}>
              {t('General.Submit')}
            </Text>
          </ModalSubmitButton>
        </StyledModalSubmitArea>
      </StyledRiskDetail>
    </ModalWrapper>
  )
}

export function AboutRiskModal({ onDisabled, onClose }: IProps) {
  const [error, setError] = useState<string>('')
  const [checked, setChecked] = useState<boolean>(false)
  const [confirmed, setConfirmed] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(false)

  const notice = useSiteNotices()
  const [showDetail, setShowDetail, portal, closeDetail] = useModal()

  const {t, locale} = useTranslationSimplify()
  const handleSubmit = useCallback(() => {
    if (!checked || !confirmed) {
      setError(t('Asset.NeedConfirmOurPolicy'))
      return
    }

    onClose()
    onDisabled()
  }, [checked, confirmed, disabled, onDisabled, onClose])

  return (
    <ModalWrapper>
      <StyledAboutRiskModal>
        <StyledModalTitle>Risks ＆ Security</StyledModalTitle>

        <article
          className="scrollable"
          style={{
            margin: '20px 0',
            overflowY: 'auto'
          }}
          dangerouslySetInnerHTML={{
            __html: (locale === 'ko' ? notice[0] : notice[2])?.content ?? '',
          }}
        />

        <ConfirmOnModal
          checked={checked}
          title={t('Asset.ShowOurPolicy')}
          onClick={() => {
            if (!checked) {
              setChecked(true)
              setShowDetail()
            }
          }}
        />

        <div style={{ margin: '5px 0' }} />

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

        <AboutRiskHideForWeek onClick={() => setDisabled(!disabled)}>
          <AboutRiskHideForWeekCheck checked={disabled}>
            <Image src={CheckIconWhite} alt="check" type="vector" />
          </AboutRiskHideForWeekCheck>
          <AboutRiskHideForWeekTitle>
            <Text size={12}>{t('Asset.DisableWarning')}</Text>
          </AboutRiskHideForWeekTitle>
        </AboutRiskHideForWeek>

        <StyledModalSubmitArea>
          <ModalSubmitButton type="secondary" onClick={handleSubmit}>
            <Text size={16} weight={700}>
              {t('General.Submit')}
            </Text>
          </ModalSubmitButton>
        </StyledModalSubmitArea>

        {showDetail && portal && notice.length >= 2
          ? createPortal(
              (
                <RiskDetail
                  article={locale === 'ko' ? notice[1] : notice[3]}
                  onClose={closeDetail}
                />
              ) as any,
              portal,
            )
          : null}
      </StyledAboutRiskModal>
    </ModalWrapper>
  )
}

const StyledAboutRiskModal = styled(StyledFullModal)`
  height: 720px;
  padding-bottom: 120px;

  @media ${device.md} {
    height: 100%;
  }
`

export const AboutRiskHideForWeek = styled('div')`
  width: calc(100% - 60px);
  height: 20px;
  left: 30px;
  bottom: 86px;
  position: absolute;
  display: flex;
  align-items: center;
`

export const AboutRiskHideForWeekCheck = styled('div')<{ checked: boolean }>`
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  border: 1px solid
    ${({ theme, checked }) => (checked ? 'transparent' : theme.colors.gray5)};
  cursor: pointer;
  transition: all 0.2s ease-out;
  background: ${({ theme, checked }) =>
    checked ? theme.colors.primary : 'transparent'};
`
export const AboutRiskHideForWeekTitle = styled('div')`
  width: calc(100% - 18px);
  font-size: 12px;
  padding-left: 10px;
`

const StyledRiskDetail = styled(StyledFullModal)`
  width: 850px;
  height: 850px;
  padding: 30px 0 56px 0;

  @media ${device.md} {
    width: 100%;
    height: 100%;
    padding: 30px 0;
  }
`
const RiskDetailArticle = styled('article')`
  padding: 0 30px;
  position: relative;
  margin-top: 40px;
  height: calc(100% - 105px);
  overflow-y: auto;

  * {
    font-size: 14px;
  }
`
const RiskDetailTitle = styled(StyledModalTitle)`
  padding: 0 30px;
`
