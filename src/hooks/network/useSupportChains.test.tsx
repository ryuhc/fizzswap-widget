import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { silicon } from '@/constants/chain'
import { useSupportChains } from '@/hooks/network/useSupportChains'

describe('validate support chains', () => {
  it('on prod, only support silicon', () => {
    const { result } = renderHook(useSupportChains)

    expect(result.current.length).toBe(1)
    expect(result.current[0].id).toBe(silicon.id)
  })
})