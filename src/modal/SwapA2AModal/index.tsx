import { QRCodeSVG } from 'qrcode.react'

import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'

import { Image } from '@/components/Image'

import { ModalClose } from '@/modal/ModalClose'
import { ModalWrapper } from '@/modal/ModalWrapper'

import { Paragraph, Text } from '@/styles/common'
import { StyledModalTitle } from '@/styles/modal'

import KakaoIcon from '@/assets/img/icon/ic-kakaotalk-scan.svg'
import PointerIcon from '@/assets/img/icon/ic-pointer-right-bk.svg'
import ScanIcon from '@/assets/img/icon/ic-scan-primary.svg'
import { useA2AModalActions } from '@/hooks/wallet/useA2AModalActions'
import { getWalletIcon } from '@/hooks/wallet/useWalletMetadata'
import {
  SwapA2AActionFlow,
  SwapA2AActionFlowText,
  SwapA2AQr,
  SwapA2AQrNotice,
  SwapA2AQrTimer,
  SwapA2AQrWrapper,
  SwapA2AActionFlowIcon,
  SwapA2AQrWarning,
  StyledSwapA2AModal
} from '@/modal/SwapA2AModal/styles'

interface IProps {
  requestKey: string
  onClose: () => void
  connectorId: string
  connectorName: string
}

export function SwapA2AModal({
  requestKey,
  onClose,
  connectorId,
  connectorName
}: IProps) {
  const { t } = useTranslationSimplify()
  const { remain } = useA2AModalActions({ onClose })

  return (
    <ModalWrapper>
      <StyledSwapA2AModal>
        <ModalClose onClose={onClose} />
        <StyledModalTitle style={{ marginTop: '30px', textAlign: 'center' }}>
          <Text size={16} weight={700}>
            {t('General.ConnectWalletQRTitle', { walletname: connectorName })}
          </Text>
        </StyledModalTitle>

        <SwapA2AQrWrapper>
          <SwapA2AQr>
            <QRCodeSVG size={175} value={requestKey} />
          </SwapA2AQr>
          <SwapA2AQrTimer>
            <Text
              size={12}
              color="gray"
              dangerouslySetInnerHTML={{
                __html: t('General.RemainMinute')
                  .replace('{{minute}}', remain.minutes)
                  .replace('{{second}}', remain.seconds)
              }}
            />
          </SwapA2AQrTimer>
          <SwapA2AQrWarning>
            <Text size={12} color="black2">
              {t('General.QrDesc1')}
            </Text>
          </SwapA2AQrWarning>
          {connectorId === 'teleport' && (
            <Paragraph style={{ marginTop: '20px' }}>
              <a
                href={requestKey}
                target="_blank"
                style={{
                  textDecoration: 'underline',
                  textDecorationColor: '#007AFF'
                }}
              >
                <Text size={14} weight={500} color="#007AFF">
                  {t('General.QrDesc2')}
                </Text>
              </a>
            </Paragraph>
          )}
        </SwapA2AQrWrapper>

        {connectorId === 'teleport' ? (
          <SwapA2AQrNotice>
            <SwapA2AActionFlow style={{ justifyContent: 'space-evenly' }}>
              <SwapA2AActionFlowIcon>
                <Image type="vector" loading="lazy" src={ScanIcon} alt="scan" />
                <SwapA2AActionFlowText className="Swap-with-qr-modal__notice__flow__text">
                  <Text size={12} weight={700}>
                    {t('Asset.AccessToSwapFlow3')}
                  </Text>
                </SwapA2AActionFlowText>
              </SwapA2AActionFlowIcon>
            </SwapA2AActionFlow>
          </SwapA2AQrNotice>
        ) : (
          <SwapA2AQrNotice>
            <SwapA2AActionFlow style={{ justifyContent: 'space-evenly' }}>
              <SwapA2AActionFlowIcon>
                <Image
                  type="vector"
                  loading="lazy"
                  src={getWalletIcon({ id: connectorId, name: connectorName })}
                  alt={`${connectorId} step1`}
                  sx={{ width: '34px' }}
                />
                <SwapA2AActionFlowText className="Swap-with-qr-modal__notice__flow__text">
                  <Text size={12} weight={700}>
                    {t('General.ConnecWalletQRGuide1', {
                      walletname: connectorName
                    })}
                  </Text>
                </SwapA2AActionFlowText>
              </SwapA2AActionFlowIcon>
              <SwapA2AActionFlowIcon>
                <Image
                  type="vector"
                  loading="lazy"
                  src={PointerIcon}
                  alt="pointer"
                  sx={{ margin: '0 10px' }}
                />
              </SwapA2AActionFlowIcon>
              <SwapA2AActionFlowIcon>
                <Image
                  type="vector"
                  loading="lazy"
                  src={KakaoIcon}
                  alt={`${connectorId} step2`}
                />
                <SwapA2AActionFlowText className="Swap-with-qr-modal__notice__flow__text">
                  <Text size={12} weight={700}>
                    {t('Asset.AccessToSwapFlow3')}
                  </Text>
                </SwapA2AActionFlowText>
              </SwapA2AActionFlowIcon>
            </SwapA2AActionFlow>
          </SwapA2AQrNotice>
        )}
      </StyledSwapA2AModal>
    </ModalWrapper>
  )
}
