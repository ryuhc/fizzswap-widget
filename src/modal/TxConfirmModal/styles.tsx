import styled from 'styled-components'

import { device } from '@/styles/createBreakPoints'
import { StyledFullModal, StyledModalTitle } from '@/styles/modal'

export const StyledTxConfirmModal = styled(StyledFullModal)``
export const StyledTxConfirmTitle = styled(StyledModalTitle)`
  margin-bottom: 20px;
  
  @media ${device.md} {
    margin-bottom: 35px;
  }
`
export const StyledTxConfirmEventLabel = styled('section')`
  font-size: 16px;
  margin-bottom: 15px;
`

export const StyledTxEventBody = styled('section')`
`
export const StyledTxEventDetail = styled('section')`
  min-height: 45px;
  border-top: 1px solid ${({ theme }) => theme.colors.gray2};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray2};
  position: relative;
  padding: 20px 0;
`

export const StyledTxEventNotice = styled('section')`
  margin-top: 30px;
`
export const StyledTxEventNoticeItems = styled('ul')``
export const StyledTxEventNoticeItem = styled('li')`
  position: relative;
  margin-bottom: 10px;
  padding-left: 10px;
  
  &:last-of-type {
    margin-bottom: 0;
  }

  &::after {
    width: 4px;
    height: 4px;
    top: 8px;
    left: 0;
    position: absolute;
    background: ${({ theme }) => theme.colors.gray5};
    content: " ";
  }

  a {
    text-decoration: underline;
  }
`

export const StyledTxEventRow = styled('div')`
  line-height: 1;
  margin-bottom: 20px;
  display: flex;
  align-items: center;

  &:last-of-type {
    margin-bottom: 0;
  }
`
export const StyledTxEventRowTitle = styled('div')`
  width: 100px;
`
export const StyledTxEventRowValue = styled('div')`
  width: calc(100% - 100px);
  text-align: right;
`
export const StyledTxEventEstimated = styled('section')`
  margin-top: 20px;
`
export const StyledTxEventEstimatedRow = styled('div')`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  
  &:last-of-type {
    margin-bottom: 0;
  }
`
export const StyledTxEventEstimatedRowTitle = styled('div')`
  width: 150px;
  display: flex;
`
export const StyledTxEventEstimatedRowValue = styled('div')`
  width: calc(100% - 150px);
  text-align: right;
  word-break: break-all;
  line-height: 1.3;
`
