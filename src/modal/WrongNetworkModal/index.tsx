import { useCallback, useMemo } from 'react'

import styled from 'styled-components'
import { useAccount } from 'wagmi'

import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'

import { Image } from '@/components/Image'

import { ModalClose } from '@/modal/ModalClose'
import { ModalWrapper } from '@/modal/ModalWrapper'

import { Paragraph, SubmitButton, Text } from '@/styles/common'
import { device } from '@/styles/createBreakPoints'
import { StyledModal, StyledModalTitle } from '@/styles/modal'

import ErrorIcon from '@/assets/img/icon/ic-error-red.svg'
import { silicon } from '@/constants/chain'
import { useEnvContext } from '@/context/EnvProvider'
import { useConnectWallet } from '@/hooks/wallet/useConnectWallet'

interface IProps {
  onClose: () => void
}

export function WrongNetworkModal({ onClose }: IProps) {
  const { t } = useTranslationSimplify()
  const env = useEnvContext()

  const { connector } = useAccount()
  const allowSwitchChain = useMemo(() => {
    return ['metaMask', 'walletConnect'].includes(connector?.id ?? '')
  }, [connector])

  const { disconnect } = useConnectWallet()
  const onChangeNetwork = useCallback( () => {
    if (!connector) {
      return
    }

    onClose()

    if (!allowSwitchChain) {
      disconnect()
      return
    }

    // @ts-ignore
    connector.getProvider().then(provider => {
      provider.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: silicon.id,
          chainName: silicon.name,
          nativeCurrency: silicon.nativeCurrency,
          rpcUrls: silicon.rpcUrls.public.http,
          blockExplorerUrls: [silicon.blockExplorers?.default.url],
          iconUrls: []
        }]
      })
    })
  }, [connector, allowSwitchChain, onClose])

  return (
    <ModalWrapper customStyle={{
      background: 'rgba(0, 0, 0, 0.2)'
    }}>
      <StyledWrongNetworkModal>
        <ModalClose onClose={onClose} />
        <StyledModalTitle>{t('Asset.DoChangeNetwork')}</StyledModalTitle>

        <WrongNetworkNotice>
          <Image src={ErrorIcon} alt="error" />
          <Paragraph color="primaryActive" weight={700}>{t('Asset.AboutWrongNetworkNotice1')}</Paragraph>
          <Paragraph color="gray" className="mt-[15px]" dangerouslySetInnerHTML={{ __html: t('Asset.AboutWrongNetworkNotice2') }} />
        </WrongNetworkNotice>

        <WrongNetworkAction type="bodyBackground" onClick={() => onChangeNetwork()}>
          <Text size={14} color="secondary" weight={700}>{allowSwitchChain ? t('Asset.DoChangeNetwork') : t('Asset.DoRetryConnectWallet')}</Text>
        </WrongNetworkAction>
      </StyledWrongNetworkModal>
    </ModalWrapper>
  )
}

const StyledWrongNetworkModal = styled(StyledModal)`
  min-height: auto;
  padding-bottom: 30px;
  
  @media ${device.md} {
    min-height: auto;
  }
`

const WrongNetworkNotice = styled('div')`
  margin-top: 20px;
  text-align: center;
  
  img {
    width: 32px;
    height: 32px;
    margin-bottom: 10px;
  }
`

const WrongNetworkAction = styled(SubmitButton)`
  width: 100%;
  height: 60px;
  margin-top: 32px;
`