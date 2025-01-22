import { Chain } from 'viem'
import { State } from 'wagmi'

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
  supportChains?: Chain[]
  operatorUrl?: string
  wcApiKey?: string
  state?: State
  importState?: (state: State) => void
  swapType: SwapType
}

declare type SwapWidget = (props: SwapWidgetProps) => JSX.Element

export { SwapWidget as default, SwapWidgetProps, SwapType }