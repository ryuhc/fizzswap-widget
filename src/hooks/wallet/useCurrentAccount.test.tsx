import { renderHook } from '@testing-library/react'
import { describe, expect,it, vi } from 'vitest'

import { testAccount } from '../../../vitest-setup'

import { useCurrentAccount } from '@/hooks/wallet/useCurrentAccount'

const defaultAccount = testAccount

vi.mock('wagmi', () => {
  return {
    useAccount: () => ({ address: defaultAccount })
  }
})

describe('check wallet address by url', () => {
  it('on normal mode, read from wagmi.useAccount', () => {
    const { result } = renderHook(useCurrentAccount)

    expect(result.current).toBe(defaultAccount)
  })
})