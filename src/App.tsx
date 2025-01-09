import { SwapBox } from '@/components/SwapBox'

import RootProvider from '@/context/RootProvider'
import { SwapWidgetProps } from '@/types/index.d.ts'

import '@/styles/globals.css'
import 'react-tooltip/dist/react-tooltip.css'

function App(props: SwapWidgetProps) {
  return (
    <section id="widget-root">
      <RootProvider config={props}>
        <SwapBox />
      </RootProvider>
    </section>
  )
}

export default App
