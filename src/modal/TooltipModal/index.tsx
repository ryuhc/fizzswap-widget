import styled from 'styled-components'

import { ModalWrapper } from '@/modal/ModalWrapper'

import { Text } from '@/styles/common'
import { StyledFullModal } from '@/styles/modal'

interface IProps {
  content: string
  onClose: Function
}

export function TooltipModal({ content, onClose }: IProps) {
  return (
    <ModalWrapper>
      <StyledTooltipModal>
        <section>
          <div>
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </section>

        <TooltipModalFooter>
          <Text size={12} weight={700} color="white" onClick={() => onClose()}>
            Close
          </Text>
        </TooltipModalFooter>
      </StyledTooltipModal>
    </ModalWrapper>
  )
}

const StyledTooltipModal = styled(StyledFullModal)`
  background-color: rgba(0, 0, 0, 0.7);
  
  >section {
    width: 100%;
    height: calc(100% - 60px);
    top: 0;
    left: 0;
    position: fixed;
    overflow-y: scroll;
    padding: 20px;
    
    >div {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    * {
      color: ${({ theme }) => theme.colors.white};
    }
  }
`

const TooltipModalFooter = styled('footer')`
  width: 100%;
  height: 60px;
  bottom: 0;
  left: 0;
  position: fixed;
  text-align: center;
  z-index: 16;
`
