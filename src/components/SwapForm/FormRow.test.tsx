import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach,describe, expect, it, vi } from 'vitest'

import { dprec } from '@/utils/number'

import { isRenderedByTestId } from '../../../vitest-setup'

import mockTokens from '@/__mock__/mockTokens'
import { completeWrapper as wrapper } from '@/__mock__/mockWagmiWrapper'
import { FormRow } from '@/components/SwapForm/FormRow'

const initialProps = {
  idx: 0,
  type: 'swap' as 'swap' | 'pool',
  inputValue: '3500.12345678',
  token: mockTokens[1], // USDT
  hasError: false,
  isMax: false,
  onInput: vi.fn(),
  onFocus: vi.fn(),
  onMax: vi.fn()
}

vi.mock('@gsap/react')

afterEach(() => {
  cleanup()
})

describe('test render <FormRow />', () => {
  it('show title was given. if no title, hide element', () => {
    const title = 'From Token'
    const { rerender } = render(<FormRow {...initialProps} title={title} />, { wrapper })

    expect(screen.getByTestId('form-row-title').innerHTML).toBe(title)

    rerender(<FormRow {...initialProps} title="" />)

    expect(isRenderedByTestId('form-row-title')).toBe(false)
  })

  it('show value with decimal (default 6)', () => {
    render(<FormRow {...initialProps} />, { wrapper })
    expect(screen.getByTestId('form-row-input')).toHaveValue(Number(dprec(initialProps.inputValue, 6)))
  })

  it('show token symbol', () => {
    render(<FormRow {...initialProps} />, { wrapper })
    expect(screen.getByTestId('form-row-symbol').innerHTML).toBe(initialProps.token.symbol)
  })
})

describe('test action <FormRow />', () => {
  it('focus on input, call onFocus()', async () => {
    render(<FormRow {...initialProps} />, { wrapper })

    const user = userEvent.setup()
    await user.click(screen.getByTestId('form-row-input'))

    expect(initialProps.onFocus).toHaveBeenCalledWith(initialProps.idx)
  })

  it('when input, call onChange() with html event', () => {
    const mockOnInput = vi.fn()
    render(<FormRow {...initialProps} onInput={mockOnInput} />, { wrapper })

    fireEvent.change(screen.getByTestId('form-row-input'), { target: { value: '5000' } })
    expect(mockOnInput).toHaveBeenCalledWith(expect.objectContaining({ type: 'change', _reactName: 'onChange' }))
  })

  it('click token symbol or icon, open SelectTokenModal', async () => {
    const user = userEvent.setup()
    const { container, rerender } = render(<FormRow {...initialProps} />, { wrapper })

    const modalOverlay = document.createElement('div')
    modalOverlay.setAttribute('id', 'modal-overlay')
    container.appendChild(modalOverlay)

    await user.click(screen.getByTestId('form-row-symbol'))

    rerender(<FormRow {...initialProps} />)

    expect(isRenderedByTestId('select-token-modal')).toBe(true)
  })
})