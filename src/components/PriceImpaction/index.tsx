import { useMemo } from 'react'

import styled from 'styled-components'

import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'
import { dprec } from '@/utils/number'

import { Paragraph, Text } from '@/styles/common'


const StyledPriceImpaction = styled('div')``

interface IProps {
  priceImpact: number
}

export function PriceImpaction({ priceImpact }: IProps) {
  const {t} = useTranslationSimplify()
  const valueColor = useMemo(() => {
    if (priceImpact < 5) {
      return 'paleGreen'
    } else if (priceImpact >= 5 && priceImpact < 10) {
      return 'tertiary'
    }

    return 'red'
  }, [priceImpact])
  const formattedValue = useMemo(() => {
    if (priceImpact <= 0.01) {
      return '< 0.01'
    }

    return dprec(priceImpact, 2)
  }, [priceImpact])

  return (
    <StyledPriceImpaction>
      <Paragraph size={12}>
        <Text color="gray">{t('General.DiffFromCurrentRate')} </Text>
        <Text color={valueColor} weight={700} data-testid="priceimpact-value">{formattedValue}%</Text>
      </Paragraph>
    </StyledPriceImpaction>
  )
}