import { useCallback, useMemo } from 'react'

import { dispatch } from 'use-bus'

import { NetworkHealth, useCommonStore } from '@/state/common'

import { OPEN_NETWORK_STATUS } from '@/constants/events'
import { useWrongNetwork } from '@/hooks/network/useWrongNetwork'
import { useConnectWallet } from '@/hooks/wallet/useConnectWallet'
import { useCurrentAccount } from '@/hooks/wallet/useCurrentAccount'
import { IFormError } from '@/state/swap/index'

interface IProps {
  text: string
  error: IFormError
  loading: boolean
  onSubmit: Function
}

export function useFormSubmit({ text, error, loading, onSubmit }: IProps) {
  const { currentBlock } = useCommonStore()

  const account = useCurrentAccount()
  const { connect } = useConnectWallet()
  const isHealthBlock = useMemo(() => {
    return currentBlock.status === NetworkHealth.health
  }, [currentBlock])
  const { validateNetwork } = useWrongNetwork()

  const handleSubmit = useCallback(() => {
    if (!account) {
      return connect()
    }

    if (!isHealthBlock) {
      return dispatch(OPEN_NETWORK_STATUS)
    }

    if (!validateNetwork()) {
      return
    }

    onSubmit()
  }, [account, isHealthBlock, onSubmit, validateNetwork])
  const disableSubmitUi = useMemo(() => {
    return loading || !isHealthBlock
  }, [loading, isHealthBlock])

  return {
    currentBlock,
    account,
    connect,
    isHealthBlock,
    handleSubmit,
    disableSubmitUi
  }
}
