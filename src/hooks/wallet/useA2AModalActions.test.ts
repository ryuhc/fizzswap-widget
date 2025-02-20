import { renderHook } from '@testing-library/react'
import { act } from '@testing-library/react-hooks'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useA2AModalActions } from '@/hooks/wallet/useA2AModalActions'

const initialProps = {
  onClose: vi.fn()
}

vi.useFakeTimers()
vi.spyOn(globalThis, 'setInterval')
vi.spyOn(globalThis, 'clearInterval')

afterEach(() => {
  vi.clearAllMocks()
})

describe('test timer on a2a modal. default timeout is 5 minute', () => {
  it('check initial state', () => {
    const { result } = renderHook(useA2AModalActions, { initialProps })
    expect(result.current).toEqual({
      remain: { minutes: 5, seconds: 0 },
      isFinished: false
    })
  })

  it('remain 4m50s after 10 seconds', () => {
    const { result, rerender } = renderHook(useA2AModalActions, {
      initialProps
    })

    act(() => {
      vi.advanceTimersByTime(1000 * 10)
    })
    rerender(initialProps)

    expect(result.current).toEqual({
      remain: { minutes: 4, seconds: 50 },
      isFinished: false
    })
  })

  it('isFinished to false and call props.onClose after timeout', () => {
    const { result, rerender } = renderHook(useA2AModalActions, {
      initialProps
    })

    act(() => {
      vi.advanceTimersByTime(1000 * 60 * 5 + 1)
    })
    rerender(initialProps)

    expect(result.current).toEqual({
      remain: { minutes: 0, seconds: 0 },
      isFinished: true
    })
    expect(initialProps.onClose).toHaveBeenCalled()
  })
})
