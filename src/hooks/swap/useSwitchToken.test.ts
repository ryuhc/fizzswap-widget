import { renderHook } from '@testing-library/react'
import { act } from '@testing-library/react-hooks'
import { describe, expect, it,vi } from 'vitest'

import mockTokens from '../../__mock__/mockTokens'
import { contractAddresses, MIN_AMOUNT_FOR_FEE, silicon } from '../../constants/chain/index'
import { subBN } from '../../utils/number'

import { useSwitchToken } from './useSwitchToken'

const initialProps = {
  inputToken: mockTokens[0],
  outputToken: mockTokens[1],
  inputValue: '1',
  outputValue: '3200',
  selectToken: vi.fn(),
  onInput: vi.fn(),
  typedField: 0,
  nativeAddress: contractAddresses.native[silicon.id],
  isMaxInput: false,
  balances: {
    [mockTokens[0].address]: 1000000000000000000n
  },
  isFetching: false
}

describe('when call onSwitch()', () => {
  it('after select token and fetch route, call props.selectToken() twice', () => {
    const { result } = renderHook(useSwitchToken, { initialProps })

    act(() => result.current.onSwitch())
    expect(initialProps.selectToken).toHaveBeenCalledTimes(2)
  })

  it('before select token or fetch route, not call props.selectToken()', () => {
    const mockSelectToken = vi.fn()
    const { result } = renderHook(useSwitchToken, { initialProps: { ...initialProps, isFetching: true, selectToken: mockSelectToken } })

    act(() => result.current.onSwitch())
    expect(mockSelectToken).not.toHaveBeenCalled()
  })
})

describe('when call refreshEstimate()', () => {
  it('input after subtract few amount if max input and inputToken is native', () => {
    const mockOnInput = vi.fn()
    const { result } = renderHook(useSwitchToken, { initialProps: { ...initialProps, onInput: mockOnInput, isMaxInput: true } })

    act(() => result.current.refreshEstimate(initialProps.inputToken))

    expect(mockOnInput).toHaveBeenCalledWith(subBN(initialProps.inputValue, MIN_AMOUNT_FOR_FEE))
  })
})