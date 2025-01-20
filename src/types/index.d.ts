import { Chain } from 'viem'

declare type SwapType = 'normal' | 'inputOnly' | 'outputOnly'

declare type SwapWidgetProps = {
  chainId?: Chain['id']
  inputTokenAddress?: `0x${string}`
  inputAmount?: string
  outputTokenAddress?: `0x${string}`
  outputAmount?: string
  theme?: {
    light: { [p:string]: string },
    dark: { [p:string]: string }
  }
  selectable?: boolean
  apiUrl?: {
    [p: number]: string
  }
  supportChains?: Chain['id'][],
  operatorUrl?: string,
  wcApiKey?: string,
  swapType: SwapType
}

declare type SwapWidget = (props: SwapWidgetProps) => JSX.Element

export { SwapWidget as default, SwapWidgetProps, SwapType }