import styled from 'styled-components'

import { device } from '@/styles/createBreakPoints'
import { StyledFullModal } from '@/styles/modal'

export const StyledSelectWalletModal = styled(StyledFullModal)`
  min-height: auto;
  padding-bottom: 30px;
`
export const SelectWalletModalDesc = styled('section')`
  margin: 45px 0 40px 0;
  text-align: center;
  
  @media ${device.md} {
    margin: 50px 0;
  }
`

export const SelectWalletToKlip = styled('button')`
  width: 100%;
  height: 60px;
  gap: 5px;
  border-radius: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fee500;
  margin-bottom: 20px;
`

export const SelectWalletToKlipNotice = styled('section')`
  height: 75px;
  text-align: center;

  @media ${device.md} {
    height: 110px;
  }
`

export const SelectWalletAreaBorder = styled('section')`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  
  hr {
    flex: 2;
    height: 1px;
    border: none;
    background: ${({ theme }) => theme.colors.gray2};
  }
`


export const SelectWalletConnectors = styled('section')``

export const SelectWalletConnector = styled('section')`
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  border-radius: 4px;
  gap: 10px;
  cursor: pointer;
  
  &:last-of-type {
    margin-bottom: 0;
  }
`

export const SelectWalletConnectorIcon = styled('div')`
  width: 32px;
  height: 32px;
  margin-top: 5px;
  
  img {
    height: 32px;
  }
`

export const SelectWalletErrorArea = styled('section')`
  height: auto;
  min-height: 150px;
  padding-top: 40px;
`

export const SelectWalletErrorTarget = styled('div')``

export const SelectWalletErrorContent = styled('div')`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const SelectWalletErrorMessage = styled('div')`
  text-align: center;
  margin-top: 5px;
`

export const SelectWalletRetryButton = styled('button')`
  width: 100%;
  height: 60px;
  background: #f5f7fa;
  transition: all 0.2s ease-out;
  margin-top: 50px;
  border-radius: 8px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.white};
    background: ${({ theme }) => theme.colors.secondary};
  }
  &:active {
    color: ${({ theme }) => theme.colors.white};
    background: ${({ theme }) => theme.colors.secondaryActive};
  }
`