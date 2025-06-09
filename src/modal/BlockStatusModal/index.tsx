import styled from '@emotion/styled'

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
