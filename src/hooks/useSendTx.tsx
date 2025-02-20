import { useCallback, useContext, useEffect, useState } from 'react'

import { SendTransactionParameters } from '@wagmi/core'
import { camelCase } from 'lodash'
import { dispatch } from 'use-bus'
import { Abi } from 'viem'
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt
} from 'wagmi'

import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'
import { debugLog, fetchProviderId, isMobileOS } from '@/utils/common'
import { createTxToast, showToast } from '@/utils/toast'

import { ITxState, useTxHistoryStore } from '@/state/txHistory'

import { SUPPORT_CHAIN_IDS } from '@/constants/chain'
import { EVENT_TX_FINISHED, OPEN_TELEPORT_WALLET } from '@/constants/events'
import { EnvContext } from '@/context/EnvProvider'
import { useHttpClient } from '@/hooks/network/useHttpClient'
import { useWrongNetwork } from '@/hooks/network/useWrongNetwork'
import { useConnectWallet } from '@/hooks/wallet/useConnectWallet'

interface IProps {
  tx: SendTransactionParameters
  action: string
  balance: bigint
  chainId: SUPPORT_CHAIN_IDS
  onError?: Function
  onSuccess?: Function
  functionName?: string
  methodInterface?: Abi
  methodArgs?: any[]
}

export function useSendTx({
  tx,
  action,
  balance,
  chainId,
  onSuccess,
  methodInterface,
  methodArgs
}: IProps) {
  const { t } = useTranslationSimplify()
  const env = useContext(EnvContext)

  const { connect } = useConnectWallet()
  const { address: account, connector } = useAccount()

  const client = useHttpClient()
  const { isWrongNetwork } = useWrongNetwork()

  const {
    data: txHash,
    isLoading,
    sendTransactionAsync,
    reset
  } = useSendTransaction()
  const { addTx, updateTx, setIsEstimatingFee } = useTxHistoryStore()

  const broadcast = useCallback(async () => {
    if (!account) {
      connect()
      return
    }

    if (isWrongNetwork) {
      return
    }

    setIsEstimatingFee(true)

    const gas = await Promise.race([
      client
        .estimateGas({
          account,
          ...tx
        } as any)
        .catch((e) => {
          debugLog(e, String(env.PROFILE))
          return 0n
        }) as Promise<bigint>,
      new Promise((resolve) => {
        setTimeout(() => resolve(0n), 60 * 1000)
      }) as Promise<bigint>
    ])

    setIsEstimatingFee(false)

    if (gas === 0n) {
      showToast(createTxToast('fail', 'Fail', t))
      return
    }

    const _tx: SendTransactionParameters & { from: `0x${string}` } = {
      from: account,
      ...tx
    }
    _tx.gas = BigInt(gas)

    /*
    const gasPrice = await client.getGasPrice()
    const estimateFee = gasPrice * gas
    const estimateValue = estimateFee + (_tx?.value ?? 0n)
    // 만약 실질 Native 소모 수량이 내 Native 보유 수량보다 큰 경우 기존 value 값에서 최대 예상 수수료를 빼주기
    if (balance < estimateValue) {
      _tx.value = (_tx?.value ?? 0n) - estimateFee
      if (_tx.value < 0n) {
        _tx.value = -1n
      }
    }
    */

    if (fetchProviderId(connector) === 'teleport') {
      isMobileOS()
        ? window.open(String(env.TELEPORT_PATH))
        : dispatch(OPEN_TELEPORT_WALLET)
    }

    sendTransactionAsync(_tx)
      .then((txHash) => {
        addTx(txHash, action)
        return txHash
      })
      .catch((error) => {
        const errorType = error?.shortMessage?.includes('User rejected')
          ? 'cancel'
          : 'fail'

        dispatch(EVENT_TX_FINISHED)
        showToast(createTxToast(errorType, camelCase(errorType), t))
        return false
      })
  }, [
    env,
    client,
    connector,
    account,
    chainId,
    tx,
    action,
    balance,
    methodInterface,
    methodArgs,
    isWrongNetwork
  ])

  const [executedTx, setExecutedTx] = useState(new Set())
  const {
    data: receipt,
    isFetching: isConfirming,
    isSuccess: isConfirmed
  } = useWaitForTransactionReceipt({
    hash: txHash ?? '0x',
    pollingInterval: 2_000,
    query: {
      enabled: (txHash ?? '0x') !== '0x'
    }
  })

  const handleTxError = useCallback(() => {
    if (executedTx.has(txHash)) {
      return
    }

    dispatch(EVENT_TX_FINISHED)
    setExecutedTx(executedTx.add(txHash))

    updateTx(txHash as `0x${string}`, ITxState.fail)
    showToast(createTxToast('fail', 'Fail', t))
  }, [executedTx, txHash])
  const handleReceipt = useCallback(
    (receipt: any) => {
      if (receipt?.status === 'success') {
        if (executedTx.has(receipt.transactionHash)) {
          return
        }

        dispatch(EVENT_TX_FINISHED)
        setExecutedTx(executedTx.add(receipt.transactionHash))

        if (action !== 'approve') {
          onSuccess && onSuccess(receipt)
        }

        updateTx(receipt.transactionHash, receipt.status as ITxState)
        showToast(createTxToast('success', 'Success', t))
      }

      if (receipt?.status === 'error') {
        handleTxError()
      }

      setTimeout(reset, 1000)
    },
    [action, executedTx, onSuccess, handleTxError]
  )
  useEffect(() => {
    handleReceipt(receipt)
  }, [receipt])

  return {
    broadcast,
    hash: txHash ?? '0x',
    isLoading: isLoading || isConfirming,
    receipt,
    isConfirmed
  }
}
