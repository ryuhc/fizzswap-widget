import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ToastContainer } from 'react-toastify'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { usePrevious } from '@uidotdev/usehooks'
import { injected, walletConnect } from '@wagmi/connectors'
import { createClient, http } from 'viem'
import { createConfig, WagmiConfig } from 'wagmi'

import { AlertContainer } from '@/components/AlertContainer'

import type { SwapWidgetProps } from '@/types/index.d.ts'

import { silicon, siliconSepolia } from '@/constants/chain'
import ConfigProvider from '@/context/ConfigProvider'
import EnvProvider from '@/context/EnvProvider'
import GlobalHooksProvider from '@/context/GlobalHooksProvider'
import StyleProvider from '@/context/StyleProvider'
import WalletActionProvider from '@/context/WalletActionProvider'

import 'react-toastify/dist/ReactToastify.css'
import '@/styles/toast.scss'

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

interface IProps {
  config: SwapWidgetProps
  children: React.ReactNode
}

export const rootQueryClient = new QueryClient()

const PROFILE = import.meta.env.VITE_PROFILE ?? 'dev'

export default function RootProvider(props: IProps) {
  const { children } = props
  const [wagmiConfig, setWagmiConfig] = useState<any>(null)

  const supportChains = useMemo(() => {
    return props.config?.supportChains ?? (PROFILE === 'dev' ? [silicon, siliconSepolia] : [silicon])
  }, [props.config])
  useEffect(() => {
    const projectId = props.config?.wcApiKey ?? import.meta.env.VITE_WALLETCONNECT_KEY ?? ''
    const metadata =  {
      name: 'Fizzswap',
      description: 'Fizzswap extends the Silicon DeFi ecosystem through liquidity pool-based ETH, WBTC, USDT instant token swapping and liquidity mining.',
      url: 'https://fizzswap.io',
      icons: ['https://fizzswap.io/logo/logo.svg']
    }

    const teleport = (args: any) => {
      return Object.assign(walletConnect({
        projectId,
        metadata,
        showQrModal: false,
        customStoragePrefix: 'teleport',
        name: 'Teleport'
      })(args), {
        id: 'teleport'
      })
    }

    const wagmiConfig = createConfig({
      chains: supportChains,
      client({ chain }) {
        return createClient({ chain, transport: http() })
      },
      connectors: [
        injected({ target: 'metaMask' }),
        walletConnect({
          projectId,
          metadata
        }),
        teleport
      ]
    })

    setWagmiConfig(wagmiConfig)
  }, [supportChains])

  const env = useMemo(() => {
    return {
      PROFILE,
      DEFAULT_CHAIN: Number(props.config?.chainId ?? import.meta.env.VITE_DEFAULT_CHAIN),
      API_PATH_2355: (props.config?.apiUrl ?? {})['2355'] ?? import.meta.env.VITE_API_2355,
      API_PATH_1722641160: (props.config?.apiUrl ?? {})['1722641160'] ?? import.meta.env.VITE_API_1722641160,
      OPERATOR_PATH: props.config?.operatorUrl ?? import.meta.env.VITE_OPERATOR_PATH,
      TELEPORT_PATH: import.meta.env.VITE_TELEPORT_PATH,
      SUPPORT_CHAINS: supportChains
    }
  }, [props.config, supportChains])

  // (optional) import wagmi state from parent
  useEffect(() => {
    if (wagmiConfig && props.config.state) {
      wagmiConfig.setState(props.config.state)
    }
  }, [wagmiConfig, props.config.state])

  // (optional) import language from parent
  const { i18n } = useTranslation()
  const prevLang = usePrevious(props.config.language)
  useEffect(() => {
    if (props.config.language && prevLang !== props.config.language) {
      i18n.changeLanguage(props.config.language).finally()
    }
  }, [props.config.language, prevLang])

  return wagmiConfig && (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={rootQueryClient}>
        <EnvProvider env={env}>
          <ConfigProvider config={props.config}>
            <GlobalHooksProvider />
            <StyleProvider theme={props.config.theme}>
              <AlertContainer/>
              <WalletActionProvider/>
              <ToastContainer autoClose={5000} closeButton={false}/>

              {children}

              <div id="modal-overlay" />
            </StyleProvider>
          </ConfigProvider>
        </EnvProvider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}