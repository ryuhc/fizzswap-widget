import styled from 'styled-components'

import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'

import { Image } from '@/components/Image'

import { Paragraph, Text } from '@/styles/common'

import ErrorIcon from '@/assets/img/icon/ic-error-red.svg'
import RefreshIcon from '@/assets/img/icon/ic-refresh-primary-active.svg'

export function SwapPriceUpdated({ onRefresh }: {
  onRefresh: Function
}) {
  const {t} = useTranslationSimplify()

  return (
    <StyledSwapPriceUpdated>
      <SwapPriceUpdateBox>
        <SwapPriceUpdateBoxIcon>
          <Image src={ErrorIcon} alt="error" type="vector" />
        </SwapPriceUpdateBoxIcon>
        <SwapPriceUpdateBoxText>
          <Text size={12} color="red">{t('General.SwapPriceChanged')}</Text>
        </SwapPriceUpdateBoxText>
        <SwapPriceUpdateBoxButton onClick={() => onRefresh()}>
          <Image src={RefreshIcon} alt="refresh" type="vector" />
          <Text size={12} color="primaryActive" weight={700}>{t('General.Refresh')}</Text>
        </SwapPriceUpdateBoxButton>
      </SwapPriceUpdateBox>
      <Paragraph size={12} color="gray">{t('General.SwapPriceChangedDesc')}</Paragraph>
    </StyledSwapPriceUpdated>
  )
}

const StyledSwapPriceUpdated = styled('section')`
  margin-top: 10px;
`

const SwapPriceUpdateBox = styled('div')`
  display: flex;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: rgba(44, 218, 73, 0.05);
  margin-bottom: 10px;
`

const SwapPriceUpdateBoxIcon = styled('div')`
  width: 20px;
`

const SwapPriceUpdateBoxText = styled('div')`
  width: calc(100% - 100px);
  padding: 0 20px;
`

const SwapPriceUpdateBoxButton = styled('div')`
  width: 80px;
  height: 28px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(44, 218, 73, 0.1);
  transition: all 0.2s ease-out;
  cursor: pointer;
  
  img {
    margin-right: 5px;
  }
  
  &:hover {
    background: rgba(44, 218, 73, 0.2);
  }
  &:active {
    background: rgba(44, 218, 73, 0.3);
  }
`