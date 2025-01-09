import { describe, expect,it } from 'vitest'

import * as NumberUtil from '@/utils/number'

describe('test dclean()', () => {
  it('delete unused 0', () => {
    expect(NumberUtil.dclean('0.00100')).toBe('0.001')
  })
})

describe('test dprec()', () => {
  it('force add precision by params', () => {
    expect(NumberUtil.dprec('0.001', 6)).toBe('0.001000')
    expect(NumberUtil.dprec('0.12345678', 4)).toBe('0.1234')
  })
})

describe('test addComma()', () => {
  it('add comma by 1,000', () => {
    expect(NumberUtil.addComma('1234567')).toBe('1,234,567')
  })
})

describe('test formatNumber()', () => {
  it('round down with decimal', () => {
    expect(NumberUtil.formatNumber(1234, 6)).toBe('1,234.000000')
  })
})

describe('test mulBN()', () => {
  it('multiply bn', () => {
    expect(NumberUtil.mulBN('2', '3')).toBe('6')
  })
  it('multiply bn with decimals', () => {
    expect(NumberUtil.mulBN('2000', '3', true)).toBe('6,000')
  })
  it('multiply bn with precision', () => {
    expect(NumberUtil.mulBNWithDecimal('2', '1.62', 1)).toBe('3.2')
  })
})

describe('test divBN()', () => {
  it('divide bn', () => {
    expect(NumberUtil.divBN('5', '2')).toBe('2.5')
  })
  it('divide bn with decimals', () => {
    expect(NumberUtil.divBN('4000', '4', true)).toBe('1,000')
  })
  it('divide bn with precision', () => {
    expect(NumberUtil.divBNWithDecimal('3', '1.99', 1)).toBe('1.5')
  })
})

describe('test subBN()', () => {
  it('subtract bn', () => {
    expect(NumberUtil.subBN(7, 5)).toBe('2')
  })
})

describe('test addBN()', () => {
  it('add bn', () => {
    expect(NumberUtil.addBN(7, 5)).toBe('12')
  })
})

describe('validate safeMath', () => {
  it('safe add (not allowed NaN)', () => {
    expect(NumberUtil.safeAdd(7, 'z')).toBe(0)
  })

  it('safe sub (not allowed NaN)', () => {
    expect(NumberUtil.safeSub(7, 'w')).toBe(0)
  })

  it('safe div (no divided by zero)', () => {
    expect(NumberUtil.safeDiv(7, 0)).toBe(0)
  })
})

describe('calculate min/max bn', () => {
  it('test minBN()', () => {
    expect(NumberUtil.minBN('3', '2')).toBe('2')
  })

  it('test maxBN()', () => {
    expect(NumberUtil.maxBN('5', '4')).toBe('5')
  })
})

describe('test calcPriceRange()', () => {
  it('get price range by slippage', () => {
    expect(NumberUtil.calcPriceRange('2', 50, false)).toEqual({
      minPrice: '1',
      maxPrice: '3'
    })
  })

  it('get reversed range by slippage', () => {
    expect(NumberUtil.calcPriceRange('1', 50, true)).toEqual({
      minPrice: '0.66666666666666666667',
      maxPrice: '2'
    })
  })
})