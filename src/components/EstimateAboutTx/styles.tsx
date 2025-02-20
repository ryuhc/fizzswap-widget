import styled from 'styled-components'

export const EstimateAboutTxItems = styled('ul')``

export const EstimateAboutTxItem = styled('li')`
  display: flex;
  align-items: center;
  margin-bottom: 7px;
  gap: 8px;
`

export const EstimateAboutTxItemTitle = styled('div')`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray};
`
export const EstimateAboutTxItemValue = styled('div')`
  font-size: 12px;
  text-align: right;
  display: flex;
  justify-content: flex-end;
  color: ${({ theme }) => theme.colors.black4};
`
