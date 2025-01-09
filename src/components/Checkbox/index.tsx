import styled from 'styled-components'

import { Image } from '@/components/Image'

import { Text } from '@/styles/common'

import CheckIcon from '@/assets/img/icon/ic-check-wh.svg'

const StyledCheckbox = styled('div')`
  display: flex;
  align-items: center;
  cursor: pointer;
`

const StyledCheckboxBtn: any = styled('div')`
  width: 18px;
  height: 18px;
  border: 1px solid ${({ theme }) => theme.colors.gray5};
  background-color: ${({ theme, checked }: any) => checked ? theme.colors.primary : ''};
  border-color: ${({ theme, checked }: any) => checked ? theme.colors.primary : theme.colors.gray5};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 2px;
`

const StyledCheckboxLabel = styled('div')`
  max-width: calc(100% - 18px);
  line-height: 1.2;
  text-align: right;
  padding: 0 10px 0 8px;
`

interface IProps {
  label: string,
  color?: string,
  checked: boolean,
  onCheck: () => void
}

export function Checkbox({ label, color, checked, onCheck }: IProps) {
  return (
    <StyledCheckbox className="checkbox">
      <StyledCheckboxBtn data-testid="checkbox-btn" checked={checked} onClick={() => onCheck()}>
        <Image src={CheckIcon as string} alt="check" />
      </StyledCheckboxBtn>

      <StyledCheckboxLabel onClick={() => onCheck()}>
        <Text color={color ?? 'gray'} size={12} data-testid="checkbox-label">{label}</Text>
      </StyledCheckboxLabel>
    </StyledCheckbox>
  )
}