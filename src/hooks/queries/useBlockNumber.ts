import { useCallback, useEffect, useRef } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useChainId } from 'wagmi'

import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'

import { NetworkHealth, useCommonStore } from '@/state/common'

import { BLOCK_INTERVAL, SUPPORT_CHAIN_IDS } from '@/constants/chain'
import { useApiUrl } from '@/hooks/network/useApiUrl'

export function useBlockNumber() {
  const { t } = useTranslationSimplify()
  const chainId = useChainId() as SUPPORT_CHAIN_IDS
  const { currentBlock, setCurrentBlock, showAlert } = useCommonStore()

  const apiPath = useApiUrl()
  const { data, refetch } = useQuery({
    queryKey: ['fetchCurrentBlock', chainId],
    queryFn: () => {
      return fetch(`${apiPath}/state`)
        .then(async (res) => {
          const json = await res.json()
          return {
            height: json.provider,
            timestamp: json.timestamp
          }
        })
        .catch(() => ({ height: 0, timestamp: 0 })) as Promise<{
        height: number
        timestamp: number
      }>
    },
    refetchInterval: 10 * 1000,
    staleTime: 10 * 1000
  })

  const pseudoInterval = useRef<any>(null)
  const pseudoBlockRef = useRef<any>({
    height: 0,
    timestamp: 0,
    status: NetworkHealth.health
  })
  const pseudoTimer = useCallback(async () => {
    const pseudoBlock = pseudoBlockRef.current

    let status =
      pseudoBlock.timestamp - (data?.timestamp ?? 0) > 60
        ? NetworkHealth.latency
        : NetworkHealth.health
    if (status === NetworkHealth.latency) {
      await Promise.race([
        new Promise((resolve) => {
          refetch()
            .then(resolve)
            .catch(() => resolve(-1))
        }),
        new Promise((resolve) => {
          setTimeout(() => resolve(-1), 5 * 1000)
        })
      ]).then((res) => {
        if (res === -1) {
          status = NetworkHealth.sick

          showAlert({
            text: t('General.DisableSocketRetry')
          })
          clearInterval(pseudoInterval.current)
        }
      })
    }

    const now = parseInt(String(new Date().valueOf() / 1000))
    const newBlock = {
      height: Number(pseudoBlock.height + 1),
      timestamp: Number(now),
      status
    }

    setCurrentBlock(newBlock)
    pseudoBlockRef.current = newBlock
  }, [data, chainId])
  const handleSubscribeError = useCallback(() => {
    setCurrentBlock({
      ...currentBlock,
      status: NetworkHealth.sick
    })
  }, [currentBlock])

  useEffect(() => {
    if (data?.height === 0) {
      handleSubscribeError()
    } else if (data !== undefined && data?.height > 0) {
      pseudoBlockRef.current = {
        height: data?.height,
        timestamp: parseInt(String(new Date().valueOf() / 1000)),
        status: NetworkHealth.health
      }

      pseudoInterval.current = setInterval(
        pseudoTimer,
        1000 * BLOCK_INTERVAL[chainId]
      )
    }

    return () => {
      pseudoInterval.current && clearInterval(pseudoInterval.current)
    }
  }, [data, chainId])
}
