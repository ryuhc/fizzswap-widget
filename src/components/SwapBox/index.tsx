import styled from 'styled-components'

import { SwapForm } from '@/components/SwapForm'
import { SwapTab } from '@/components/SwapTab'

import { FORM_WIDTH } from '@/styles/common'
import { device } from '@/styles/createBreakPoints'


export function SwapBox() {
  return (
    <StyledSwapBox>
      <SwapTab />
      <SwapForm />
    </StyledSwapBox>
  )
}

const StyledSwapBox = styled('section')`
  width: 100%;
  max-width: ${FORM_WIDTH};
  margin: 0 auto;
  padding: 40px;
  border-radius: 24px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid rgba(0, 0, 0, 0.1);
  
  @media ${device.sm} {
    padding: 30px;
  }
  
  @media screen and (max-width: ${FORM_WIDTH})  {
    border-radius: 0;
  }
`