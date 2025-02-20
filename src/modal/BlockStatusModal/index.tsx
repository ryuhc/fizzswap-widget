import styled from 'styled-components'

import { BlockStatusDetail } from '@/components/BlockStatusDetail'

import { ModalWrapper } from '@/modal/ModalWrapper'

export function BlockStatusModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalWrapper>
      <StyledBlockStatusModal>
        <BlockStatusDetail onClose={() => onClose()} />
      </StyledBlockStatusModal>
    </ModalWrapper>
  )
}

const StyledBlockStatusModal = styled('div')``
