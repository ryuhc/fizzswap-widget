import styled from 'styled-components'

import { Image } from '@/components/Image'

import { Text } from '@/styles/common'

import CheckIconGray from '@/assets/img/icon/ic-check-gray.svg'
import CheckIconWhite from '@/assets/img/icon/ic-check-wh.svg'

interface IProps {
  checked: boolean
  title: string
  checkImageGray?: boolean
  onClick: () => void
}

export function ConfirmOnModal({
  checked,
  title,
  checkImageGray,
  onClick
}: IProps) {
  return (
    <StyledConfirmOnModal onClick={onClick}>
      <ConfirmOnModalCheck checked={checked}>
        <Image
          src={(checkImageGray ? CheckIconGray : CheckIconWhite) as string}
          alt="check"
          type="vector"
        />
      </ConfirmOnModalCheck>

      <ConfirmOnModalTitle>
        <Text size={14} weight={700}>
          {title}
        </Text>
      </ConfirmOnModalTitle>
    </StyledConfirmOnModal>
  )
}

const StyledConfirmOnModal = styled('div')`
  width: 100%;
  padding: 10px 16px;
  border-radius: 1px;
  border: 1px solid ${({ theme }) => theme.colors.gray2};
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
`
const ConfirmOnModalCheck = styled('div')<{ checked: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-out;
  background: ${({ theme, checked }) =>
    checked ? theme.colors.primary : theme.colors.white};
  border: 1px solid
    ${({ theme, checked }) => (checked ? 'transparent' : theme.colors.gray2)};
`

const ConfirmOnModalTitle = styled('div')`
  width: calc(100% - 28px);
  padding-left: 10px;
  font-size: 14px;
`
