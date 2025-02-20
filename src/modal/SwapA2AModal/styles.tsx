import styled from 'styled-components'

import { StyledModal } from '@/styles/modal'

export const StyledSwapA2AModal = styled(StyledModal)`
  padding: 0;
  min-height: auto;
  background: ${({ theme }) => theme.colors.gray4};
`

export const SwapA2AQrWrapper = styled('section')`
  padding: 35px 30px 30px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const SwapA2AQr = styled('section')`
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
  margin: 0 auto 12px auto;
`

export const SwapA2AQrTimer = styled('div')`
  margin-bottom: 16px;
  
  >span >span {
    color: #e56d16;
    font-weight: 500;
  }
`

export const SwapA2AQrWarning = styled('div')`
  max-width: 250px;
  margin: 0 auto;
  text-align: center;
`

export const SwapA2AQrNotice = styled('section')`
  padding: 30px;
  background: ${({ theme }) => theme.colors.white};
`

export const SwapA2AActionFlow = styled('section')`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const SwapA2AActionFlowText = styled('div')`
  margin-right: 20px;
  
  &:last-of-type {
    margin-right: 0;
  }
`

export const SwapA2AActionFlowIcon = styled('div')`
  text-align: center;
  
  img {
    margin-bottom: 10px;
  }
`
