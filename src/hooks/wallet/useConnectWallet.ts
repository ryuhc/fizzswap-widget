import { useCallback } from 'react'

import { useAccount, useDisconnect } from 'wagmi'

import { useCommonStore } from '@/state/common'

export function useConnectWallet() {
  const { connector } = useAccount()
  const { disconnect: disconnectWallet } = useDisconnect()
  const { setIsConnectingWallet } = useCommonStore()

  const connect = useCallback(() => {
    setIsConnectingWallet(true)
  }, [])
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