import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { dispatch } from 'use-bus'
import { useAccount } from 'wagmi'

import { OPEN_WRONG_NETWORK } from '@/constants/events'
import { useEnvContext } from '@/context/EnvProvider'
import { useSupportChains } from '@/hooks/network/useSupportChains'

export function useWrongNetwork() {
  const env = useEnvContext()
  const { connector } = useAccount()
  const [connectorChainId, setConnectorChainId] = useState<number>(env.DEFAULT_CHAIN)

  const providerRef = useRef<any>(null)
  useEffect(() => {
    if (connector?.getProvider) {
      connector.getProvider().then((provider: any) => {
        providerRef.current = provider
        providerRef.current.on('chainChanged', (id: any) => {
          setConnectorChainId(parseInt(id))
        })

        provider.request({ method: 'eth_chainId' }).then((chainId: `0x${string}`) => {
          setConnectorChainId(parseInt(chainId))
        })
      })
    }

    return () => {
      providerRef.current?.removeAllListeners && providerRef.current?.removeAllListeners('chainChanged')
    }
  }, [connector])

  const supportChains = useSupportChains()
  const isWrongNetwork = useMemo(() => {
    return connectorChainId && !supportChains.find(item => item.id === connectorChainId)
  }, [connectorChainId, supportChains])
  const showWrongNetwork = useCallback(() => {
    dispatch(OPEN_WRONG_NETWORK)
  }, [])
  const validateNetwork = useCallback(() => {
    if (isWrongNetwork) {
      showWrongNetwork()
      return false
    }

    return true
  }, [isWrongNetwork, showWrongNetwork])

  return {
    isWrongNetwork,
    validateNetwork
  }
}