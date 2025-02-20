import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { walletConnect } from '@wagmi/connectors'
import { createConfig, WagmiConfig } from 'wagmi'

import { uiWrapper as UiWrapper } from '@/__mock__/mockUiWrapper'
import { silicon } from '@/constants/chain'

const queryClient = new QueryClient()
// @ts-ignore
const config = createConfig({
  chains: [silicon],
  connectors: [
    walletConnect({
      projectId: import.meta.env.VITE_WALLETCONNECT_KEY as string
    })
  ]
})

export const wagmiWrapper = ({ children }: any) => {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiConfig>
  )
}

export const completeWrapper = ({ children }: any) => {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <UiWrapper>{children}</UiWrapper>
      </QueryClientProvider>
    </WagmiConfig>
  )
}
