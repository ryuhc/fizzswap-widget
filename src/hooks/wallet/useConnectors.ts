import { useMemo } from 'react'

import { metaMask, walletConnect } from '@wagmi/connectors'
import { cloneDeep, filter, find, orderBy } from 'lodash'
import { Connector, useConnect } from 'wagmi'

import { isMobileOS } from '@/utils/common'

import { disableByPlatform } from '@/context/WalletActionProvider'

export const priorityForUI: {
  desktop: Record<string, number>
  mobile: Record<string, number>
} = {
  desktop: {
    metaMask: 1,
    teleport: 2,
    walletConnect: 3
  },
  mobile: {
    metaMask: 1,
    teleport: 2,
    walletConnect: 3
  }
}

const supportWallets = ['metaMask', 'walletConnect', 'teleport']

export function mergeConnector(
  env: any,
  connector: Connector,
  name: string,
  providerType: string
) {
  let mergedConnector: any

  switch (connector.id) {
    case 'metaMask': {
      mergedConnector = metaMask()
      break
    }
    case 'walletConnect': {
      mergedConnector = walletConnect({
        projectId: import.meta.env.VITE_WALLETCONNECT_KEY ?? ''
      })
      break
    }
    default: {
      mergedConnector = cloneDeep(connector)
      break
    }
  }

  mergedConnector.name = name
  mergedConnector.providerType = providerType

  return mergedConnector
}

export function useConnectors() {
  const { connectors } = useConnect()

  return useMemo(() => {
    let list = []
    let wcConnector: any
    let metamaskConnector: any

    for (const connector of connectors) {
      if (connector.id === 'metaMask') {
        metamaskConnector = connector
      }
      if (connector.id === 'walletConnect') {
        wcConnector = connector
      }

      list.push(connector)
    }

    const _isMobileOS = isMobileOS()
    const priority = _isMobileOS ? priorityForUI.mobile : priorityForUI.desktop

    list = filter(list, (provider) => {
      return (
        supportWallets.find((supportId) => {
          return supportId === provider.id
        }) &&
        !find(
          _isMobileOS ? disableByPlatform.mobile : disableByPlatform.desktop,
          (id) => {
            return id === (provider?.providerType ?? provider.id)
          }
        )
      )
    })

    return orderBy(list, (connector) => {
      // @ts-ignore
      return priority[connector?.providerType ?? connector?.id ?? ''] ?? 100
    }) as Connector[]
  }, [connectors])
}
