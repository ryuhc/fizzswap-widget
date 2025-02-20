import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { isRenderedByTestId } from '../../../vitest-setup'

import mockTokens from '@/__mock__/mockTokens'
import { completeWrapper as wrapper } from '@/__mock__/mockWagmiWrapper'
import { FormTokenBalance } from '@/components/SwapForm/FormTokenBalance'

const initialProps = {
  token: mockTokens[1], // USDT
  balance: 1000000000n,
  isMax: false,
  onClickMax: vi.fn(),
  hideMax: false
}

afterEach(() => {
  cleanup()
})

describe('test render <FormTokenBalance />', () => {
  it('show balance with decimal, comma', () => {
    render(<FormTokenBalance {...initialProps} />, { wrapper })
    expect(screen.getByTestId('form-token-balance-value').innerHTML).toBe(
      '1,000.000000'
    )
  })

  it('show max button by props.hideMax', () => {
    const { rerender } = render(<FormTokenBalance {...initialProps} />, {
      wrapper
    })
    expect(isRenderedByTestId('form-token-balance-max')).toBe(true)

    rerender(<FormTokenBalance {...initialProps} hideMax={true} />)
    expect(isRenderedByTestId('form-token-balance-max')).toBe(false)
  })
})

describe('test action <FormTokenBalance />', () => {
  it('on click max button, call onClickMax()', async () => {
    const user = userEvent.setup()
    render(<FormTokenBalance {...initialProps} />, { wrapper })

    await user.click(screen.getByTestId('form-token-balance-max'))

    expect(initialProps.onClickMax).toHaveBeenCalled()
  })
})
