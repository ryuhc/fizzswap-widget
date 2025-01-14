import React from 'react'

import styled from 'styled-components'

import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'
import { IAboutPriceImpact } from '@/hooks/useTxPolicy'
import { dprec } from '@/utils/number'

import { ExchangeRate } from '@/components/ExchangeRate'

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

import { useIsMobile } from '@/hooks/ui/useIsMobile'

export function AboutPriceImpactModal({
  params,
  onClose,
  onSubmit,
}: {
  params: IAboutPriceImpact
  onClose: () => void
  onSubmit: () => void
}) {
  const {t} = useTranslationSimplify()

  const { pool, assetType, token0, token1 } = params

  const token0Info = assetType === 1 ? token0 : token1
  const token1Info = assetType === 1 ? token1 : token0

  const defaultRate =
    assetType === 1 ? pool?.token0BasePrice : pool?.token1BasePrice

  const isMobile = useIsMobile()

  return (
    <ModalWrapper>
      <StyledAboutPriceImpactModal>
        <StyledModalTitle>{t('General.PIWarnPop')}</StyledModalTitle>
        <ModalClose onClose={onClose} />

        <AboutPriceImpactWarning>
          <div
            dangerouslySetInnerHTML={{
              __html: t
                .raw('General.PIWarnPop1')
                .replace('{rate}', dprec(params.value, 2)),
            }}
          />
        </AboutPriceImpactWarning>

        <AboutPriceImpactInfo>
          <dl>
            <dt>
              <Text size={12} weight={700}>
                {t('V3.PairDespoitV3MainAllCurrPrice')}
              </Text>
            </dt>
            <dd>
              <ExchangeRate
                version={2}
                tokenA={token0Info}
                tokenB={token1Info}
                rate={defaultRate}
              />
            </dd>
          </dl>
          <dl>
            <dt>
              <Text size={12} weight={700}>
                {t('General.PIWarnPop2')}
              </Text>
            </dt>
            <dd>
              <ExchangeRate
                version={2}
                tokenA={token0Info}
                tokenB={token1Info}
                rate={params.rate}
              />
            </dd>
          </dl>
          <dl>
            <dt>
              <Text size={12} weight={700}>
                {t('General.DiffFromCurrentRate')}
              </Text>
            </dt>
            <dd>
              <Text weight={700} color="#e56d16" size={16}>
                -{dprec(params.value, 2)}%
              </Text>
            </dd>
          </dl>
        </AboutPriceImpactInfo>

        <StyledModalSubmitArea>
          <ModalSubmitButton type="secondary" onClick={() => onSubmit()}>
            <Text weight={700}>{t('General.PIWarnPop3')}</Text>
          </ModalSubmitButton>
        </StyledModalSubmitArea>
      </StyledAboutPriceImpactModal>
    </ModalWrapper>
  )
}

const StyledAboutPriceImpactModal = styled(StyledFullModal)`
  height: 600px;

  @media ${device.md} {
    height: 100%;
  }
`

const AboutPriceImpactWarning = styled('section')`
  margin: 40px 0;

  * {
    font-size: 12px;
    line-height: 22px;
  }

  strong:nth-of-type(1) {
    color: #e56d16;
  }
`
const AboutPriceImpactInfo = styled('section')`
  background: rgba(243, 151, 85, 0.05);
  border: 1px solid #f39755;
  padding: 20px;
  border-radius: 1px;

  dl {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    dt {
      width: 100px;
    }

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  .exchange-rate {
    span {
      font-size: 12px;
    }

    > div {
      text-align: right;
      
      >span:nth-of-type(1) {
        color: ${({ theme }) => theme.colors.black};
      }

      >span:nth-of-type(2) {
        color: ${({ theme }) => theme.colors.gray};
      }
    }
  }
`
