import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { PriceImpaction } from '@/components/PriceImpaction'

import { completeWrapper as wrapper } from '@/__mock__/mockWagmiWrapper'

afterEach(() => {
  cleanup()
})

describe('test render <PriceImpaction />', () => {
  it('change color by value', () => {
    const { rerender } = render(<PriceImpaction priceImpact={2} />, { wrapper })

    expect(screen.getByTestId('priceimpact-value').getAttribute('color')).toBe('paleGreen')

    rerender(<PriceImpaction priceImpact={7} />)
    expect(screen.getByTestId('priceimpact-value').getAttribute('color')).toBe('tertiary')

    rerender(<PriceImpaction priceImpact={15} />)
    expect(screen.getByTestId('priceimpact-value').getAttribute('color')).toBe('red')
  })

  it('if price impact very low(< 0.01), not show exact value', () => {
    render(<PriceImpaction priceImpact={0.001} />, { wrapper })
    expect(screen.getByTestId('priceimpact-value').innerHTML).toBe('&lt; 0.01%')
  })
})