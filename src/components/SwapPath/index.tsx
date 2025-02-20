import styled from 'styled-components'

import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'

import { Image } from '@/components/Image'
import { TokenIcon } from '@/components/TokenIcon'

import { Text } from '@/styles/common'

import ChevronIcon from '@/assets/img/icon/ic-double-chevron-primary-right.svg'
import ErrorIcon from '@/assets/img/icon/ic-error-red.svg'
import { ITokenItem } from '@/hooks/queries/useTokenList'

interface IProps {
  isSelected: boolean
  routes: ITokenItem[]
}

export function SwapPath({ isSelected, routes }: IProps) {
  const { t } = useTranslationSimplify()

  return (
    <StyledSwapPath>
      {!isSelected ? (
        <Text>-</Text>
      ) : routes.length < 2 ? (
        <Text>
          <Image
            src={ErrorIcon}
            alt="error"
            sx={{ marginRight: '5px' }}
            type="vector"
          />
          {t('General.IsEmptyRoute')}
        </Text>
      ) : (
        routes.map((token, i) => {
          return (
            token.address && (
              <StyledSwapPathToken key={`${i}_${token.address}`}>
                <TokenIcon token={token} size={18} />
                <StyledSwapPathTokenSymbol>
                  {token.symbol}
                </StyledSwapPathTokenSymbol>
                {i < routes.length - 1 && (
                  <StyledSwapPathTokenNext>
                    <Image src={ChevronIcon} alt="next" type="vector" />
                  </StyledSwapPathTokenNext>
                )}
              </StyledSwapPathToken>
            )
          )
        })
      )}
    </StyledSwapPath>
  )
}

const StyledSwapPath = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
`
const StyledSwapPathToken = styled('div')`
  display: flex;
  align-items: center;
`
const StyledSwapPathTokenSymbol = styled(Text)`
  margin-left: 5px;
`
const StyledSwapPathTokenNext = styled('button')`
  margin: 0 10px;
`
