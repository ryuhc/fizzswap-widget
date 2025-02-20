import styled from 'styled-components'

import { Image } from '@/components/Image'

import SearchIcon from '@/assets/img/icon/ic-search-btn.svg'

interface IProps {
  typedValue: string
  placeholder?: string
  isActive?: boolean
  onInput: (value: string) => void
}

export function SearchBar({
  typedValue,
  placeholder,
  isActive,
  onInput
}: IProps) {
  return (
    <StyledSearchBar
      className={
        'searchbar' +
        (isActive !== undefined ? ' highlight' : '') +
        (isActive ? ' active' : '')
      }
    >
      <Image src={SearchIcon} alt="search" />
      <StyledSearchInput
        type="text"
        value={typedValue}
        placeholder={placeholder ?? ''}
        onChange={(e) => onInput(e.target.value)}
      />
    </StyledSearchBar>
  )
}

export const StyledSearchBar = styled('div')`
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 16px;
  border-radius: ${({ round }: any) => {
    if (round) {
      return `${round}px`
    }

    return '20px'
  }};
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.secondaryLight};
  
  &.highlight {
    &:hover, &:active, &.active {
      transition: all 0.1s linear;
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`

const StyledSearchInput = styled('input')`
  font-size: 12px;
  padding: 0 10px;
  width: 100%;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.gray};
  }
`
