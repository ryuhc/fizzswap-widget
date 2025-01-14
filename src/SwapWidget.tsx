import { SwapBox } from '@/components/SwapBox'

import type { SwapWidgetProps } from '@/types/index.d.ts'

import RootProvider from '@/context/RootProvider'

import '@/styles/globals.css'
import 'react-tooltip/dist/react-tooltip.css'

function SwapWidget(props: SwapWidgetProps) {
  return (
    <section id="widget-root">
      <RootProvider config={props}>
        <SwapBox />
      </RootProvider>
    </section>
  )
}

export default SwapWidget
