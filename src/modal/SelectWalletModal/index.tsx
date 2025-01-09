import { useCallback, useMemo, useState } from 'react'

import { dispatch } from 'use-bus'
import { BaseError } from 'viem'
import { useConnect } from 'wagmi'


import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'
import { fetchProviderId, isMobileOS } from '@/utils/common'

import { CircleProgress } from '@/components/CircleProgress'
import { Image } from '@/components/Image'

import { ModalClose } from '@/modal/ModalClose'
import { ModalWrapper } from '@/modal/ModalWrapper'

import { useCommonStore } from '@/state/common'

import { Text } from '@/styles/common'
import { StyledModalTitle } from '@/styles/modal'

import { DOCS_URL } from '@/constants/chain'
import { WALLET_CONNECTED } from '@/constants/events'
import { useEnvContext } from '@/context/EnvProvider'
import { useSupportChains } from '@/hooks/network/useSupportChains'
import { useConnectors } from '@/hooks/wallet/useConnectors'
import { getInstallURL, getWalletIcon, WALLET_NAMES } from '@/hooks/wallet/useWalletMetadata'
import {
  SelectWalletConnector,
  SelectWalletConnectorIcon,
  SelectWalletConnectors,
  SelectWalletErrorArea,
  SelectWalletErrorContent,
  SelectWalletErrorMessage,
  SelectWalletErrorTarget,
  SelectWalletRetryButton,
  StyledSelectWalletModal
} from '@/modal/SelectWalletModal/styles'

interface IProps {
  onShowRisk: () => void,
  onClose: () => void
}

const injectedProviders = ['metaMask']
const a2aProviders: any[] = ['teleport']
const backgroundColors: Record<string, string> = {
  metaMask: '#ffd3a2',
  walletConnect:'#ddebff',
  teleport: '#007AFF4D'
}

export function SelectWalletModal({ onShowRisk, onClose }: IProps) {
  const {t,i18n} = useTranslationSimplify()
  const { connectingWalletId, setConnectingWalletId } = useCommonStore()

  const [connectError, setConnectError] = useState<BaseError | null>(null)
  const errorMessage = useMemo(() => {
    if (!connectError) {
      return ''
    }

    if (connectError?.message === 'not_installed' || connectError?.name === 'ConnectorNotFoundError') {
      return t('General.WalletNotInstalled')
    }

    return connectError?.shortMessage ?? connectError?.message ?? 'Internal Error'
  }, [connectError])

  const supportChains = useSupportChains()
  const [selectedWallet, setSelectedWallet] = useState<any>(null)
  const {connectors, connect, isLoading} = useConnect({
    mutation: {
      onError: (error) => {
        setConnectError(error as BaseError)

        if (a2aProviders.includes(selectedWallet?.id)) {
          setSelectedWallet(null)
          setConnectingWalletId('')
        }
      },
      onSuccess: (provider) => {
        dispatch(WALLET_CONNECTED)

        setConnectingWalletId('')
        onClose()

        if (supportChains.find(item => item.id === provider.chainId)) {
          onShowRisk()
        }
      }
    }
  })

  const env = useEnvContext()
  const currentConnectors = useConnectors()
  const handleConnect = useCallback(async (id: string, connector: any) => {
    if (isLoading) {
      return
    }

    const _isMobileOS = isMobileOS()
    const provider = await connector.getProvider().catch(() => null)
    const notInstalled = !provider && injectedProviders.includes(id)

    if (_isMobileOS && notInstalled) {
      const slicedOrigin = window.origin.split('://')[1]
      const deepLinkParam = `${slicedOrigin}${window.location.pathname}`

      switch(fetchProviderId(connector)) {
        case 'metaMask': {
          window.open(`https://metamask.app.link/dapp/${deepLinkParam}?connect=metaMask`)
          break
        }
        default: {
          onClose()
          break
        }
      }

      setSelectedWallet(null)
      return
    }

    setConnectingWalletId(id)
    setSelectedWallet(connector)

    if (_isMobileOS && id === 'teleport') {
      const handleTeleportUri = (message: { type: string, data?: unknown }) => {
        if (message.type === 'display_uri') {
          connector.emitter.off('message', handleTeleportUri)
          window.open(`tg://resolve?domain=${env.TG_WALLET_BOT}&appname=wallet&startapp=${Buffer.from(JSON.stringify({"type":"auth","value":{"uri":message.data}})).toString('hex')}`)
        }
      }

      connector.emitter.on('message', handleTeleportUri)
    }

    if (_isMobileOS && id === 'korbit') {
      const handleKorbitUri = (message: { type: string, data?: unknown }) => {
        if (message.type === 'display_uri') {
          connector.emitter.off('message', handleKorbitUri)
          window.open(`korbit://web3?pairing=${message.data}`)
        }
      }

      connector.emitter.on('message', handleKorbitUri)
    }

    if (!_isMobileOS && notInstalled) {
      setConnectError(new BaseError('not_installed', { name: 'ConnectorNotFoundError' }))
      return
    }

    connect({ connector })
  }, [isLoading, connectors, env])
  const retryConnect = useCallback(() => {
    setConnectingWalletId('')
    setSelectedWallet(null)
    setConnectError(null)
  }, [])

  const isInstallError = useMemo(() => {
    return errorMessage === t('General.WalletNotInstalled')
  }, [errorMessage])

  const walletGuideLink = useMemo(() => {
    return `${DOCS_URL}${i18n.language === 'ko' ? '/v/ko-kr/get-started/undefined' : '/get-srarted/create-a-wallet'}`
  }, [i18n])

  return (
    <ModalWrapper>
      <StyledSelectWalletModal>
        <ModalClose onClose={onClose}/>
        <StyledModalTitle>{t('General.AccessWallet')}</StyledModalTitle>

        {!selectedWallet ? (
          <section>
            <SelectWalletConnectors style={{ marginTop: '40px' }}>
              {currentConnectors.map(connector => {
                const connectorId = fetchProviderId(connector) as string

                return (
                  <SelectWalletConnector
                    key={connectorId}
                    onClick={() => handleConnect(connectorId, connector)}
                    style={{ backgroundColor: backgroundColors[connectorId]}}
                  >
                    <SelectWalletConnectorIcon>
                      <Image src={getWalletIcon(connector)} alt={connectorId} type="vector" />
                    </SelectWalletConnectorIcon>
                    <Text size={16} weight={500}>{connectorId === 'teleport' ? t('General.NameTeleport') : (WALLET_NAMES[connectorId] ?? connector.name)}</Text>
                  </SelectWalletConnector>
                )
              })}
            </SelectWalletConnectors>

            <div style={{ marginTop: '25px' }}>
              <a href={walletGuideLink} target="_blank" rel="noopener noreferrer">
                <Text size={12} color="#007AFF">{t('General.GuideCreateWallet')}</Text>
              </a>
            </div>
          </section>
        ) : (
          <SelectWalletErrorArea>
            <SelectWalletErrorTarget>
              <SelectWalletErrorContent>
                <Image sx={{ height: errorMessage ? '32px' : '40px' }} src={getWalletIcon(selectedWallet)} alt={connectingWalletId} type="vector" />
              </SelectWalletErrorContent>
              <SelectWalletErrorContent style={{ marginTop: '20px' }}>
                {isInstallError ? (
                  <a href={getInstallURL(connectingWalletId)} target="_blank" rel="noreferrer noopener">
                    <Text size={12} color="primaryActive">{t('General.InstallKaikasInHere')}</Text>
                  </a>
                ) : errorMessage ? null : (
                  <div>
                    <div style={{ marginBottom: '10px' }}>
                      <CircleProgress size={20} />
                    </div>
                    <Text size={12} color="primaryActive">{connectingWalletId === 'teleport' ? t('General.NameTeleport') : (WALLET_NAMES[connectingWalletId] ?? selectedWallet.name)}</Text>
                  </div>
                )}
              </SelectWalletErrorContent>
            </SelectWalletErrorTarget>
            {connectError && (
              <>
                <SelectWalletErrorMessage>
                  <Text size={12} color="black2">{errorMessage}</Text>
                </SelectWalletErrorMessage>
                <SelectWalletRetryButton onClick={() => retryConnect()}>
                  <Text size={16} weight={500}>{t('General.ResetWalletSelect')}</Text>
                </SelectWalletRetryButton>
              </>
            )}
          </SelectWalletErrorArea>
        )}
      </StyledSelectWalletModal>
    </ModalWrapper>
  )
}