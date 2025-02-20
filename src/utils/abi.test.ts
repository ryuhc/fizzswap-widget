import { Abi } from 'viem'
import { describe, expect, it } from 'vitest'

import { decodeEventOnReceipt, getInterface } from '@/utils/abi'

import exampleTx from '@/__mock__/mockReceipt'
import ERC20ABI from '@/abi/common/ERC20.json'

// Zap 0.1 USDT on USDT-ETH 0.2% pool
// show more details on https://scope.silicon.network/tx/0xd43fc3a090dfbc484d25ae20c0fc90a3c8b72c58f0cc5af1baaf7f1f81b2ce9d

describe('test getInterface()', () => {
  it('find interface from abi', () => {
    const methodInfo = getInterface(ERC20ABI, 'symbol')

    expect(methodInfo?.name).toBe('symbol')
    expect(methodInfo?.stateMutability).toBe('view')
    expect(methodInfo?.outputs).toEqual([{ name: '', type: 'string' }])
  })
})

describe('test decodeEventOnReceipt()', () => {
  it('get decoded event from receipt', () => {
    const decoded = decodeEventOnReceipt(
      exampleTx.receipt,
      exampleTx.abi as Abi,
      exampleTx.eventName
    )

    expect(decoded).toEqual({
      user: '0xd74F8630B8BdBb7b0871FceB7188c9cFAaCB815e',
      token0: '0x1E4a5963aBFD975d8c9021ce480b42188849D41d',
      token1: '0xe66863B695A392507F5d68b6A7B8AA8218914059',
      fee: 2000,
      amount: 100000n,
      zeroForOne: true,
      tokenId: 47n
    })
  })
})
