import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { testAccount } from '../../../vitest-setup'
import mockRoutes from '../../__mock__/mockRoutes'
import mockTokens from '../../__mock__/mockTokens'
import { contractAddresses, silicon } from '../../constants/chain/index'
import { dprec } from '../../utils/number'
import { ISwapRoutes } from '../useFetchRoutes'

import { SwapParams, useSwapCall } from './useSwapCall'

const initialProps = {
  account: testAccount,
  chainId: silicon.id,
  slippage: 0.5,
  inputToken: mockTokens[0],
  outputToken: mockTokens[1],
  inputValue: '0.001',
  outputValue: '2.805798',
  isPos: true,
  routes: {
    fromToken: mockRoutes.fromToken,
    toToken: mockRoutes.toToken,
    best: mockRoutes.best,
    others: [],
    fee: mockRoutes.fee
  } as ISwapRoutes
}

const expectedTx = {
  method: 'swapExactETHForTokens',
  params: [
    '2791769',
    {
      to: '0xd74F8630B8BdBb7b0871FceB7188c9cFAaCB815e',
      path: [
        '0xe66863B695A392507F5d68b6A7B8AA8218914059',
        '0x1e4a5963abfd975d8c9021ce480b42188849d41d'
      ],
      pool: ['0x0000000000000000000000000000000000000000'],
      deadline: 1731349718
    }
  ],
  value: '1000000000000000'
}

describe('validate swapCall', () => {
  it('tx.to should universalRouter', () => {
    const { result } = renderHook(useSwapCall, { initialProps })

    expect(result.current.swapCall.to).toBe(
      contractAddresses.universalRouter[silicon.id]
    )
  })

  it('tx.value should 1000000000000000 (0.001 ETH)', () => {
    const { result } = renderHook(useSwapCall, { initialProps })

    expect(result.current.swapCall.value).toBe(expectedTx.value)
  })

  it('user will sign swapExactETHForTokens with params', () => {
    const { result } = renderHook(useSwapCall, { initialProps })
    const { swapCall } = result.current

    expect(swapCall.tx.method).toBe('swapExactETHForTokens')

    expect(swapCall.tx.params[0]).toEqual('2791769')
    expect((swapCall.tx.params[1] as SwapParams).path).toEqual(
      (expectedTx.params[1] as SwapParams).path
    )
    expect((swapCall.tx.params[1] as SwapParams).pool).toEqual(
      (expectedTx.params[1] as SwapParams).pool
    )
  })
})

describe('test min/max amount', () => {
  it('is exactly output by slippage?', () => {
    const { result } = renderHook(useSwapCall, { initialProps })

    expect(dprec(result.current.maxInput, 6)).toEqual('0.001005')
    expect(dprec(result.current.minOutput, 6)).toEqual('2.791769')
  })
})
