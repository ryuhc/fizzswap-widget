import styled from 'styled-components'

import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'

import { Image } from '@/components/Image'

import { Paragraph, Text } from '@/styles/common'

import CheckIconGray from '@/assets/img/icon/ic-check-gray.svg'
import CheckIconWhite from '@/assets/img/icon/ic-check-wh.svg'

const StyledTxAgreement = styled('section')``
const StyledTxAgreementBox = styled('section')`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border: 1px solid ${({ theme }) => theme.colors.gray2};
  margin-bottom: 10px;
  border-radius: 10px;
  cursor: pointer;
`
const StyledTxAgreementCheck: any = styled('div')`
  width: 28px;
  height: 28px;
  transition: all 0.2s ease-out;
  background-color: ${({ theme, isActive }: any) => (isActive ? theme.colors.primary : theme.colors.white)};
  border: 1px solid ${({ theme, isActive }: any) => (isActive ? theme.colors.primary : theme.colors.gray2)};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`
const StyledTxAgreementText = styled('div')`
  width: calc(100% - 28px);
  padding-left: 10px;
`
const StyledTxAgreementError = styled('section')``

interface IProps {
  checked: boolean
  isError: boolean
  onCheck: () => void
}

export function TxAgreement({ checked, isError, onCheck }: IProps) {
  const { t } = useTranslationSimplify()

  return (
    <StyledTxAgreement className="tx-agreement">
      <StyledTxAgreementBox onClick={() => onCheck()}>
        <StyledTxAgreementCheck isActive={checked}>
          <Image
            src={checked ? CheckIconWhite : CheckIconGray}
            alt="check"
            type="vector"
          />
        </StyledTxAgreementCheck>

        <StyledTxAgreementText>
          <Text size={14} weight={700}>
            {t('General.SelectUnsafeTokenAboutConfirm')}
          </Text>
        </StyledTxAgreementText>
      </StyledTxAgreementBox>

      <StyledTxAgreementError>
        <Paragraph>{isError ? t('Asset.NeedConfirmOurPolicy') : ''}</Paragraph>
      </StyledTxAgreementError>
    </StyledTxAgreement>
  )
}
