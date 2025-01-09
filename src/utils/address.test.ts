import { describe, expect, it } from 'vitest'

import * as AddressUtil from '@/utils/address'

import { testAccount } from '../../vitest-setup'

import { contractAddresses, silicon, SUPPORT_CHAIN_IDS } from '@/constants/chain'

const chainId = silicon.id as SUPPORT_CHAIN_IDS
const nativeToken = contractAddresses.native[chainId]
const wNativeToken = contractAddresses.wNative[chainId]
const govToken = contractAddresses.govToken[chainId]

describe('test isSameAddress()', () => {
  it('each address same => true, different => false', () => {
    expect(AddressUtil.isSameAddress(testAccount, testAccount)).toBe(true)
    expect(AddressUtil.isSameAddress(testAccount, '0x1')).toBe(false)
  })
})

describe('test getMaskedAddress()', () => {
  it('validate result', () => {
    expect(AddressUtil.getMaskedAddress(testAccount, 4, 4, 4)).toBe(`${testAccount.slice(0, 4)}∙∙∙∙${testAccount.slice(-4)}`)
  })
})

describe('test getReadableTokenAddress()', () => {
  it('convert wNative address to native address', () => {
    expect(AddressUtil.getReadableTokenAddress(wNativeToken, chainId)).toBe(nativeToken)
    expect(AddressUtil.getReadableTokenAddress(govToken, chainId)).toBe(govToken)
  })
})

describe('test getWritableTokenAddress()', () => {
  it('convert native address to wNative address', () => {
    expect(AddressUtil.getWritableTokenAddress(nativeToken, chainId)).toBe(wNativeToken)
    expect(AddressUtil.getWritableTokenAddress(govToken, chainId)).toBe(govToken)
  })
})

describe('test getWritablePoolAddress()', () => {
  const pool = '0x6fce001b141314e0428b5a20a90b2c4be0aadf98'

  it('v3 pool use own address', () => {
    expect(AddressUtil.getWritablePoolAddress(pool, 'v3')).toBe(pool)
  })
  it('v2 pool must use ZERO_ADDRESS', () => {
    expect(AddressUtil.getWritablePoolAddress(pool, 'v2')).toBe(AddressUtil.ZERO_ADDRESS)
  })
})

describe('test isNativeToken()', () => {
  it('validate address is native by chainId', () => {
    expect(AddressUtil.isNativeToken(nativeToken, chainId)).toBe(true)
    expect(AddressUtil.isNativeToken(govToken, chainId)).toBe(false)
  })
})

describe('test isWNativeToken()', () => {
  it('validate address is wNative by chainId', () => {
    expect(AddressUtil.isWNativeToken(wNativeToken, chainId)).toBe(true)
    expect(AddressUtil.isWNativeToken(govToken, chainId)).toBe(false)
  })
})

describe('test computePoolAddressV3()', () => {
  const params = {
    factory: '0x2aeEC787Be499ef6f68e527B64FADF969D048042' as `0x${string}`,
    fee: '100',
    token0: '0xe66863B695A392507F5d68b6A7B8AA8218914059' as `0x${string}`, // Silicon WETH
    token1: '0x1e4a5963abfd975d8c9021ce480b42188849d41d' as `0x${string}`, // Silicon USDT (From ZkBridge)
    chainId
  }
  const result = '0x0BeE80A94b801C1626853EA1466A638673483c47'

  it('calculate v3 pool address with uniswap v3 sdk', () => {
    expect(AddressUtil.computePoolAddressV3(params.factory, params.fee, params.token0, params.token1, params.chainId)).toBe(result)
  })

  it('calculate same result even if token order is reversed', () => {
    expect(AddressUtil.computePoolAddressV3(params.factory, params.fee, params.token1, params.token0, params.chainId)).toBe(result)
  })
})