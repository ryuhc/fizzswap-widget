import styled from 'styled-components'

import { SubmitButton } from '@/styles/common'
import { device } from '@/styles/createBreakPoints'

// form common
export const StyledSwapForm = styled('section')`
  width: 100%;
  margin: 0 auto;
`

export const FormDivider = styled('div')`
  width: 100%;
  height: 5px;
  position: relative;
  z-index: 2;
  
  >div {
    width: 28px;
    height: 28px;
    top: -12.5px;
    right: 24px;
    position: absolute;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.white};
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background 0.2s ease-out;
    
    &:hover {
      background: ${({ theme}) => theme.colors.primary};
    }
    &:active {
      background: ${({ theme}) => theme.colors.primaryActive};
    }
  }
`

export const FormSubmit = styled(SubmitButton)`
  height: 56px;
  border-radius: 8px;
  animation: slideFromBottom 1s cubic-bezier(.25,.8,.25,1) forwards;
  
  img {
    margin-left: 5px;
    animation: rotate 3s cubic-bezier(.25,.8,.25,1) infinite;
  }
  
  &[type='red'] {
    background: ${({ theme }) => theme.colors.red};
  }
  &[type='blue'] {
    background: ${({ theme }) => theme.colors.blue};
  }
`

// form row
export const StyledFormRow = styled('section')`
  height: ${({ $selectable }) => {
    return $selectable ? '144px' : '64px'
  }};
  background: #f8f9fa;
  border-radius: 16px;
  padding: ${({ $selectable }) => {
    return $selectable ? '16px 24px' : '0px 20px'
  }};
  animation: slideFromRight 1s cubic-bezier(.25,.8,.25,1) forwards;
  
  >section >div {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .not-selectable {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  @media ${device.md} {
    padding: 16px;
  }
`
export const FormRowTitle = styled('section')`
  height: 40px;
  
  span {
    display: block;
    transform: translate(0px, 20px);
    transition: all 0.2s ease-out;
  }
  
  &.active {
    span {
      transform: translate(0px, 0px);
    }
  }
  
  @media ${device.md} {
    height: auto;
    
    span {
      transform: none;
    }
  }
`
export const FormSelectToken = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ $selectable }) => {
    return $selectable ? '4px 8px' : 0
  }};
  border-radius: 32px;
  background: ${({ theme, $selectable }) => $selectable ? theme.colors.white : ''};
  cursor: pointer;
  
  span {
    width: calc(100% - 48px);
    padding-right: 10px;
  }
  
  >img {
    width: 8px;
    margin-left: 7px;
  }
`
export const FormRowInputField = styled(`input`)<{ error: boolean }>`
  max-width: calc(100% - 120px);
  height: 32px;
  transition: .4s cubic-bezier(.25,.8,.25,1); 
  transition-property: color;
  line-height: 32px;
  color: ${({ theme, error }: any) => error ? theme.colors.red : theme.colors.black};
  display: block;
  border: none;
  background: none;
  padding: 0;
  font-size: 24px;
  
  &::placeholder {
    color: ${({ theme}) => theme.colors.gray6};
  }
  
  @media ${device.md} {
    max-width: 150px;
  }
`
export const FormRowSub = styled(`div`)`
  display: flex;
  align-items: center;
`

export const FormError = styled('div')`
  text-align: right;
  margin-bottom: 20px;
`

export const SwapConfigArea = styled('section')`
  display: flex;
  align-items: center;
  gap: 16px;
  
  @media ${device.sm} {
    gap: 10px;
  }
`
export const RefreshRouteButton = styled('button')`
  width: 28px;
  height: 28px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.bodyBackground};
`