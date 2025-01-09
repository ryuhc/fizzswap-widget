import styled from 'styled-components'

import { device } from '@/styles/createBreakPoints'
import { StyledModal, StyledModalTitle } from '@/styles/modal'

export const StyledSelectSlippageModal = styled(StyledModal)`
  width: 375px;
  border-radius: 16px;
  padding: 30px 20px;

  @media ${device.md} {
    width: calc(100% - 40px);
    padding-bottom: 100px;
  }
`
export const SelectSlippageTitle = styled(StyledModalTitle)`
  margin: 30px 0 20px 0;
  
  @media ${device.md} {
    margin-bottom: 35px;
  }
`
export const SelectSlippageDesc = styled('div')`
  margin-bottom: 16px;
`
export const SelectSlippageOptions = styled('div')`
  display: flex;
  margin-bottom: 30px;
  
  @media ${device.md} {
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 20px;
  }
`
export const SelectSlippageOption: any = styled('div')`
  width: 54px;
  height: 28px;
  border: 1px solid ${({ theme }) => theme.colors.gray2};
  margin-right: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  font-size: 12px;
  position: relative;

  @media ${device.md} {
    margin-bottom: 10px;
  }
  
  &.selected {
    color: ${({ theme }) => theme.colors.white};
    background: ${({ theme }) => theme.colors.primary};
    
    span {
      font-weight: bold;
    }
  }
`
export const SelectSlippageDefaultIcon = styled('div')`
  width: 44px;
  height: 25px;
  bottom: calc(100% + 5px);
  left: 6px;
  position: absolute;
`
export const SelectSlippageInput = styled('div')`
  width: 100%;
  height: 55px;
  min-height: 48px;
  border: 1px solid ${({ theme }) => theme.colors.gray2};
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-radius: 4px;
`
export const SelectSlippageInputField = styled('input')`
  width: calc(100% - 40px);
  font-size: 16px;
`
export const SelectSlippageInputUnit = styled('div')`
  margin-left: auto;
`
export const SelectSlippageInputIcon = styled('div')`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-left: 10px;
`
export const SelectSlippageError = styled('div')`
  margin-top: 10px;
  margin-left: auto;
  color: ${({ theme }) => theme.colors.red};
  text-align: right;
`
export const SelectSlippageSubmitArea = styled(`div`)`
  width: 100%;
  height: 88px;
  position: absolute;
  display: flex;
  bottom: 0;
  left: 0;
  padding: 20px;
  
  >div {
    border-radius: 8px;
  }
`