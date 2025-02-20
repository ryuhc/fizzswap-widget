import { useCallback, useEffect, useState } from 'react'

import { Connector } from 'wagmi'

import { fetchProviderId } from '@/utils/common'

import type { SignClientTypes } from '@walletconnect/types/dist/types/sign-client/client'

import MetamaskIcon from '@/assets/img/icon/ic-service-metamask.svg'
import TeleportIcon from '@/assets/img/icon/ic-service-teleportwallet.svg'
import WalletConnectIcon from '@/assets/img/icon/ic-service-walletconnect.svg'

interface IProps {
  connector: Connector | undefined
}

const defaultWalletMeta: SignClientTypes.Metadata = {
  description: '',
  icons: [''],
  name: '',
  redirect: {},
  url: ''
}

export const WALLET_ICONS: Record<string, string> = {
  injected: MetamaskIcon as string,
  teleport: TeleportIcon as string,
  metaMask: MetamaskIcon as string,
  walletConnect: WalletConnectIcon as string
}

export const WALLET_NAMES: Record<string, string> = {}

export function getWalletIcon(connector: any) {
  return connector?.icon?.startsWith('data:image')
    ? connector?.icon
    : WALLET_ICONS[connector?.providerType ?? connector?.id ?? '']
}

export function getInstallURL(connectorId: string) {
  return (
    {
      metaMask: 'https://metamask.app.link'
    }[connectorId] ?? ''
  )
}

export function useWalletMetadata({ connector }: IProps) {
  const [walletMeta, setWalletMeta] = useState<SignClientTypes.Metadata>({
    ...defaultWalletMeta
  })

  const updateState = useCallback(async () => {
    if (!connector) {
      setWalletMeta(defaultWalletMeta)

      return
    }

    switch (fetchProviderId(connector)) {
      case 'walletConnect': {
        connector?.getProvider &&
          (await connector.getProvider().then((provider: any) => {
            const { metadata } = provider.session.peer

            // icon 예외처리
            if (metadata.name === 'MetaMask Wallet') {
              metadata.icons[0] = `/img/icon/ic-service-metamask.svg?v=2`
            }

            // 예외처리 후에도 빈 경우 walletConnect 기본 아이콘
            if (!metadata.icons[0]) {
              metadata.icons[0] = `/img/icon/ic-service-walletconnect.svg?v=2`
            }

            setWalletMeta(metadata)
          }))
        break
      }
      default: {
        setWalletMeta({
          description: '',
          icons: [getWalletIcon(connector)],
          name: connector?.name,
          redirect: {},
          url: ''
        })

        break
      }
    }
  }, [connector])

  useEffect(() => {
    updateState().finally(() => {})
  }, [connector])

  return { walletMeta }
}
