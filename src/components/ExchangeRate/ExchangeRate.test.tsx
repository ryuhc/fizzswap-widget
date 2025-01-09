import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { isRenderedByTestId } from '../../../vitest-setup'
import { ExchangeRate } from '@/components/ExchangeRate'

import mockTokens from '@/__mock__/mockTokens'
import { uiWrapper as wrapper } from '@/__mock__/mockUiWrapper'

const initialProps = {
  tokenA: mockTokens[0],
  tokenB: mockTokens[1],
  onReverse: vi.fn(),
}

afterEach(() => {
  cleanup()
})

describe('test render <ExchangeRate />', () => {
  it('show exchange rate with comma, precision', () => {
    render(<ExchangeRate {...{ ...initialProps, rate: '2500' }} />, { wrapper })
    expect(screen.getByTestId('exchange-rate-value').innerHTML).toBe('2,500.000000')
  })

  it('if props.version 3, hide convert button', () => {
    const { rerender } = render(<ExchangeRate {...{ ...initialProps, rate: '2500', version: 3 }} />, { wrapper })

    expect(isRenderedByTestId('exchange-rate-convert')).toBe(false)

    rerender(<ExchangeRate {...{ ...initialProps, rate: '2500', version: 2 }} />)

    expect(isRenderedByTestId('exchange-rate-convert')).toBe(true)
  })

  it('validate price is token.price * rate', () => {
    const { rerender } = render(<ExchangeRate {...{ ...initialProps, rate: '2500' }} />, { wrapper })

    expect(screen.getByTestId('exchange-rate-price').innerHTML).toBe(`&nbsp;($ 2,500.0000)`)

    rerender(<ExchangeRate {...{ ...initialProps, rate: '3000' }} />)

    expect(screen.getByTestId('exchange-rate-price').innerHTML).toBe(`&nbsp;($ 3,000.0000)`)
  })
})

describe('test action <ExchangeRate />', () => {
  it('click convert, call props.onReverse() and show reversed values', async () => {
    const user = userEvent.setup()

    render(<ExchangeRate {...{ ...initialProps, rate: '2500' }} />, { wrapper })

    await user.click(screen.getByTestId('exchange-rate-convert'))

    expect(initialProps.onReverse).toHaveBeenCalled()
    expect(screen.getByTestId('exchange-rate-value').innerHTML).toBe(`0.000400`)
    expect(screen.getByTestId('exchange-rate-price').innerHTML).toBe(`&nbsp;($ 1.0000)`)
  })
})