import { useCallback, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'

import useModal from '@/hooks/useModal'

import { AboutPriceImpactModal } from '@/modal/AboutPriceImpactModal'
import { TxPolicyModal } from '@/modal/TxPolicyModal'

import { ITokenItem } from '@/hooks/queries/useTokenList'

interface IProps {
  policy?: string
  onSubmit: () => void
  onNextStep?: () => void
}

export interface IAboutPriceImpact {
  token0: ITokenItem
  token1: ITokenItem
  value: number
  rate: string
  assetType?: number
  pool: any
}

export function useTxPolicy({ policy, onSubmit, onNextStep }: IProps) {
  const [
    showAboutPriceImpact,
    setShowAboutPriceImpact,
    _,
    closeShowAboutPriceImpact
  ] = useModal()
  const [showTxPolicy, setShowTxPolicy, txPolicyPortal, closeTxPolicy] =
    useModal()
  const txPolicyModal = useMemo(() => {
    return showTxPolicy && txPolicyPortal
      ? createPortal(
          (
            <TxPolicyModal
              policy={policy}
              onSubmit={() => {
                closeTxPolicy()
                onSubmit()
              }}
              onClose={closeTxPolicy}
            />
          ) as any,
          txPolicyPortal
        )
      : null
  }, [policy, showTxPolicy, txPolicyPortal, onSubmit])

  const aboutPriceImpactParam = useRef<IAboutPriceImpact | null>(null)
  const aboutPriceImpactModal = useMemo(() => {
    return showAboutPriceImpact &&
      txPolicyPortal &&
      aboutPriceImpactParam.current
      ? createPortal(
          (
            <AboutPriceImpactModal
              params={aboutPriceImpactParam.current}
              onClose={closeShowAboutPriceImpact}
              onSubmit={() => {
                closeShowAboutPriceImpact()
                onNextStep && onNextStep()
              }}
            />
          ) as any,
          txPolicyPortal
        )
      : null
  }, [showAboutPriceImpact, txPolicyPortal, onNextStep])

  const confirmBroadcast = useCallback(
    (aboutPriceImpact?: IAboutPriceImpact) => {
      if (aboutPriceImpact) {
        aboutPriceImpactParam.current = aboutPriceImpact
        return setShowAboutPriceImpact()
      }

      return setShowTxPolicy()
    },
    []
  )

  return {
    txPolicyModal,
    aboutPriceImpactModal,
    confirmBroadcast
  }
}
