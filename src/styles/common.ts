

import styled from 'styled-components'

export const CommonMenuLabel = styled('div')`
  width: auto;
  display: inline-block;
  padding: 4px 7px;
  border-radius: 3px;
  font-size: 12px;

  &.primary {
    color: ${({ theme }) => theme.colors.primaryActive};
    background: rgba(44, 218, 73, 0.1);
  }

  &.gray {
    background: ${({ theme }) => theme.colors.gray4};
  }

  &.violet {
    color: ${({ theme }) => theme.colors.violetLight};
    background: rgba(150, 45, 250, 0.05);
  }
  &.centralization {
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.primaryActive};
  }
`

export const SubmitButton: any = styled('div')`
  background-color: ${({ theme, type }: any) => {
    return type === 'pending' ? '#B8C5E5' : theme.colors[type]
  }};
  color: ${({ theme }) => theme.colors.white};
  transition: all 0.2s ease-out;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &[type='gray2'] {
    cursor: not-allowed;
    background-color: #f6f6f6;
    color: ${({ theme }) => theme.colors.gray5};
    
    * {
      font-weight: normal;
    }
  }
  &[type='bodyBackground'] {
    box-shadow: 0 1px 1px 0 #dee3eb;
  }
  
  &:hover {
    &[type='secondary'] {
      background-color: #1F3166;
    }
  }

  &:active {
    &[type='primary'] {
      background-color: ${({ theme }) => theme.colors.primaryActive};
    }
    &[type='secondary'] {
      background-color: #1A2033;
    }
    &[type='cancel'] {
      background: #f0f0f0;
    }
    &[type='bodyBackground'] {
      background-color: ${({ theme }) => theme.colors.gray2};
    }
  }
`

export const OutlineButton: any = styled('div')`
  transition: all 0.2s ease-out;
  border: 1px solid transparent;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &[type='primary'] {
    color: ${({ theme }) => theme.colors.primaryActive};
    border-color: ${({ theme }) => theme.colors.primaryActive};
  }
  &[type='secondary'] {
    color: ${({ theme }) => theme.colors.secondary};
    border-color: ${({ theme }) => theme.colors.secondaryLight};
  }
  &[type='disabled'] {
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.gray2};
  }
`

export const Text: any = styled('span')`
  font-size: ${({ size }: any) => {
    if (typeof size === 'number') {
      return `${size}px`
    }

    return size ?? '1em'
  }};
  font-weight: ${({ weight }: any) => {
    if (typeof weight === 'number') {
      return weight
    }

    return weight ?? 'normal'
  }};
  color: ${({ theme, color }) => {
    if (color?.startsWith('#')) {
      return color
    }

    return theme.colors[color ?? '']
  }};
`

export const Paragraph: any = styled('p')`
  font-size: ${({ size }: any) => {
    if (typeof size === 'number') {
      return `${size}px`
    }

    return size ?? '1em'
  }};
  font-weight: ${({ weight }: any) => {
    if (typeof weight === 'number') {
      return weight
    }

    return weight ?? 'normal'
  }};
  color: ${({ theme, color }) => {
    if (color?.startsWith('#')) {
      return color
    }

    return theme.colors[color ?? '']
  }};
`

export const HeadingBig: any = styled('h1')`
  font-size: ${({ size }: any) => {
    if (typeof size === 'number') {
      return `${size}px`
    }

    return size ?? '1em'
  }};
  font-weight: ${({ weight }: any) => {
    if (typeof weight === 'number') {
      return weight
    }

    return weight ?? 'normal'
  }};
  color: ${({ theme, color }) => {
    if (color?.startsWith('#')) {
      return color
    }

    return theme.colors[color ?? '']
  }};
  line-height: 1;
`

export const HeadingSmall: any = styled('h6')`
  font-size: ${({ size }: any) => {
    if (typeof size === 'number') {
      return `${size}px`
    }

    return size ?? '1em'
  }};
  font-weight: ${({ weight }: any) => {
    if (typeof weight === 'number') {
      return weight
    }

    return weight ?? 'normal'
  }};
  color: ${({ theme, color }) => {
    if (color?.startsWith('#')) {
      return color
    }

    return theme.colors[color ?? '']
  }};
`

export const VectorImg = styled('img')`
  vertical-align: middle;
  margin-top: -2px;
`

export const Switch: any = styled('div')`
  width: auto;
  height: 32px;
  min-width: 48px;
  padding: 0 8px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.gray4};
  transition: all 0.2s ease-out;
  color: ${({ theme, isActive }: any) =>
    isActive ? theme.colors.white : theme.colors.black};
  background-color: ${({ theme, isActive }: any) =>
    isActive ? theme.colors.secondary : theme.colors.white};

  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
`
export const SwitchLabel = styled('div')`
  color: ${({ theme }) => theme.colors.black2};
  transition: all 0.2s ease-out;
  padding-bottom: 2px;
`
export const SwitchIcon = styled('div')`
  width: 20px;
  height: 20px;
  margin-right: 6px;

  img {
    height: 100%;
    border-radius: 50%;
  }
`

export const Divider = styled('div')<{
  align?: 'vertical' | 'horizon'
  color?: string
  shadow?: boolean
}>`
  background: ${({ theme, color }) => {
      if (color === undefined) {
        return `${theme.colros.black}`
      }
      if (color.startsWith('#')) {
        return `${color}`
      }
      return `${theme.colors[color]}`
    }};

  ${({ align }) => {
    if (align === 'vertical') {
      return {
        width: '1px',
        height: '100%',
      }
    }
    return {
      height: '1px',
      width: '100%',
    }
  }}

  ${({ shadow }) =>
    shadow
      ? {
          'box-shadow': '0px 10px 20px 0px #0000001a',
        }
      : {}}
`

export const TableEmpty = styled('section')`
  width: 100%;
  height: 100px;
  padding: 20px 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const FORM_WIDTH = '480px'