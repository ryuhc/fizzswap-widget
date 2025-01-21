import { cleanup,render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ISwapRoutes } from '@/hooks/useFetchRoutes'
import * as useFetchRoutesHook from '@/hooks/useFetchRoutes'
import { dprec, mulBN, safeDiv, toReadableBN } from '@/utils/number'

import { SwapEstimated } from '@/components/SwapEstimated'

import * as SwapStore from '@/state/swap'

import mockRoutes from '@/__mock__/mockRoutes'
import mockTokens from '@/__mock__/mockTokens'
import { completeWrapper as wrapper } from '@/__mock__/mockWagmiWrapper'

vi.mock('@/state/swap')
vi.mock('@/state/common', () => ({
  useCommonStore: () => ({
    windowInfo: {
      width: 1920,
      height: 1080
    },
    slippage: mockSlippage
  })
}))
vi.mock('@/hooks/useFetchRoutes')

const initialState = {
  inputToken: mockTokens[0],
  outputToken: mockTokens[1],
  inputValue: '0.001',
  outputValue: '2.805798',
  priceImpact: 1.5,
  updateValue: vi.fn(),
  setPriceImpact: vi.fn(),
  typedField: 0
}
const mockSlippage = 2
const mockUseFetchRoutes = {
  data: mockRoutes as unknown as ISwapRoutes,
  refetch: vi.fn(),
  isFetching: false,
  fetchRoute: vi.fn()
}

afterEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe('test render <SwapEstimated />', () => {
  it('if pos trade, show minOutput with title', () => {
    vi.spyOn(SwapStore, 'useSwapState').mockImplementation(() => {
      return { ...initialState }
    })
    vi.spyOn(useFetchRoutesHook, 'useFetchRoutes').mockImplementation(() => {
      return mockUseFetchRoutes
    })

    render(<SwapEstimated />, { wrapper })

    expect(screen.getByTestId('estimated-swap-title').innerHTML).toBe('MinAmount')
    expect(screen.getByTestId('estimated-swap-minAmount').innerHTML).toBe(`${dprec(mulBN(initialState.outputValue, safeDiv(100 - mockSlippage, 100)), 6)} ${initialState.outputToken.symbol}`)
  })

  it('if neg trade, show maxInput with title', () => {
    vi.spyOn(SwapStore, 'useSwapState').mockImplementation(() => {
      return { ...initialState, typedField: 1 }
    })
    vi.spyOn(useFetchRoutesHook, 'useFetchRoutes').mockImplementation(() => {
      return mockUseFetchRoutes
    })

    render(<SwapEstimated />, { wrapper })

    expect(screen.getByTestId('estimated-swap-title').innerHTML).toBe('MinAmount')
    expect(screen.getByTestId('estimated-swap-minAmount').innerHTML).toBe(`${dprec(mulBN(initialState.inputValue, safeDiv(100 + mockSlippage, 100)), 6)} ${initialState.inputToken.symbol}`)
  })

  /*
  it('show swap fee and forwarded routes (even thought neg trade)', () => {
    vi.spyOn(SwapStore, 'useSwapState').mockImplementation(() => {
      return { ...initialState, typedField: 1 }
    })
    vi.spyOn(useFetchRoutesHook, 'useFetchRoutes').mockImplementation(() => {
      return mockUseFetchRoutes
    })

    render(<SwapEstimated />, { wrapper })

    expect(screen.getByTestId('estimated-swap-fee').innerHTML).toBe(`${toReadableBN(mockRoutes.fee, initialState.inputToken.decimal, 6, true)} ${initialState.inputToken.symbol}`)
    expect(screen.getByText(`${initialState.inputToken.symbol} > ${initialState.outputToken.symbol} (0.3%) V2`)).toBeInTheDocument()
  })
  */
})