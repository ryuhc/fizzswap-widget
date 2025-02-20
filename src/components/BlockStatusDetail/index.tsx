import { useMemo, MutableRefObject } from 'react'

import { useClickAway } from '@uidotdev/usehooks'
import styled from 'styled-components'
import { useChainId } from 'wagmi'

import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'

import { Image } from '@/components/Image'

import { NetworkHealth, useCommonStore } from '@/state/common'

import { HeadingSmall, Paragraph, Text } from '@/styles/common'
import { device } from '@/styles/createBreakPoints'

import LinkIcon from '@/assets/img/icon/ic-link-diagonal-gray.svg'
import {
  EXPLORER_URLS,
  silicon,
  siliconSepolia,
  SUPPORT_CHAIN_IDS
} from '@/constants/chain'

interface IProps {
  onClose: () => void
}

export function BlockStatusDetail({ onClose }: IProps) {
  const chainId = useChainId() as SUPPORT_CHAIN_IDS
  const chainName = useMemo(() => {
    return (
      {
        [silicon.id]: 'Silicon Network',
        [siliconSepolia.id]: 'Silicon Sepolia Network'
      }[chainId] ?? ''
    )
  }, [chainId])

  const { t } = useTranslationSimplify()
  const { currentBlock } = useCommonStore()
  const aboutStatus = useMemo(() => {
    return (
      {
        [NetworkHealth.health]: t('General.NodeStatusIsFine'),
        [NetworkHealth.latency]: t('General.NodeHasLatency'),
        [NetworkHealth.sick]: t('General.NodeHasError')
      }[currentBlock.status] ?? ''
    )
  }, [currentBlock.status])

  const detailRef = useClickAway(() => {
    onClose()
  })

  return (
    <StyledBlockStatusDetail ref={detailRef}>
      <BlockStatusDetailTitle>
        <HeadingSmall size={12} color="#b3b3b3">
          <Text weight={500}>{chainName}</Text>
        </HeadingSmall>
        <a
          href={EXPLORER_URLS[chainId]}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Text size={11} color="gray5">
            Silicon Scope
          </Text>
          <Image src={LinkIcon} alt="link" />
        </a>
      </BlockStatusDetailTitle>

      <BlockStatusDetailArticle data-status={String(currentBlock.status)}>
        <BlockStatusSymbolWrapper>
          <BlockStatusSymbol data-status={String(currentBlock.status)} />
        </BlockStatusSymbolWrapper>
        <Paragraph
          color="black2"
          dangerouslySetInnerHTML={{ __html: aboutStatus }}
        />
      </BlockStatusDetailArticle>

      <BlockStatusDetailAboutSync>
        <Text size={11} color="gray">
          {t('General.NoticeAboutNodeError')}
        </Text>
      </BlockStatusDetailAboutSync>

      <button onClick={() => onClose()}>
        <Text size={12} color="gray5">
          Close
        </Text>
      </button>
    </StyledBlockStatusDetail>
  )
}

const StyledBlockStatusDetail = styled('div')<{
  ref: MutableRefObject<Element>
}>`
  width: 320px;
  height: auto;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .1);
  padding: 20px 20px 0 20px;
  z-index: 10;
  
  @media ${device.sm} {
    width: 100%;
    max-width: 320px;
  }
  
  button {
    width: 100%;
    padding: 10px 0;
  }
`

const BlockStatusDetailTitle = styled('div')`
  display: flex;
  justify-content: space-between;
  
  a {
    display: block;
    margin-left: auto;
  }
  
  img {
    width: 8px;
    height: 8px;
    vertical-align: middle;
    margin-left: 3px;
  }
`

const BlockStatusDetailArticle = styled('article')`
  padding: 25px 0;
  
  &[data-status=health] {
    >p >span {
      color: ${({ theme }) => theme.colors.paleGreen};
    }
  }
  &[data-status=latency] {
    >p >span {
      color: #ff9632;
    }
  }
  &[data-status=sick] {
    >p >span {
      color: ${({ theme }) => theme.colors.red};
    }
  }
  
  p {
    text-align: center;
  }
`

const BlockStatusDetailAboutSync = styled('div')`
  padding: 10px 0;
  line-height: 1;
  border-top: 1px solid ${({ theme }) => theme.colors.gray2};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray2};
`

const BlockStatusSymbolWrapper = styled('div')`
  >div {
    width: 10px;
    height: 10px;
    margin: 0 auto 10px auto;
  }
`

export const BlockStatusSymbol = styled('div')`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  font-size: 7px;
  margin-top: 1px;
  position: relative;
  
  &[data-status=health] {
    animation: pulseHealth 2s ease-out infinite;
    background: ${({ theme }) => theme.colors.paleGreen};
  }
  &[data-status=latency] {
    animation: pulseLatency 2s ease-out infinite;
    background: #ff9632;
  }
  &[data-status=sick] {
    animation: pulseSick 2s ease-out infinite;
    background: ${({ theme }) => theme.colors.red};
  }
`
