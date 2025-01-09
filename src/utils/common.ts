import BN from 'bignumber.js'
import platform from 'platform'

import { ITokenItem } from '@/hooks/queries/useTokenList'

export function textEllipsis(text: string, length: number) {
  if (text.length <= length) {
    return text
  }

  return text.slice(0, length) + '...'
}

export function getCompoundedAPY(apr: string) {
  if (Number(apr) === 0) {
    return '0'
  }

  const dailyTotalRewardRate = Number(apr || 0) / 365 / 100

  return new BN(String(((1 + dailyTotalRewardRate) ** 365 - 1) * 100)).toString()
}

export function isMobileOS() {
  const os = platform?.os?.family || ''

  return os.toLowerCase() === 'ios' || os.toLowerCase() === 'android'
}

export function isIOS() {
  const os = platform?.os?.family || ''

  return os.toLowerCase() === 'ios'
}

export function isAndroid() {
  const os = platform?.os?.family || ''

  return os.toLowerCase() === 'android'
}

// 가변화?
export function calcTxDeadline() {
  return Math.ceil(new Date().valueOf() / 1000) + (60 * 1000)
}

export function pickTokenName(token: ITokenItem, locale: string) {
  return {
    en: token.nameEn,
    ko: token.nameKo
  }[locale] ?? token.nameEn
}

export function debugLog(content: any, profile: string) {
  const _profile = import.meta.env.VITE_PROFILE ?? profile

  if (_profile !== 'prod') {
    console.log(content)
  }
}

export function fetchProviderId(provider: any) {
  return provider?.providerType ?? provider?.id ?? ''
}