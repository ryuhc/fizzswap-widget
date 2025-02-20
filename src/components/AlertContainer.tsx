import { useEffect } from 'react'
import { createPortal } from 'react-dom'

import useModal from '@/hooks/useModal'

import { AlertModal } from '@/modal/AlertModal'

import { useCommonStore } from '@/state/common'

export function AlertContainer() {
  const { alertData, hideAlert } = useCommonStore()
  const [showAlert, setShowAlert, portal] = useModal()

  useEffect(() => {
    if (alertData) {
      setShowAlert()
    }
  }, [alertData])

  return alertData && showAlert && portal
    ? createPortal(
        (
          <AlertModal
            {...alertData}
            onClose={() => {
              hideAlert()
              setShowAlert()
            }}
          />
        ) as any,
        portal
      )
    : null
}
