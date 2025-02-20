import { useCallback, useEffect, useMemo, useState } from 'react'

import styled from 'styled-components'

import { addComma, divBN, dprec, getSignificantFigures } from '@/utils/number'

import { Image } from '@/components/Image'

import { Text } from '@/styles/common'

import ConvertIcon from '@/assets/img/icon/ic-convert-secondary.svg'
import { ITokenItem } from '@/hooks/queries/useTokenList'

interface IProps {
  version?: number
  tokenA: ITokenItem
  tokenB: ITokenItem
  rate: string
  type?: number
  defaultReverse?: boolean
  onReverse?: (reverse: boolean) => void
}

const StyledExchangeRate = styled('div')`
  display: flex;
  justify-content: flex-end;
  
  >button {
    margin-top: 4px;
  }
`
export const StyledExchangeRateConvert = styled('button')`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 8px;
`

export function ExchangeRate({
  version = 2,
  tokenA,
  tokenB,
  rate,
  type,
  defaultReverse,
  onReverse
}: IProps) {
  const [reverse, setReverse] = useState<boolean>(false)
  const onClickReverse = useCallback(() => {
    setReverse(!reverse)

    if (onReverse) {
      onReverse(!reverse)
    }
  }, [onReverse, reverse])

  useEffect(() => {
    setReverse(!!defaultReverse)
  }, [defaultReverse])

  const tokens = useMemo(() => {
    return {
      tokenA: reverse ? tokenB : tokenA,
      tokenB: reverse ? tokenA : tokenB
    }
  }, [tokenA, tokenB, reverse])
  const selectedRate = useMemo(() => {
    return reverse ? divBN('1', rate) : rate
  }, [reverse, rate])

  return (
    <StyledExchangeRate className="exchange-rate">
      {version === 2 && (
        <StyledExchangeRateConvert
          data-testid="exchange-rate-convert"
          onClick={() => onClickReverse()}
        >
          <Image src={ConvertIcon as string} alt="convert" type="vector" />
        </StyledExchangeRateConvert>
      )}

      {tokenA.address && tokenB.address ? (
        <Text size={type === 1 ? 12 : 14} weight={700}>
          <Text weight={700} data-testid="exchange-rate-value">
            {addComma(dprec(selectedRate, getSignificantFigures(selectedRate)))}
          </Text>{' '}
          {tokens.tokenB.symbol}
        </Text>
      ) : (
        <Text>-</Text>
      )}
    </StyledExchangeRate>
  )
}
