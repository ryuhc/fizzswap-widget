import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Checkbox } from '@/components/Checkbox'

import { uiWrapper as wrapper } from '@/__mock__/mockUiWrapper'

const props = {
  label: 'My Assets',
  color: '#333',
  checked: false,
  onCheck: vi.fn()
}

afterEach(() => {
  cleanup()
})

describe('test render <Checkbox />', () => {
  it('show right label with color', () => {
    render(<Checkbox {...props} />, { wrapper })

    expect(screen.getByTestId('checkbox-label').innerHTML).toBe(props.label)
    // @ts-ignore
    expect(
      screen.getByTestId('checkbox-label').attributes.color?.value ?? ''
    ).toBe(props.color)
  })
})

describe('test action <Checkbox />', () => {
  it('call props.onCheck() when click checkbox or label', async () => {
    const user = userEvent.setup()
    render(<Checkbox {...props} />, { wrapper })

    await user.click(screen.getByTestId('checkbox-btn'))
    await user.click(screen.getByTestId('checkbox-label'))

    expect(props.onCheck).toHaveBeenCalledTimes(2)
  })
})
