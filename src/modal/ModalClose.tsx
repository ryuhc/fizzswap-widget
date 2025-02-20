import styled from 'styled-components'

import { Image } from '@/components/Image'

import CloseIcon from '@/assets/img/icon/ic-modal-close.svg'

export const StyledModalClose = styled('div')`
  width: 20px;
  height: 20px;
  cursor: pointer;
  position: absolute;
  top: 24px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`

interface IProps {
  onClose: () => void
}

export function ModalClose({ onClose }: IProps) {
  return (
    <StyledModalClose className="modal-close" onClick={() => onClose()}>
      <Image
        src={CloseIcon}
        alt="close"
        sx={{ width: '14px', height: '14px' }}
      />
    </StyledModalClose>
  )
}
