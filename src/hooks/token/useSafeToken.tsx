import { useCallback, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'

import { useLocalStorage } from '@uidotdev/usehooks'
import { cloneDeep, filter } from 'lodash'
import { useChainId } from 'wagmi'

import useModal from '@/hooks/useModal'

import { SafeTokenModal } from '@/modal/SafeTokenModal'

import { SUPPORT_CHAIN_IDS } from '@/constants/chain'
import { ITokenItem } from '@/hooks/queries/useTokenList'
import { useNativeToken } from '@/hooks/token/useNativeToken'

export function useSafeToken(tokens: ITokenItem[], callback?: Function) {
  const [showSafeAlert, setShowSafeAlert, safeAlertPortal, closeSafeAlert] = useModal()

  const chainId = useChainId() as SUPPORT_CHAIN_IDS
  const nativeToken = useNativeToken(chainId)

  const [hideTokenAlert, setHideTokenAlert] = useLocalStorage(
    'swap.hideTokenAlert',
    {} as Record<`0x${string}`, number>
  )
  const unsafeTokens = useMemo(() => {
    const now = new Date().valueOf()

    return filter(tokens, token => {
      const hideUntil = hideTokenAlert[token.address]

      return token.grade !== 'A' && (!hideUntil || now >= hideUntil)
    })
  }, [tokens, nativeToken, hideTokenAlert])
  const safeAlert = useMemo(() => {
    return (showSafeAlert && safeAlertPortal) ? createPortal(
      <SafeTokenModal
        tokens={unsafeTokens}
        onConfirm={(tokensForHide?: ITokenItem[]) => {
          callback && callback()
          closeSafeAlert()

          if (tokensForHide) {
            addHideToken(tokensForHide)
          }
        }}
        onClose={closeSafeAlert}
      /> as any,
      safeAlertPortal
    ) : null
  }, [showSafeAlert, safeAlertPortal, unsafeTokens, callback])

  const addHideToken = useCallback((tokensForHide: ITokenItem[]) => {
    const newState = cloneDeep(hideTokenAlert)

    for (const token of tokensForHide) {
      newState[token.address] = new Date().valueOf() + (7 * 86400 * 1000)
    }

    setHideTokenAlert(newState)
  }, [hideTokenAlert])
  const clearHideTokenAlert = useCallback(() => {
    const now = new Date().valueOf()
    const newState = cloneDeep(hideTokenAlert)

    let needUpdate = false
    for (const token of tokens) {
      const until = hideTokenAlert[token.address]

      if (until && until <= now) {
        needUpdate = true
        delete newState[token.address]
      }
    }

    if (needUpdate) {
      setHideTokenAlert(newState)
    }
  }, [hideTokenAlert, tokens])
  useEffect(() => {
    if (showSafeAlert) {
      clearHideTokenAlert()
    }
  }, [showSafeAlert])

  return {
    safeAlert,
    openSafeAlert: setShowSafeAlert,
    closeSafeAlert,
    unsafeTokens,
    hideTokenAlert
  }
}