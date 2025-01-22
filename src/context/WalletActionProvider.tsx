import React, { useCallback, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'

import { useLocalStorage } from '@uidotdev/usehooks'
import { find } from 'lodash'
import { DateTime } from 'luxon'
import useBus from 'use-bus'
import { useAccount, useConnect } from 'wagmi'


import useModal from '@/hooks/useModal'
import { useSearchParams } from '@/hooks/useSearchParams'
import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'
import { fetchProviderId, isMobileOS } from '@/utils/common'

import { BlockStatusModal } from '@/modal/BlockStatusModal'
import { SelectWalletModal } from '@/modal/SelectWalletModal'
import { SwapA2AModal } from '@/modal/SwapA2AModal'
import { WrongNetworkModal } from '@/modal/WrongNetworkModal'

import { useCommonStore } from '@/state/common'

import { OPEN_NETWORK_STATUS, OPEN_WRONG_NETWORK } from '@/constants/events'
import { useConfigContext } from '@/context/ConfigProvider'
import { useSupportChains } from '@/hooks/network/useSupportChains'
import useA2AConnectorQRUri from '@/hooks/wallet/useA2AConnectorQRUri'
import { useConnectors } from '@/hooks/wallet/useConnectors'

const processByConnector: string[] = []
const disableAutoConnect: string[] = []

export const disableByPlatform = {
  desktop: [],
  mobile: []
}

export default function WalletActionProvider() {
  const { isConnectingWallet, setIsConnectingWallet, connectingWalletId } = useCommonStore()
  const [showConnectWallet, setShowConnectWallet, portal, closeConnectWalletModal] = useModal()

  const { qrUri, clearRequest } = useA2AConnectorQRUri()
  const [showA2A, setShowA2A, a2aPortal, closeA2A] = useModal()
  const closeConnectWallet = useCallback(() => {
    closeA2A()
    closeConnectWalletModal()

    setIsConnectingWallet(false)
    clearRequest()
  }, [clearRequest])
  useEffect(() => {
    if (isConnectingWallet) {
      setShowConnectWallet()
    }
  }, [isConnectingWallet])

  // @ts-ignore
  const { connector, isConnected, address: account } = useAccount()
  const connectorId = useMemo(() => {
    return connectingWalletId || fetchProviderId(connector)
  }, [connectingWalletId, connector])
  const { connectAsync, connectors } = useConnect()

  const {t} = useTranslationSimplify()
  const a2aModal = useMemo(() => {
    switch (connectorId) {
      case 'teleport': {
        return <SwapA2AModal requestKey={qrUri} onClose={closeConnectWallet} connectorId={connectorId} connectorName={t('General.NameTeleport')} />
      }
      default: {
        return null
      }
    }
  }, [qrUri, connectorId, connectors, closeConnectWallet])

  useEffect(() => {
    if (qrUri) {
      setShowA2A()
    }
  }, [qrUri])

  const persistConnector = useCallback(() => {
    const connectorId = fetchProviderId(connector)

    if (disableAutoConnect.includes(connectorId)) {
      return
    }

    localStorage.setItem('wagmi.recentConnectorId', connectorId)

    if (processByConnector.includes(connectorId ?? '')) {
      localStorage.setItem('address', account ?? '')
    }
  },[connector, account])
  useEffect(() => {
    closeA2A()

    if (isConnected) {
      persistConnector()
    }
  }, [isConnected, connectingWalletId])

  const [showRiskModal, setShowRiskModal, riskPortal, closeRiskModal] = useModal()
  const [disableUntil, setDisableUntil] = useLocalStorage('swap.risk', 0)
  const handleShowRisk = useCallback(() => {
    const now = Number(DateTime.now().toFormat('X'))

    if (now > disableUntil) {
      // setShowRiskModal()
    }
  }, [disableUntil])
  const onDisableRiskModal = useCallback(() => {
    const now = Number(DateTime.now().toFormat('X'))
    setDisableUntil(now + (86400 + 7))
  }, [])

  const searchParams = useSearchParams()

  const supportChains = useSupportChains()
  const currentConnectors = useConnectors()

  // cached connector 찾아서 자동 연결
  const config = useConfigContext()
  const initConnector = useCallback(() => {
    // state override 하는 경우 예외처리
    if (config.state) {
      return
    }

    const persistedConnectorId = searchParams.get('connect') ?? localStorage.getItem('wagmi.recentConnectorId') ?? ''

    if (persistedConnectorId && !disableAutoConnect.includes(persistedConnectorId)) {
      const isOnlyDesktop = !!disableByPlatform.mobile.find(id => id === persistedConnectorId)

      if (isMobileOS() && isOnlyDesktop) {
        return
      }

      const persistedConnector = find(currentConnectors, connector => {
        return fetchProviderId(connector) === persistedConnectorId
      })

      if (persistedConnector && persistedConnector?.type !== 'injected') {
        connectAsync({ connector: persistedConnector }).then(res => {
          if (res && supportChains.find(item => item.id === res.chainId)) {
            handleShowRisk()
          }
        }).catch(() => {
          localStorage.setItem('wagmi.recentConnectorId', '')
        })
      }
    }
  }, [connectors, config, currentConnectors, handleShowRisk, searchParams, supportChains])
  useEffect(() => {
    initConnector()
  }, [])

  // block status
  const [showBlockStatus, setShowBlockStatus, _, closeBlockStatus] = useModal()
  useBus(OPEN_NETWORK_STATUS, () => setShowBlockStatus(), [])

  // chain status
  const [showChainStatus, setShowChainStatus, __, closeChainStatus] = useModal()
  useBus(OPEN_WRONG_NETWORK, () => setShowChainStatus(), [])

  return (
    <>
      {showConnectWallet && portal ? createPortal(<SelectWalletModal onShowRisk={handleShowRisk} onClose={closeConnectWallet} /> as any, portal) : null}

      {showA2A && a2aPortal && a2aModal ? createPortal(a2aModal as any, a2aPortal) : null}

      {showBlockStatus && portal ? createPortal(<BlockStatusModal onClose={closeBlockStatus} /> as any, portal) : null}

      {showChainStatus && portal ? createPortal(<WrongNetworkModal onClose={closeChainStatus} /> as any, portal) : null}
    </>
  )
}