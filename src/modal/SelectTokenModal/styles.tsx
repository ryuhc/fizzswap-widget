import styled from 'styled-components'

import { device } from '@/styles/createBreakPoints'
import { StyledFullModal, StyledModalTitle } from '@/styles/modal'

export const StyledSelectTokenModal = styled(StyledFullModal)`
  padding: 30px 0 !important;
`

export const StyledSelectTokenTitle = styled(StyledModalTitle)`
  padding: 0 30px;
  margin-bottom: 40px;
  
  @media ${device.md} {
    padding: 0 20px;
    margin-bottom: 0;
  }
`

export const StyledTokenTable = styled('section')``

export const StyledTokenTableHeader = styled('div')`
  padding: 0 40px;
  margin: 30px 0 15px 0;
  display: flex;
  align-items: center;

  @media ${device.md} {
    padding: 0 20px;
  }
`

export const StyledTokenTableHeaderCol = styled('div')`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 12px;
  
  &.token {
    width: 40%;
    padding-right: 10px;
  }
  
  &.price {
    width: 30%;
    text-align: right;
  }
  
  &.balance {
    width: 30%;
    text-align: right;
  }
`

export const StyledTokenTableScrollable = styled('div')`
  height: 330px;
  padding: 0 30px;
  overflow: auto;
  
  @media ${device.md} {
    height: auto;
    max-height: calc(100vh - 200px);
    padding: 0 20px;
  }
`
export const StyledTokenTableRow = styled('div')<{ selected: boolean }>`
  transition: all .2s ease-out;
  background-color: ${({ theme }) => theme.colors.bodyBackground};
  border: 1px solid ${({ theme, selected }) => selected ? theme.colors.primary : 'transparent'};
  padding: 0 16px;
  height: 60px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  
  &:hover, &:active {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  @media ${device.md} {
    padding: 0 10px;
  }
`
export const StyledTokenTableRowCol = styled('div')`
  &.token {
    width: 45%;
    padding-right: 10px;
    display: flex;
    align-items: center;
  }
  
  &.price {
    width: 25%;
    text-align: right;
  }
  
  &.balance {
    width: 30%;
    text-align: right;
  }
`
export const StyledTokenTableRowColToken = styled('div')`
  flex: 1;
  padding-left: 10px;
  
  p {
    line-height: 1.2;
    word-break: break-all;
  }
`

export const StyledTokenSearchBar = styled('div')`
  margin: 0 30px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray2};
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 10px;

  @media ${device.md} {
    margin: 40px 20px 0 20px;
  }
  
  .searchbar {
    width: calc(100% - 110px);
    height: auto;
    border: none;
    padding: 0;
  }
  
  &.v3 {
    height: 40px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.gray2};
    padding: 11px 16px;
    margin-top: 32px;
    
    input::placeholder {
      font-weight: bold;
    }

    .searchbar {
      width: 100%;
    }
  }
`
export const StyledTokenFilterOption = styled('div')`
  max-width: 120px;
  border-left: 1px solid ${({ theme }) => theme.colors.gray2};
  padding-left: 10px;
`