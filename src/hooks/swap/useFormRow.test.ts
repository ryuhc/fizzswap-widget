import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import mockTokens from '../../__mock__/mockTokens'

import { useFormRow } from './useFormRow'


const onSelect = vi.fn()
const initialProps = {
  token: mockTokens[0],
  showSelectIcon: true,
  onSelect
}

describe('check fix decimal', () => {
  it('show only to the 6th decimal place', () => {
    const { result } = renderHook(useFormRow, { initialProps: { ...initialProps, inputValue: '1.12345678' }  })
    expect(result.current.inputValueView).toEqual('1.123456')
  })
})

describe('if progress input', () => {
  it('show all value user typed (end with .)', () => {
    const { result } = renderHook(useFormRow, { initialProps: { ...initialProps, inputValue: '0.' } })
    expect(result.current.inputValueView).toEqual('0.')
  })

  it('show all value user typed (end with 0)', () => {
    const { result } = renderHook(useFormRow, { initialProps: { ...initialProps, inputValue: '0000' } })
    expect(result.current.inputValueView).toEqual('0000')
  })
})