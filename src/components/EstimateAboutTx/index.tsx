import React from 'react'

import styled from 'styled-components'

import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'

import { ExchangeRate } from '@/components/ExchangeRate'
import { CommonTooltip } from '@/components/Tooltip'

import { Text } from '@/styles/common'

import {
  EstimateAboutTxItem,
  EstimateAboutTxItems,
  EstimateAboutTxItemTitle,
  EstimateAboutTxItemValue
} from '@/components/EstimateAboutTx/styles'
import { ITokenItem } from '@/hooks/queries/useTokenList'

interface IProps {
  title?: string
  tooltip?: string
  version?: number
  slippage: number
  rateInfo: {
    tokenA: ITokenItem
    tokenB: ITokenItem
    rate: string
  }
  priceImpact: number
  children: React.ReactNode
  showTitle?: boolean
  showRate?: boolean
  showPriceImpaction?: boolean
  onReverse?: (flag: boolean) => void
  defaultReverse?: boolean
}

export function EstimateAboutTx({
  title,
  tooltip,
  version = 2,
  slippage,
  rateInfo,
  priceImpact,
  children,
  showTitle = true,
  showRate = true,
  showPriceImpaction = true,
  onReverse,
  defaultReverse
}: IProps) {
  const { t } = useTranslationSimplify()

  return (
    <StyledEstimateAboutTx>
      {showTitle && (
        <StyledEstimateAboutTxTitle>
          <Text color="black2" weight={700}>
            {title || t('General.EstimatedAboutAction')}
            <CommonTooltip
              tooltipId="aboutEstimated"
              content={tooltip || t('General.EstimatedAboutAction')}
            />
          </Text>
        </StyledEstimateAboutTxTitle>
      )}
      {children}
    </StyledEstimateAboutTx>
  )
}

export const StyledEstimateAboutTx = styled('section')`
  width: 100%;
  padding: 30px 0 10px 0;
`

export const StyledEstimateAboutTxTitle = styled('h6')`
  margin-bottom: 10px;
`
