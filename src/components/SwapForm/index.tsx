import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import { isValidAddress } from '@ethereumjs/util'
import { useDebounce } from '@uidotdev/usehooks'
import BN from 'bignumber.js'
import { DateTime } from 'luxon'
import { Abi } from 'viem'
import { useChainId } from 'wagmi'

import { useContractAddresses } from '@/hooks/useContractAddresses'
import { useFetchRoutes } from '@/hooks/useFetchRoutes'
import useModal from '@/hooks/useModal'
import { useRefetchByChainId } from '@/hooks/useRefetchByChainId'
import { useSendTx } from '@/hooks/useSendTx'
import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'
import { useTxPolicy } from '@/hooks/useTxPolicy'
import { isSameAddress } from '@/utils/address'
import { fetchTokenList } from '@/utils/fetch'
import { divBN, dprec, mulBN, safeDiv, toReadableBN, toWritableUnit } from '@/utils/number'

import { ExchangeRate } from '@/components/ExchangeRate'
import { Image } from '@/components/Image/'
import { SlippageSetting } from '@/components/SlippageSetting'
import { SwapEstimated } from '@/components/SwapEstimated'
import { SwapInputOption } from '@/components/SwapInputOption'

import { TxConfirmModal } from '@/modal/TxConfirmModal'

import { useCommonStore } from '@/state/common'
import { useSwapState } from '@/state/swap'

import { Text } from '@/styles/common'

import ConvertHoveredIcon from '@/assets/img/icon/ic-convert-hovered.svg'
import ConvertDefaultIcon from '@/assets/img/icon/ic-convert-primary.svg'
import ProgressIcon from '@/assets/img/icon/ic-progress.png'
import RefreshIcon from '@/assets/img/icon/ic-refresh-swap.svg'
import { FormRow } from '@/components/SwapForm/FormRow'
import {
  FormDivider,
  FormError,
  FormSubmit,
  RefreshRouteButton,
  StyledSwapForm,
  SwapConfigArea
} from '@/components/SwapForm/styles'
import { getAvailableBalance, SUPPORT_CHAIN_IDS } from '@/constants/chain'
import { useConfigContext } from '@/context/ConfigProvider'
import { useApiUrl } from '@/hooks/network/useApiUrl'
import { useTokenBalances } from '@/hooks/queries/useTokenBalances'
import { ITokenItem } from '@/hooks/queries/useTokenList'
import { useFormSubmit } from '@/hooks/swap/useFormSubmit'
import { useSwapCall } from '@/hooks/swap/useSwapCall'
import { useSwitchToken } from '@/hooks/swap/useSwitchToken'
import { useNativeToken } from '@/hooks/token/useNativeToken'
import { useCurrentAccount } from '@/hooks/wallet/useCurrentAccount'
import { fetchSwapRoutes } from '@/state/swap/fetch/fetchSwapRoutes'

export function SwapForm() {
  const { t, locale } = useTranslationSimplify()

  const {
    inputToken,
    outputToken,
    selectToken,
    inputValue,
    outputValue,
    isMaxInput,
    updateValue,
    setMaxInput,
    typedField,
    focusOnField,
    error,
    setError,
    priceImpact,
    setPriceImpact,
    clearInput,
    clearState,
  } = useSwapState()
  const { slippage } = useCommonStore()
  const config = useConfigContext()

  const chainId = useChainId() as SUPPORT_CHAIN_IDS
  const nativeAddress = useNativeToken(chainId)
  const selectedTokens = useMemo(() => {
    const res: `0x${string}`[] = [nativeAddress]

    if (inputToken.address && inputToken.address !== nativeAddress) {
      res.push(inputToken.address)
    }

    if (outputToken.address && outputToken.address !== nativeAddress) {
      res.push(outputToken.address)
    }

    return res
  }, [inputToken, outputToken, nativeAddress])
  const balances = useTokenBalances(selectedTokens)

  const {
    data: routes,
    isFetching,
    fetchRoute,
    updatedAt
  } = useFetchRoutes({
    inputToken,
    outputToken,
    amount:
      typedField === 0
        ? toWritableUnit(inputValue, inputToken.decimal)
        : toWritableUnit(outputValue, outputToken.decimal),
    isPos: typedField === 0,
    updateValue,
    setPriceImpact,
  })
  const [routeId, setRouteId] = useState<number>(0)
  const debouncedRouteId = useDebounce(routeId, 1000)
  const callFetchRoute = useCallback(() => {
    if (isFetching) {
      return
    }

    if (debouncedRouteId > 0) {
      fetchRoute().then((res) => {
        if (
          res.best.fromAmount !== '0' &&
          res.best.toAmount !== '0' &&
          res.best.path.length === 0
        ) {
          return setError(t('General.IsEmptyRoute'), {
            token0: false,
            token1: false,
          })
        }
      })
    }
  }, [debouncedRouteId, isFetching])
  useEffect(() => {
    callFetchRoute()
  }, [debouncedRouteId])

  const [delayed, setDelayed] = useState<boolean>(false)
  useEffect(() => {
    setDelayed(true)
    setTimeout(() => setDelayed(false), 1000)
  }, [routeId])

  const [priceHandler, setPriceHandler] = useState<{
    show: boolean
    callback: Function
  }>({
    show: false,
    callback: () => {},
  })

  const apiPath = useApiUrl()
  const refreshRoute = useCallback(async () => {
    const exchangeRate = divBN(routes.best.toAmount, routes.best.fromAmount)

    if (exchangeRate === '0') {
      setPriceHandler({ show: false, callback: () => {} })
      return
    }

    const isPos = typedField === 0
    const newRoute = await fetchRoute()

    const newInput = toReadableBN(
      newRoute.best.fromAmount,
      inputToken.decimal,
      inputToken.decimal,
    )
    const newOutput = toReadableBN(
      newRoute.best.toAmount,
      outputToken.decimal,
      outputToken.decimal,
    )

    const isRevertPos =
      isPos &&
      new BN(mulBN(outputValue, safeDiv(100 - slippage, 100))).comparedTo(
        mulBN(newOutput, safeDiv(100 - slippage, 100)),
      ) === 1
    const isRevertNeg =
      !isPos &&
      new BN(mulBN(inputValue, safeDiv(100 + slippage, 100))).comparedTo(
        mulBN(newInput, safeDiv(100 + slippage, 100)),
      ) === -1

    if (isRevertPos || isRevertNeg) {
      setPriceHandler({
        show: true,
        callback: () => {
          updateValue(newInput, 0)
          updateValue(newOutput, 1)
          setPriceImpact(Number(newRoute.best.priceImpact))

          setPriceHandler({ show: false, callback: () => {} })
        },
      })
    }
  }, [routes, typedField, fetchRoute, inputToken, inputValue, outputToken, outputValue, slippage])
  useEffect(() => {
    const timeout = setInterval(refreshRoute, 1000 * 15)

    return () => {
      clearInterval(timeout)
    }
  }, [routes])

  // about input
  const onFocus = useCallback(
    (field: number) => {
      focusOnField(field)

      const isSelected = inputToken.address && outputToken.address
      const hasInput = Number(inputValue) > 0 || Number(outputValue) > 0

      if (isSelected && hasInput) {
        setRouteId(routeId + 1)
      }
    },
    [routeId, inputToken, outputToken, inputValue, outputValue],
  )

  const onInput = useCallback(
    async (e: ChangeEvent<HTMLInputElement> | string, field?: number) => {
      const targetField = field ?? typedField
      let value = typeof e === 'string' ? e : e.target.value

      if (Number(value) >= Number.MAX_SAFE_INTEGER) {
        value = '0'
      }

      updateValue(value, targetField)
      setRouteId(routeId + 1)
      setError('', { token0: false, token1: false })

      if (value === '') {
        updateValue('', targetField === 0 ? 1 : 0)
      }

      /*
    if (validateInput(targetField, value)) {
      setError('', {token0: false, token1: false})
    }
    */
    },
    [typedField, routeId],
  )

  const account = useCurrentAccount()

  useRefetchByChainId(() => {
    clearState()
    initSwapConfig().finally()
  })

  const onSelectMax = useCallback(
    (idx: number, balance: string) => {
      focusOnField(idx)
      setMaxInput(typedField !== idx ? true : !isMaxInput)

      onInput(
        getAvailableBalance(
          balance,
          chainId,
          (idx === 0
            ? inputToken.address
            : outputToken.address) as `0x${string}`,
        ),
        idx,
      ).finally()
    },
    [chainId, inputToken, outputToken, isMaxInput, typedField, onInput],
  )

  // about initialize
  const contractAddresses = useContractAddresses()
  const initSwapConfig = useCallback(async () => {
    const inputCurrency = config.inputTokenAddress ?? ''
    const outputCurrency = config.outputTokenAddress ?? ''

    let addresses: string = contractAddresses.native[chainId]

    if (isValidAddress(inputCurrency)) {
      addresses += `,${inputCurrency}`
    }
    if (isValidAddress(outputCurrency)) {
      addresses += `,${outputCurrency}`
    }

    const initialTokens = await fetchTokenList(apiPath, {
      skip: 0,
      take: 10,
      addresses,
    }).then((res) => res.tokens)

    // init amount
    if (config.inputAmount) {
      onInput(config.inputAmount, 0)
    }
    if (config.outputAmount) {
      onInput(config.outputAmount, 1)
    }

    // init mode
    if (!config.selectable) {
      focusOnField(config.inputTokenAddress ? 0 : 1)
    }
    if (config.swapType === 'outputOnly') {
      focusOnField(1)
    }

    // init currency
    if (inputCurrency || outputCurrency) {
      for (const token of initialTokens) {
        if (isSameAddress(token.address, inputCurrency)) {
          selectToken(0, token)

          if (!outputCurrency) {
            break
          }
        }
        if (isSameAddress(token.address, outputCurrency)) {
          selectToken(1, token)

          if (!inputCurrency) {
            break
          }
        }
      }

      return
    }

    const token = (initialTokens ?? [])[0]
    if (token) selectToken(0, token)
  }, [apiPath, chainId, contractAddresses, config])
  useEffect(() => {
    initSwapConfig().finally()

    return () => {
      clearState()
    }
  }, [])

  // about select token
  const onSelectToken = useCallback(
    (idx: number, token: ITokenItem) => {
      selectToken(idx, token)

      // output token 을 input 으로 선택 시 자동 변환
      if (
        idx === 0 &&
        isSameAddress(outputToken?.address ?? '', token.address)
      ) {
        selectToken(1, {} as ITokenItem)
      }

      // input token 을 output 으로 선택 시 자동 변환
      if (
        idx === 1 &&
        isSameAddress(inputToken?.address ?? '', token.address)
      ) {
        selectToken(0, {} as ITokenItem)
      }

      setError('', { token0: false, token1: false })

      if (
        (idx === 0 && Number(outputValue) > 0) ||
        (idx === 1 && Number(inputValue) > 0)
      ) {
        setRouteId(routeId + 1)
      }
    },
    [inputToken, outputToken, inputValue, outputValue, routeId],
  )
  const { onSwitch } = useSwitchToken({
    inputToken,
    outputToken,
    inputValue,
    outputValue,
    selectToken,
    onInput,
    typedField,
    isMaxInput,
    nativeAddress,
    balances,
    isFetching,
  })

  // tx modal
  const [show, setShowTx, portal, close] = useModal()

  const nativeBalance = useMemo(() => {
    return balances[nativeAddress] ?? 0n
  }, [nativeAddress, balances])
  const { swapCall } = useSwapCall({
    account: account as `0x${string}`,
    chainId,
    slippage,
    inputToken,
    inputValue,
    outputToken,
    outputValue,
    isPos: typedField === 0,
    routes,
  })
  const { broadcast, hash, isLoading } = useSendTx({
    tx: {
      to: swapCall.to as `0x${string}`,
      value: BigInt(swapCall.value),
      data: swapCall.data as `0x${string}`,
    },
    action: 'swap',
    balance: nativeBalance,
    chainId,
    methodInterface: swapCall.methodInterface as Abi | undefined,
    methodArgs: swapCall.args,
    onSuccess: () => {
      close()
      clearInput()
      setPriceHandler({ show: false, callback: () => {} })
    },
  })

  const validateTokenSelect = useCallback(
    (inputToken: ITokenItem, outputToken: ITokenItem) => {
      if (!inputToken.address || !outputToken.address) {
        const fields: Record<string, boolean> = {}

        if (!inputToken.address) {
          fields.token0 = true
        }

        if (!outputToken.address) {
          fields.token1 = true
        }

        setError(t('General.TokenNotSelected'), fields)
        return false
      }

      return true
    },
    [],
  )

  const confirmParams = useMemo(() => {
    const fixedAmount =
      typedField === 0
        ? mulBN(outputValue || 0, (100 - slippage) / 100)
        : mulBN(inputValue || 0, (100 + slippage) / 100)

    return {
      event: 'swap',
      isMax: isMaxInput,
      nativeBalance,
      eventData: [
        {
          title: t('General.From'),
          childNode: (
            <Text size={18} color="black">
              {dprec(inputValue, 6)} {inputToken.symbol}
            </Text>
          ),
        },
        {
          title: t('General.To'),
          childNode: (
            <Text size={18} color="black">
              {dprec(outputValue, 6)} {outputToken.symbol}
            </Text>
          ),
        },
      ],
      estimateData: [
        {
          title: t('General.ExchangeRate'),
          childNode: (
            <div>
              <ExchangeRate
                tokenA={inputToken}
                tokenB={outputToken}
                rate={divBN(outputValue, inputValue)}
                type={1}
                version={3}
              />
            </div>
          ),
        },
        {
          title:
            typedField === 0
              ? t('General.MinOutputOfSwap')
              : t('General.MaxInputOfSwap'),
          value: `${dprec(fixedAmount, 6)} ${
            typedField === 0 ? outputToken.symbol : inputToken.symbol
          }`,
        },
        {
          title: t('General.DiffFromCurrentRate'),
          value: `${dprec(priceImpact, 2)} %`
        },
      ],
      approvals:
        inputToken.address === nativeAddress || !inputToken.address
          ? undefined
          : {
            ids: [inputToken.address],
            symbols: [inputToken.symbol],
            amounts: [BigInt(toWritableUnit(mulBN(inputValue || '0', typedField === 0 ? 1 : (100 + slippage) / 100), inputToken.decimal))],
            spender: swapCall.to,
            nativeBalance,
          },
      submitText: t('General.DoSwap'),
      isLoading,
      priceHandler: {
        show: priceHandler.show,
        callback: priceHandler.callback,
      },
    }
  }, [
    nativeAddress,
    nativeBalance,
    inputToken,
    inputValue,
    outputToken,
    outputValue,
    isMaxInput,
    swapCall,
    isLoading,
    typedField,
    slippage,
    routes,
    priceImpact,
    priceHandler,
  ])

  const isProgressCall = useMemo(() => {
    return isLoading || isFetching || delayed
  }, [isLoading, isFetching, delayed])

  const { confirmBroadcast, txPolicyModal, aboutPriceImpactModal } =
    useTxPolicy({
      policy: locale === 'ko' ? 'SwapFinal' : 'en_SwapFinal',
      onSubmit: () => setTimeout(setShowTx, 100),
      onNextStep: () => confirmBroadcast(),
    })
  const onSubmitSwap = useCallback(() => {
    setError('', { token0: false, token1: false })

    if (isProgressCall) {
      return
    }

    if (!validateTokenSelect(inputToken, outputToken)) {
      return
    }

    // 수량 미입력. 빈 필드 핸들링
    if ((
      typedField === 0 && (!inputValue || parseFloat(inputValue) <= 0)
    ) || (
      typedField === 1 && (!outputValue || parseFloat(outputValue) <= 0)
    ) || (
      typedField === -1 && (!inputValue || parseFloat(inputValue) <= 0) && (!outputValue || parseFloat(outputValue) <= 0)
    )) {
      const fields: Record<string, boolean> = {}

      if (typedField === 0) fields.token0 = true
      if (typedField === 1) fields.token1 = true

      return setError(t('General.NeedValueToSubmit'), fields)
    }

    // 경로가 존재하는 지 체크
    if (routeId > 0 && !routes.best.path.length) {
      return setError(t('General.IsEmptyRoute'), {
        token0: false,
        token1: false,
      })
    }

    if (balances[nativeAddress] <= 0n) {
      return setError(t('General.InsufficientKlayBalance'), {})
    }

    // 보유 수량보다 많은 양 입력 시
    if (
      parseFloat(inputValue) >
      parseFloat(
        toReadableBN(
          balances[inputToken.address],
          inputToken.decimal,
          inputToken.decimal,
        ),
      )
    ) {
      return setError(t('General.InsufficientBalance'), { token0: true })
    }

    /*
    confirmBroadcast(
      Number(priceImpact) >= 5
        ? {
          token0: inputToken,
          token1: outputToken,
          assetType: 1,
          pool: {
            token0BasePrice: routes.best?.fromBasePrice,
            token1BasePrice: routes.best?.toBasePrice,
          },
          rate: divBN(outputValue, inputValue),
          value: priceImpact,
        }
        : undefined,
    )
    */

    setTimeout(setShowTx, 100)
  }, [
    isProgressCall,
    account,
    inputToken,
    outputToken,
    inputValue,
    outputValue,
    broadcast,
    balances,
    nativeAddress,
    routeId,
    routes,
    priceImpact,
  ])

  const submitText = useMemo(() => {
    return t('General.SwapMenuSubmit')
  }, [])
  const {
    handleSubmit,
    disableSubmitUi
  } = useFormSubmit({
    text: submitText,
    error,
    loading: isProgressCall,
    onSubmit: onSubmitSwap
  })

  const [hovered, setHovered] = useState<boolean>(false)

  const visibleInput = useMemo(() => {
    return {
      token0: config.swapType !== 'outputOnly' && (config.selectable || typedField === 0),
      token1: config.swapType !== 'inputOnly' && (config.selectable || typedField === 1)
    }
  }, [config, typedField])

  return (
    <>
      <SwapConfigArea>
        <SlippageSetting />
        <div style={{ margin: '0 10px 0 auto' }}>
          <Text size={12} color="gray">{t('General.RecentUpdatedAt')} : {DateTime.fromMillis(updatedAt).toFormat('HH:mm:ss')}</Text>
        </div>
        <RefreshRouteButton onClick={fetchRoute}>
          <Image src={RefreshIcon} alt="refresh" className={isFetching ? 'fetching' : ''} />
        </RefreshRouteButton>
      </SwapConfigArea>
      
      <StyledSwapForm>
        {visibleInput.token0 && (
          <FormRow
            idx={0}
            type="swap"
            inputValue={inputValue}
            token={inputToken as ITokenItem}
            title="From"
            balance={balances[inputToken?.address ?? ''] ?? 0n}
            hasError={error.fields.token0}
            selectable={!!config.selectable}
            onInput={onInput}
            onFocus={onFocus}
            isMax={isMaxInput}
            onMax={onSelectMax}
            onSelect={onSelectToken}
          />
        )}
        {(config.swapType === 'normal' && config.selectable) && (
          <FormDivider onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div onClick={onSwitch} style={{ cursor: 'pointer' }}>
              <Image src={(hovered ? ConvertHoveredIcon : ConvertDefaultIcon) as string} alt="plus" />
            </div>
          </FormDivider>
        )}
        {visibleInput.token1 && (
          <FormRow
            idx={1}
            type="swap"
            inputValue={outputValue}
            token={outputToken as ITokenItem}
            title="To"
            balance={balances[outputToken?.address ?? ''] ?? 0n}
            hasError={error.fields.token1}
            selectable={!!config.selectable}
            onInput={onInput}
            onFocus={onFocus}
            isMax={isMaxInput}
            onMax={onSelectMax}
            onSelect={onSelectToken}
            hideMax={true}
          />
        )}

        {!config.selectable && (
          <SwapInputOption
            token={typedField === 0 ? inputToken : outputToken}
            balance={balances[(typedField === 0 ? inputToken : outputToken)?.address ?? ''] ?? 0n}
            typedField={typedField}
            onSelect={onInput}
          />
        )}

        <SwapEstimated />

        {error.message && <FormError><Text color="red">{error.message}</Text></FormError>}

        <FormSubmit type={isProgressCall ? 'pending' : disableSubmitUi || error.message ? 'gray2' : (typedField === 0 ? 'red' : 'blue')} onClick={handleSubmit}>
          <Text size={16} weight={700}>{submitText}</Text>
          {isProgressCall && <Image sx={{ width: '28px', height: '28px' }} src={ProgressIcon as string} alt="progress"/>}
        </FormSubmit>

        {show && portal
          ? createPortal(
            (
              <TxConfirmModal
                {...confirmParams}
                onSubmit={broadcast}
                onClose={close}
              />
            ) as any,
            portal,
          )
          : null}

        {txPolicyModal}
        {aboutPriceImpactModal}
      </StyledSwapForm>
    </>
  )
}