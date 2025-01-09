import { vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { screen } from '@testing-library/react'

export const testAccount: `0x${string}` = '0xd74F8630B8BdBb7b0871FceB7188c9cFAaCB815e'

// @ts-ignore
global.IS_REACT_ACT_ENVIRONMENT = true

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})

export const isRenderedByTestId = (id: string) => {
  let rendered = true
  try  {
    screen.getByTestId(id)
  } catch {
    rendered = false
  }

  return rendered
}