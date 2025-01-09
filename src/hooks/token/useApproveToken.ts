import { useCallback, useEffect, useMemo, useState } from 'react'

import { usePrevious } from '@uidotdev/usehooks'
import { findIndex, map } from 'lodash'
import { encodeFunctionData } from 'viem'
import { useChainId } from 'wagmi'

import { useSendTx } from '@/hooks/useSendTx'
import { getInterface } from '@/utils/abi'
import { UINT_256_MAX } from '@/utils/number'

import { useTxHistoryStore } from '@/state/txHistory'

import ERC20ABI from '@/abi/common/ERC20.json'
import ERC721ABI from '@/abi/common/ERC721.json'
import { SUPPORT_CHAIN_IDS } from '@/constants/chain'
import { useAllowance } from '@/hooks/queries/useAllowance'

interface IApprovals {
  id: `0x${string}` | number,
  symbol: string,
  finished: boolean,
  initialized: boolean
}

interface IProps {
  ids: `0x${string}`[] | number[],
  symbols: string[],
  amounts: bigint[],
  spender: `0x${string}`,
  nftAddress?: `0x${string}`,
  nativeBalance: bigint,
  isSummary?: boolean
}

export function useApproveToken({ ids, symbols, amounts, spender, nftAddress, nativeBalance, isSummary }: IProps) {
  const chainId = useChainId() as SUPPORT_CHAIN_IDS
  const { txHistory, isEstimatingFee } = useTxHistoryStore()
  const { data: approvals, isFetched, refetch, remove } = useAllowance({
    chainId,
    params: isSummary ? [] : ids,
    isNft: !!nftAddress,
    spender,
    nftAddress,
    amounts: isSummary ? [] : amounts
  })

  const [alreadyFinished, setAlreadyFinished] = useState<boolean>(false)
  const [step, setStep] = useState<number>(0)
  const [initialStep, setInitialStep] = useState<number>(0)
  const needApprove: IApprovals[] = useMemo(() => {
    return alreadyFinished ? [] : map(approvals, (finished, i) => {
      return {
        id: ids[i],
        symbol: symbols[i],
        finished,
        initialized: initialStep > i
      }
    })
  }, [alreadyFinished, approvals, ids, symbols, initialStep])

  // init approvals
  const prevApprovals = usePrevious(approvals)
  useEffect(() => {
    if (!prevApprovals && approvals) {
      const initialStep = findIndex(approvals, finished => !finished)

      if (initialStep !== -1) {
        setStep(initialStep)
        setInitialStep(initialStep)
        setAlreadyFinished(false)
      } else {
        setAlreadyFinished(true)
      }
    }
  }, [prevApprovals, approvals])

  const approveParam = useMemo(() => {
    if (ids.length === 0 || step === ids.length) {
      return {
        to: '0x',
        data: '0x'
      }
    }

    if (nftAddress) {
      return {
        to: nftAddress,
        args: [spender, ids[step]],
        methodInterface: getInterface(ERC721ABI, 'approve'),
        data: encodeFunctionData({
          abi: ERC721ABI,
          functionName: 'approve',
          args: [spender, ids[step]]
        })
      }
    }

    const amount = amounts[step] ?? UINT_256_MAX

    return {
      to: ids[step],
      args: [spender, amount],
      methodInterface: getInterface(ERC20ABI, 'approve'),
      data: encodeFunctionData({
        abi: ERC20ABI,
        functionName: 'approve',
        args: [spender, amount]
      })
    }
  }, [step, ids, spender, nftAddress, amounts])
  const { broadcast, hash, isLoading, receipt } = useSendTx({
    tx: {
      to: approveParam.to as `0x${string}`,
      value: 0n,
      data: approveParam.data as `0x${string}`
    },
    action: 'approve',
    balance: nativeBalance,
    chainId,
    methodInterface: approveParam.methodInterface,
    methodArgs: approveParam.args
  })
  const handleApprove = useCallback((approval: IApprovals) => {
    if (isEstimatingFee || isLoading || approval.finished) {
      return
    }

    broadcast().finally()
  }, [isEstimatingFee, isLoading, broadcast])

  const updateStep = useCallback(() => {
    refetch().then(({ data }) => {
      if (data) {
        let nextStep = 0

        for (let i = 0; i < data.length; i++) {
          if (!data[i]) {
            break
          }
          nextStep += 1
        }

        setStep(nextStep)
      }
    })
  }, [step])
  useEffect(() => {
    if (hash && hash === receipt?.transactionHash) {
      updateStep()
    }
  }, [hash, receipt])
  useEffect(() => {
    if (txHistory.length > 0 && txHistory[0].action !== 'approve') {
      remove()
    }
  }, [txHistory])

  return {
    needApprove,
    handleApprove,
    isApproving: isLoading,
    step,
    isFetched
  }
}