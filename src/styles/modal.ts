import styled from 'styled-components'

import { SubmitButton } from '@/styles/common'
import { device } from '@/styles/createBreakPoints'

export const StyledModal = styled('div')`
  width: 480px;
  min-height: 480px;
  padding: 30px 30px 78px 30px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  
  @media ${device.md} {
    width: calc(100vw - 20px);
    min-height: 320px;
  }

  position: relative;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
`

export const StyledFullModal = styled(StyledModal)`
  @media ${device.md} {
    width: 100%;
    height: 100%;
    position: fixed;
    overflow-x: hidden;
    overflow-y: scroll;
    margin: 0;
    top: 0;
    left: 0;
    padding-left: 20px;
    padding-right: 20px;

    .modal-close {
      position: fixed;
    }
  }
`

export const StyledModalTitle = styled('div')`
  font-size: 20px;
  font-weight: bold;
`

export const StyledModalSubmitArea = styled('div')`
  width: 100%;
  height: 56px;
  position: absolute;
  display: flex;
  bottom: 0;
  left: 0;

  @media ${device.md} {
    position: fixed;
    
    &[data-type=alert] {
      position: absolute;
    }
  }
`

export const ModalSubmitButton = styled(SubmitButton)`
  width: 100%;
  height: 100%;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`
