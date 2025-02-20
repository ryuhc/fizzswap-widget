import React, { useEffect, useRef, useState } from 'react'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import styled from 'styled-components'

interface IProps {
  children: React.ReactNode
  customStyle?: Record<string, any>
  customIndex?: number
}

export function ModalWrapper({ children, customStyle, customIndex }: IProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [modalIndex, setModalIndex] = useState<number>(1)

  useGSAP(
    () => {
      gsap.fromTo(
        ref.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power1.out' }
      )
    },
    { scope: ref }
  )

  useEffect(() => {
    const modalLength = document.querySelectorAll('#modal-overlay > div').length
    setModalIndex(modalLength + 1)
  }, [])

  return (
    <StyledModalWrapper
      ref={ref}
      style={{ ...(customStyle ?? {}), zIndex: customIndex ?? modalIndex }}
    >
      {children}
    </StyledModalWrapper>
  )
}

const StyledModalWrapper = styled('div')`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`
