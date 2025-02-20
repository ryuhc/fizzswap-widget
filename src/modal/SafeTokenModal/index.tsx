import { useCallback, useState } from 'react'

import styled from 'styled-components'
import { useChainId } from 'wagmi'

import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'
import { getMaskedAddress } from '@/utils/address'
import { pickTokenName } from '@/utils/common'

import { ConfirmOnModal } from '@/components/ConfirmOnModal'
import { TokenIcon } from '@/components/TokenIcon'

import {
  AboutRiskHideForWeek,
  AboutRiskHideForWeekCheck,
  AboutRiskHideForWeekTitle
} from '@/modal/AboutRiskModal'
import { ModalWrapper } from '@/modal/ModalWrapper'

import { Paragraph, Text } from '@/styles/common'
import { device } from '@/styles/createBreakPoints'
import {
  ModalSubmitButton,
  StyledFullModal,
  StyledModalSubmitArea,
  StyledModalTitle
} from '@/styles/modal'

import CheckIconWhite from '@/assets/img/icon/ic-check-wh.svg'
import ErrorIcon from '@/assets/img/icon/ic-error-primary.svg'
import { Image } from '@/components/Image/index'
import { EXPLORER_URLS, SUPPORT_CHAIN_IDS } from '@/constants/chain'
import { ITokenItem } from '@/hooks/queries/useTokenList'
import { useIsMobile } from '@/hooks/ui/useIsMobile'

interface IProps {
  tokens: ITokenItem[]
  onConfirm: (tokensForHide?: ITokenItem[]) => void
  onClose: () => void
}

export function SafeTokenModal({ tokens, onConfirm, onClose }: IProps) {
  const { t, locale } = useTranslationSimplify()
  const [checked, setChecked] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  const chainId = useChainId() as SUPPORT_CHAIN_IDS

  const [disabled, setDisabled] = useState<boolean>(false)
  const handleSubmit = useCallback(() => {
    if (!checked) {
      setError(true)
      return
    }

    onConfirm(disabled ? tokens : undefined)
  }, [tokens, checked, disabled])

  const isMobile = useIsMobile()

  return (
    <ModalWrapper>
      <StyledSafeTokenModal>
        <StyledModalTitle>
          {t('General.SelectUnsafeTokenTitle')}
        </StyledModalTitle>

        <SafeTokenAlertBox>
          <div className="scrollable">
            <SafeTokenAlertIcon>
              <Image src={ErrorIcon} alt="error alert" />
            </SafeTokenAlertIcon>

            <SafeTokenAlertTokens>
              {tokens.map((token) => {
                return (
                  <SafeTokenAlertTokenItem key={token.address}>
                    <SafeTokenAlertTokenItemLogo>
                      <TokenIcon token={token} size={20} />
                    </SafeTokenAlertTokenItemLogo>

                    <SafeTokenAlertTokenItemName>
                      <Text size={14} weight={700}>
                        {token.symbol}
                      </Text>
                      <Text
                        size={12}
                        color="black2"
                        style={{ margin: '0 5px' }}
                      >
                        ({pickTokenName(token, locale)})
                      </Text>
                      <Text size={12} color="blue">
                        {getMaskedAddress(token.address, 4, 4, 3)}
                      </Text>
                    </SafeTokenAlertTokenItemName>

                    <SafeTokenAlertTokenItemLink
                      href={`${EXPLORER_URLS[chainId]}/token/${token.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Text size={12} color="primaryActive" weight={700}>
                        View
                      </Text>
                    </SafeTokenAlertTokenItemLink>
                  </SafeTokenAlertTokenItem>
                )
              })}
            </SafeTokenAlertTokens>

            <Paragraph size={12} style={{ marginTop: '20px' }}>
              {t('General.SelectUnsafeTokenNotice1')}
            </Paragraph>
            <Paragraph size={12} style={{ marginTop: '20px' }}>
              {t('General.SelectUnsafeTokenNotice2')}
            </Paragraph>
            <Paragraph size={12}>
              {t('General.SelectUnsafeTokenNotice3')}
            </Paragraph>
          </div>
        </SafeTokenAlertBox>

        <ConfirmOnModal
          checked={checked}
          title={t('General.SelectUnsafeTokenAboutConfirm')}
          onClick={() => setChecked(!checked)}
        />

        <SafeTokenAlertError>
          {error && (
            <Paragraph size={12} color="red">
              {t('Asset.NeedConfirmOurPolicy')}
            </Paragraph>
          )}
        </SafeTokenAlertError>

        <AboutRiskHideForWeek
          style={
            !isMobile
              ? {}
              : {
                  width: '100%',
                  left: 0,
                  position: 'fixed',
                  backgroundColor: '#fff',
                  padding: '25px 0 25px 20px',
                  bottom: '56px'
                }
          }
          onClick={() => setDisabled(!disabled)}
        >
          <AboutRiskHideForWeekCheck checked={disabled}>
            <Image src={CheckIconWhite} alt="check" type="vector" />
          </AboutRiskHideForWeekCheck>
          <AboutRiskHideForWeekTitle>
            <Text size={12}>{t('Asset.DisableWarning')}</Text>
          </AboutRiskHideForWeekTitle>
        </AboutRiskHideForWeek>

        <StyledModalSubmitArea>
          <ModalSubmitButton type="secondary" onClick={() => handleSubmit()}>
            <Text size={16} weight={700}>
              {t('General.Submit')}
            </Text>
          </ModalSubmitButton>
        </StyledModalSubmitArea>
      </StyledSafeTokenModal>
    </ModalWrapper>
  )
}

const StyledSafeTokenModal = styled(StyledFullModal)`
  min-height: 560px;
  padding-bottom: 120px;

  @media ${device.md} {
    min-height: 100%;
  }
`

const SafeTokenAlertBox = styled('section')`
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: rgba(44, 218, 73, .05);
  margin: 20px 0;
  
  >div {
    width: 100%;
    max-height: 400px;
    padding: 20px;
    overflow-y: auto;
  }
`

const SafeTokenAlertIcon = styled('div')`
  text-align: center;
  margin-bottom: 20px;
`

const SafeTokenAlertTokens = styled('div')`
  margin-bottom: 25px;
`

const SafeTokenAlertTokenItem = styled('div')`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  
  &:last-of-type {
    margin-bottom: 0;
  }
`

const SafeTokenAlertTokenItemLogo = styled('div')``
const SafeTokenAlertTokenItemName = styled('div')`
  flex: 1;
  padding: 0 10px;
`
const SafeTokenAlertTokenItemLink = styled('a')`
  width: 48px;
  height: 20px;
  display: block;
  text-align: center;
  
  &:hover, &:active {
    background-color: rgba(44, 218, 73, .1);
    transition: background-color .4s ease-out;
  }
`

const SafeTokenAlertError = styled('section')``
