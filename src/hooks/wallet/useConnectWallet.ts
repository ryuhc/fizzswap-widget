import { useCallback } from 'react'

import { useAccount, useDisconnect } from 'wagmi'

import { useCommonStore } from '@/state/common'

import { useConfigContext } from '@/context/ConfigProvider'

export function useConnectWallet() {
  const { connector } = useAccount()
  const { disconnect: disconnectWallet } = useDisconnect()

  const { setIsConnectingWallet } = useCommonStore()
  const config = useConfigContext()

  const connect = useCallback(() => {
    if (config.onConnect) {
      return config.onConnect()
    }

    setIsConnectingWallet(true)
  }, [config])
  const disconnect = useCallback(() => {
    disconnectWallet()

    localStorage.setItem('address', '')
    localStorage.setItem('wagmi.recentConnectorId', '')
  }, [connector])

  return {
    connect,
    disconnect
  }
}