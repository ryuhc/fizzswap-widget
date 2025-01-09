import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import useBus from 'use-bus'
import { useAccount, useConnect } from 'wagmi'

import { fetchProviderId, isMobileOS } from '@/utils/common'

import { useCommonStore } from '@/state/common'

import { OPEN_TELEPORT_WALLET } from '@/constants/events'
import { useEnvContext } from '@/context/EnvProvider'

let initProviderEvtHandler = false

const useA2AConnectorQRUri = () => {
  const { connectors } = useConnect()
  const { connectingWalletId } = useCommonStore()
  const { connector } = useAccount()
  const connectorId = useMemo(() => {
    return connectingWalletId || (connector?.id ?? '')
  }, [connectingWalletId, connector])

  const isMobile = isMobileOS()
  const env = useEnvContext()

  const [qrUri, setQrUri] = useState('')
  const [requestKey, setRequestKey] = useState('')

  const a2aProviderRef = useRef<any>(null)
  const isA2AConnector = useMemo(() => {
    return {
      current: connectorId,
      flag: !isMobile && connectorId === 'teleport'
    }
  }, [isMobile, connectorId])

  const displayUriHandler = useCallback((uri: string) => {
    setQrUri(uri)
  }, [])
  const requestKeyHandler = useCallback((key: string) => {
    setRequestKey(key)
  }, [])

  // for teleport wallet
  const teleportUriHandler = useCallback((message: { type: string, data?: unknown }) => {
    if (message.type !== 'display_uri') {
      return
    }

    const uri = `tg://resolve?domain=${env.TG_WALLET_BOT}&appname=wallet&startapp=${
      Buffer.from(JSON.stringify({"type":"auth","value":{"uri":message.data}})).toString('hex')
    }`

    setQrUri(uri)
  }, [env])
  const korbitUriHandler = useCallback((message: { type: string, data?: unknown }) => {
    if (message.type !== 'display_uri') {
      return
    }

    setQrUri(`korbit://web3?pairing=${message.data}`)
  }, [])

  useBus(OPEN_TELEPORT_WALLET, () => {
    setQrUri(`tg://resolve?domain=${env.TG_WALLET_BOT}&appname=wallet`)
  }, [env])

  useEffect(() => {
    if (isMobile || !isA2AConnector.flag) return
    if (initProviderEvtHandler) return

    let provider: any

    initProviderEvtHandler = true

    const findConnector = () => {
      return connectors.find(item => {
        return fetchProviderId(item) === isA2AConnector.current
      })
    }

    switch (isA2AConnector.current) {
      case 'teleport': {
        const connector = findConnector()

        connector?.getProvider().then(_provider => {
          a2aProviderRef.current = connector
          provider = connector

          connector.emitter.on('message', teleportUriHandler)
        })

        break
      }
      // TODO : korbit wallet
      case 'korbit': {
        const connector = findConnector()

        connector?.getProvider().then(_provider => {
          a2aProviderRef.current = connector
          provider = connector

          connector.emitter.on('message', korbitUriHandler)
        })

        break
      }
      default: {
        break
      }
    }

     
    return () => {
      if (provider) {
        switch(fetchProviderId(provider)) {
          case 'teleport': {
            provider.emitter.off('message', teleportUriHandler)
            break
          }
          case 'korbit': {
            provider.emitter.off('message', korbitUriHandler)
            break
          }
          default: {
            provider?.off('display_uri', displayUriHandler)
            provider?.off('requestKey', requestKeyHandler)

            break
          }
        }

        initProviderEvtHandler = false
      }
    }
  }, [isA2AConnector, isMobile, displayUriHandler, requestKeyHandler])

  /*
  useEffect(() => {
    return () => {
      if (a2aProviderRef.current && requestKey) {
        a2aProviderRef.current.events.emit('cancelRequest', requestKey)
        a2aProviderRef.current?.off('display_uri', displayUriHandler)
        a2aProviderRef.current?.off('requestKey', requestKeyHandler)
        a2aProviderRef.current = null
        initProviderEvtHandler = false
      }
    }
  }, [a2aProviderRef, requestKey, displayUriHandler, requestKeyHandler])
  */

  const clearRequest = useCallback(() => {
    setQrUri('')
    setRequestKey('')

    if (a2aProviderRef.current && fetchProviderId(a2aProviderRef.current) !== 'teleport') {
      a2aProviderRef.current.events.emit('cancelRequest', requestKey)
    }
  }, [requestKey])

  return { qrUri, requestKey, clearRequest }
}

export default useA2AConnectorQRUri
