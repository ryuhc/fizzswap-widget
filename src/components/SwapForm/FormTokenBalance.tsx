import styled from 'styled-components'

import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'
import { toReadableBN } from '@/utils/number'

import type { ITokenItem } from '@/hooks/queries/useTokenList'

interface IProps {
  token: ITokenItem | null
  balance: bigint
  isMax: boolean
  onClickMax: () => void
  hideMax?: boolean
}

export function FormTokenBalance({
  token,
  balance,
  isMax,
  onClickMax,
  hideMax
}: IProps) {
  const { t } = useTranslationSimplify()

  return (
    <StyledFormTokenBalance>
      <StyledTitle>{t('General.Balance')}</StyledTitle>
      <StyledValue data-testid="form-token-balance-value">
        {token && balance
          ? toReadableBN(balance ?? 0n, token?.decimal, 6, true)
          : 0}
      </StyledValue>
      {token && !hideMax ? (
        <StyledMaxButton
          data-testid="form-token-balance-max"
          ismax={isMax.toString()}
          onClick={() => onClickMax()}
        >
          max
        </StyledMaxButton>
      ) : null}
    </StyledFormTokenBalance>
  )
}

const StyledFormTokenBalance = styled(`div`)`
  font-size: 12px;
  margin-top: 10px;
  color: ${({ theme }) => theme.colors.secondaryLight};
`
const StyledTitle = styled('span')`
  font-weight: 300;
  margin-right: 10px;
`
const StyledValue = styled('span')`
  font-weight: 500;
  cursor: pointer;
`
const StyledMaxButton = styled('button')<{ ismax: string }>`
  border: 1px solid rgba(155, 164, 186, 0.5);
  background: ${({ theme, ismax }) => (ismax === 'true' ? theme.colors.secondaryLight : 'initial')};
  color: ${({ theme, ismax }) => (ismax === 'true' ? theme.colors.white : theme.colors.secondaryLight)};
  padding: 2px 5px;
  font-size: 10px;
  border-radius: 12px;
  margin-left: 8px;
`
