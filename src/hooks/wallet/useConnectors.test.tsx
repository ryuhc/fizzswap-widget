import { renderHook } from '@testing-library/react'
import { walletConnect } from '@wagmi/connectors'
import { describe, expect, it } from 'vitest'

import { wagmiWrapper as wrapper } from '@/__mock__/mockWagmiWrapper'
import { mergeConnector, useConnectors } from '@/hooks/wallet/useConnectors'

// TODO : test by platform
describe('validate connector list', () => {
  it('default state', () => {
    const { result } = renderHook(useConnectors, { wrapper })

    expect(result.current.length).toBe(1)
    expect(result.current[0].id).toBe('walletConnect')
  })
})

describe('try merge connector', () => {
  it('return connector merge with params', () => {
    const connector = mergeConnector(
      {
        PROFILE: 'prod'
      },
      walletConnect({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_KEY ?? ''
      }) as any,
      'teleport wallet',
      'teleport'
    )

    expect(connector.name).toBe('teleport wallet')
    expect(connector.providerType).toBe('teleport')
  })
})
