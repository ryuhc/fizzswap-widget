import { useCallback, useMemo } from 'react'

import { isEmpty } from 'lodash'
import styled from 'styled-components'

import { Image } from '@/components/Image'

import type { ITokenItem } from '@/hooks/queries/useTokenList'

import UnSelectedIcon from '@/assets/img/icon/ic-unselected-token.svg'
import DefaultTokenIcon from '@/assets/img/token/default-token.svg'

interface IProps {
  token: ITokenItem | null,
  size: string | number,
  highlightwhenempty?: boolean,
  lazyload?: boolean,
  onClickIcon?: () => void
}

export function TokenIcon({ token, size, highlightwhenempty, lazyload, onClickIcon }: IProps) {
  const handleError = useCallback((e: any) => {
    e.target.src = '/img/token/default-token.svg'
    e.target.alt = 'defaultToken'
  }, [])

  const iconClassName = useMemo(() => {
    let result = 'token-icon'

    if (!token?.address) {
      result += ' empty'
    }

    if (!token?.address && highlightwhenempty) {
      result = result + (result ? ' ' : '') + 'highlight'
    }

    return result
  }, [highlightwhenempty, token?.address])

  return (
    <StyledIcon
      className={iconClassName}
      size={size}
      token={token}
      highlightwhenempty={highlightwhenempty ? 'true' : 'false'}
      onClick={() => onClickIcon && onClickIcon()}
      data-highlight={highlightwhenempty ? '1' : '0'}
    >
      <Image src={!token?.address ? UnSelectedIcon : (token?.image || DefaultTokenIcon)} alt={token?.symbol} onError={handleError} loading={lazyload ? 'lazy' : undefined} />
    </StyledIcon>
  )
}

const StyledIcon = styled('div')<{ size: string | number, token: ITokenItem | null, highlightwhenempty: string }>`
  width: ${({ size }) => {
    return !Number.isNaN(size) ? `${size}px` : `${size}`
  }};
  height: ${({ size }) => {
    return !Number.isNaN(size) ? `${size}px` : `${size}`
  }};
  border: ${({ theme, token, highlightwhenempty }) => {
    return isEmpty(token) && highlightwhenempty === 'true' ? `1px solid ${theme.colors.primary}` : ''
  }};
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
  border-radius: 50%;
  cursor: pointer;

  img {
    height: 100%;
    border-radius: 50%;
    vertical-align: top;
  }
  
  &.empty {
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({theme}) => theme.colors.primary};
    
    img {
      height: 12px;
    }
  }
  
  &.highlight {
    img {
      width: 4px;
      height: 14px;
      vertical-align: middle;
    }
    
    &:not(.empty) {
      &:hover, &:active {
        transition: all 0.1s linear;
        padding: 3px;
        border: 2px solid ${({theme}) => theme.colors.primary}
      }
    }
  }
  
  &[data-highlight='1'] {
    &:hover, &:active {
      padding: 3px;
      transition: all 0.1s linear;
      border: 2px solid ${({ theme }) => theme.colors.primary};
    }
  }
`