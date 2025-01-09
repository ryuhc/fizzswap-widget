import BN, { BigNumber } from 'bignumber.js'
import { formatUnits } from 'viem'

import { INFINITY_SYMBOL } from '@/constants'

// eslint-disable-next-line import/order
import Value = BigNumber.Value

BN.config({
  EXPONENTIAL_AT: [-96, 96]
})

export function dclean(_v: string | number) { // 불필요한 0 제거
  const v = String(_v);

  let dot = v.indexOf('.'); if(dot === -1) dot = v.length;
  let num = v.substr(0, dot), dec = v.substr(dot + 1);

  num = num.replace(/^0+/, '');

  if(num.length === 0) {
    num = '0';
  }

  dec = dec.replace(/0+$/, '');

  if(dec.length > 0) {
    num += '.' + dec;
  }

  return num;
}

export function dprec(_v: any, d: number, force = false) { // 강제로 소수점 이하 d자리 출력
  if(_v === INFINITY_SYMBOL) {
    return _v;
  }

  if(!force && parseFloat(_v) === 0) {
    return '0';
  }

  const v = dclean(_v);

  let dot = v.indexOf('.'); if(dot === -1) dot = v.length;
  let num = v.substr(0, dot), dec = v.substr(dot + 1);

  if(dec.length > d) {
    dec = dec.substr(0, d);
  } else {
    dec += '0'.repeat(d - dec.length);
  }

  if(d > 0) {
    num += '.' + dec;
  }

  return num;
}

export function addComma(num: string | number) {
  if(!num) return '0';

  const commaRegex = /\B(?=(\d{3})+(?!\d))/g;
  const parts = String(num).split('.');

  return parts[0].replace(commaRegex, ',') + (parts[1] ? '.' + parts[1] : '');
}

function roundDownSignificantDigits(number: number, decimals: number) {
  const significantDigits = (parseInt(number.toExponential().split('e-')[1])) || 0
  const decimalsUpdated = (decimals || 0) +  significantDigits - 1

  decimals = Math.min(decimalsUpdated, number.toString().length)

  return (Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals))
}

export function formatNumber(number: number, decimals: number, minDecimals?: number) {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: minDecimals ?? decimals,
    maximumFractionDigits: decimals
  })

  return formatter.format(roundDownSignificantDigits(Number(number), decimals))
}

export function formatUnitsWithPrecision(number: bigint, decimals: number, precision: number) {
  return formatNumber(Number(formatUnits(number, decimals)), precision)
}

export function mulBN(a: Value | bigint, b: Value | bigint, withComma = false) {
  const res = new BN(String(a || '0')).multipliedBy(String(b || '0')).toString()
  return withComma ? addComma(res) : res
}
export function mulBNWithDecimal(a: Value | bigint, b: Value | bigint, decimal = 0, withComma = false) {
  const res = new BN(new BN(String(a || '0')).multipliedBy(String(b || '0')).decimalPlaces(decimal, 1)).toString()
  return withComma ? addComma(res) : res
}
export function divBN(a: Value | bigint, b: Value | bigint, withComma = false) {
  const res = (Number.isNaN(a) || Number(a) === 0 || Number.isNaN(b) || Number(b) === 0) ? '0' : new BN(String(a || '0')).dividedBy(String(b || '0')).toString()
  return withComma ? addComma(res) : res
}
export function divBNWithDecimal(a: Value | bigint, b: Value | bigint, decimal = 0, withComma = false) {
  const res = (Number.isNaN(a) || Number(a) === 0 || Number.isNaN(b) || Number(b) === 0) ? '0' : new BN(new BN(String(a || '0')).dividedBy(String(b || '0')).decimalPlaces(decimal, 1)).toString()
  return withComma ? addComma(res) : res
}
export function toReadableBN(a: Value | bigint, decimal: number, precision = 6, withComma = false) {
  const res = a === '' || a === '0' ? '0' : dprec(new BN(new BN(String(a || '0')).dividedBy(10 ** decimal).decimalPlaces(precision, 1)).toString(), precision)
  return withComma ? addComma(res) : res
}
export function toWritableUnit(a: Value | bigint, decimal: number) {
  return a === '' || a === '0' ? '0' : new BN(new BN(String(a || '0')).multipliedBy(10 ** decimal).decimalPlaces(0, 1)).toString()
}

export function subBN(a: Value | bigint, b: Value | bigint, withComma = false) {
  const res = new BN(String(a || '0')).minus(String(b || '0')).toString()
  return withComma ? addComma(res) : res
}

export function safeSubBN(a: Value | bigint, b: Value | bigint) {
  const res = new BN(String(a || '0')).minus(String(b || '0'))

  return res.comparedTo('0') !== 1 ? '0' : res
}

export function addBN(a: Value | bigint, b: Value | bigint, withComma = false) {
  const res = new BN(String(a || '0')).plus(String(b || '0')).toString()
  return withComma ? addComma(res) : res
}

export function safeAdd(a: string | number, b: string | number) {
  const _a = Number(a);
  const _b = Number(b);

  if(Number.isNaN(_a) || Number.isNaN(_b)) {
    return 0;
  }

  return _a + _b;
}

export function safeSub(a: string | number, b: string | number) {
  const _a = Number(a);
  const _b = Number(b);

  if(Number.isNaN(_a) || Number.isNaN(_b)) {
    return 0;
  }

  return _a - _b;
}

export function safeMul(a: string | number, b: string | number) {
  const _a = Number(a);
  const _b = Number(b);

  if(!a || !b || !_a || !b || Number.isNaN(_a) || Number.isNaN(_b)) {
    return 0;
  }

  return _a * _b;
}

// Divided By Zero 방지
export function safeDiv(a: string | number, b: string | number) {
  const _a = Number(a);
  const _b = Number(b);

  if(!a || !b || !_a || !_b || Number.isNaN(_a) || Number.isNaN(_b)) {
    return 0;
  }

  return _a / _b;
}

export const UINT_128_MAX = '30028236692093850000000000000000000000'
export const UINT_256_MAX = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

export function maxBN(a: string | BigNumber | bigint | number, b: string | BigNumber | bigint | number) {
  return new BN(typeof a === 'bigint' ? String(a) : a).comparedTo(typeof b === 'bigint' ? String(b) : b) === 1 ? a : b
}

export function minBN(a: string | BigNumber | bigint | number, b: string | BigNumber | bigint | number) {
  return new BN(typeof a === 'bigint' ? String(a) : a).comparedTo(typeof b === 'bigint' ? String(b) : b) === 1 ? b : a
}

export function calcPriceRange(rate: string, slippage: number, reverse: boolean) {
  let minPrice = mulBN(rate, 1 - safeDiv(slippage, 100))
  let maxPrice = mulBN(rate, 1 + safeDiv(slippage, 100))

  if (reverse) {
    minPrice = divBN(1, mulBN(rate, 1 + safeDiv(slippage, 100)))
    maxPrice = divBN(1, mulBN(rate, 1 - safeDiv(slippage, 100)))
  }

  return { minPrice, maxPrice }
}

export function getSignificantFigures(value: string, defaultValue?: number) {
  if (Number(value) < 1) {
    const splitData = value.split('')

    const findIndex = safeSub(
      splitData.findIndex((index: string) => Number(index) > 0),
      2
    )
    return Math.min(findIndex > 3 ? findIndex + 3 : 6, 10)
  } else {
    return defaultValue ?? 6
  }
}