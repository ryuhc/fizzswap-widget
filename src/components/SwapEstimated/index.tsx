import { useMemo } from 'react'

import { map } from 'lodash'

import { useFetchRoutes } from '@/hooks/useFetchRoutes'
import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'
import { divBN, dprec, mulBN, toWritableUnit } from '@/utils/number'

import { EstimateAboutTx } from '@/components/EstimateAboutTx'
import { SwapPath } from '@/components/SwapPath'

import { useCommonStore } from '@/state/common'
import { useSwapState } from '@/state/swap'

import { Paragraph, Text } from '@/styles/common'

import { EstimateAboutTxItem, EstimateAboutTxItems, EstimateAboutTxItemTitle, EstimateAboutTxItemValue } from '@/components/EstimateAboutTx/styles'
import { useConfigContext } from '@/context/ConfigProvider'
import { ITokenItem } from '@/hooks/queries/useTokenList'

export function SwapEstimated() {
  const { t } = useTranslationSimplify()
  const { slippage } = useCommonStore()
  const { inputToken, outputToken, typedField, inputValue, outputValue, priceImpact, updateValue, setPriceImpact } = useSwapState()

  // TODO : util
  const aboutFixedAmount = useMemo(() => {
    return {
      title: t('Widget.MinAmount'),
      tooltip: typedField === 0 ? t('General.MinOutputNotice', {
        slippage: slippage
      }) : t('General.MaxInputNotice', {
        slippage: slippage
      }),
      token: typedField === 0 ? outputToken : inputToken,
      value: typedField === 0 ? mulBN(outputValue || 0, (100 - slippage) / 100) : mulBN(inputValue || 0,(100 + slippage) / 100)
    }
  }, [inputToken, outputToken, typedField, inputValue, outputValue, slippage])

  const isSelected = useMemo(() => {
    return !!inputToken.address && !!outputToken.address && (Number(inputValue) > 0 || Number(outputValue) > 0)
  }, [inputToken, outputToken, inputValue, outputValue])

  const rateInfo = useMemo(() => {
    return {
      tokenA: inputToken,
      tokenB: outputToken,
      rate: divBN(outputValue, inputValue)
    }
  }, [inputToken, outputToken, inputValue, outputValue])

  const { data: routes } = useFetchRoutes({
    inputToken,
    outputToken,
    amount: typedField === 0 ? toWritableUnit(inputValue, inputToken.decimal) : toWritableUnit(outputValue, outputToken.decimal),
    isPos: typedField === 0,
    updateValue,
    setPriceImpact
  })
  const usedTokens: ITokenItem[] = useMemo(() => {
    if (routes.best.path.length === 0) {
      return []
    }

    const toTokens = map(routes.best.path, ({ toToken }) => toToken)

    return [routes.best.path[0].fromToken, ...toTokens]
  }, [routes.best])

  const showPriceImpaction = useMemo(() => {
    return routes.best.path.length > 0
  }, [routes])

  const config = useConfigContext()

  const piColor = useMemo(() => {
    if (priceImpact < 5) {
      return 'paleGreen'
    } else if (priceImpact >= 5 && priceImpact < 10) {
      return 'tertiary'
    }

    return 'red'
  }, [priceImpact])

  return (
    <EstimateAboutTx
      version={3}
      showTitle={false}
      slippage={slippage}
      rateInfo={rateInfo}
      priceImpact={priceImpact}
      showPriceImpaction={showPriceImpaction}
      defaultReverse={typedField === 1}
    >
      <EstimateAboutTxItems>
        <EstimateAboutTxItem>
          <EstimateAboutTxItemTitle>
            <Text>
              {t('Widget.EstimatedAmount')}
            </Text>
          </EstimateAboutTxItemTitle>
          <EstimateAboutTxItemValue>
            {isSelected ? (
              <div>
                <Paragraph data-testid="estimated-swap-amount">
                  {dprec(typedField === 0 ? inputValue : outputValue, 6)} {aboutFixedAmount.token?.symbol}
                </Paragraph>
              </div>
            ) : <Text>-</Text>}
          </EstimateAboutTxItemValue>
        </EstimateAboutTxItem>
        <EstimateAboutTxItem>
          <EstimateAboutTxItemTitle>
            <Text data-testid="estimated-swap-title">
              {aboutFixedAmount.title}
            </Text>
          </EstimateAboutTxItemTitle>
          <EstimateAboutTxItemValue>
            {isSelected ? (
              <div>
                <Paragraph data-testid="estimated-swap-amount">
                  {dprec(aboutFixedAmount.value, 6)} {aboutFixedAmount.token?.symbol}
                </Paragraph>
              </div>
            ) : <Text>-</Text>}
          </EstimateAboutTxItemValue>
        </EstimateAboutTxItem>
        <EstimateAboutTxItem>
          <EstimateAboutTxItemTitle>
            <Text>{t('Widget.PriceImpact')}</Text>
          </EstimateAboutTxItemTitle>
          <EstimateAboutTxItemValue>
            {isSelected ? <Text color={piColor} weight={700}>{dprec(priceImpact, 2)} %</Text> : <Text>-</Text>}
          </EstimateAboutTxItemValue>
        </EstimateAboutTxItem>
        {/*
        <EstimateAboutTxItem>
          <EstimateAboutTxItemTitle>
            <Text>{t('General.Fee')}</Text>
            <CommonTooltip tooltipId="aboutFee" content={t('Gov.AboutSwapFeeWithParam')} />
          </EstimateAboutTxItemTitle>
          <EstimateAboutTxItemValue style={{ display: 'block' }}>
            {isSelected ? (
              <>
                <Paragraph data-testid="estimated-swap-fee">{toReadableBN(routes.fee, inputToken.decimal, 6, true)} {inputToken.symbol}</Paragraph>
                {routes.best.path.map(path => {
                  return (
                    <Paragraph size={11} color="gray" key={path.address}>
                      {path.fromToken.symbol} {' > '} {path.toToken.symbol} ({path.fee}%) {path.type.toUpperCase()}
                    </Paragraph>
                  )
                })}
              </>
            ) : '-'}
          </EstimateAboutTxItemValue>
        </EstimateAboutTxItem>
        */}
        {config.selectable && (
          <EstimateAboutTxItem>
            <EstimateAboutTxItemTitle>
              <Text>{t('General.SwapRoute')}</Text>
            </EstimateAboutTxItemTitle>
            <EstimateAboutTxItemValue>
              <SwapPath isSelected={isSelected} routes={usedTokens} />
            </EstimateAboutTxItemValue>
          </EstimateAboutTxItem>
        )}
      </EstimateAboutTxItems>
    </EstimateAboutTx>
  )
}