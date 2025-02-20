import { ReactNode, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { PlacesType, Tooltip as ReactTooltip } from 'react-tooltip'

import ReactDOMServer from 'react-dom/server'
import styled from 'styled-components'

import useModal from '@/hooks/useModal'

import './index.scss'

import { Image } from '@/components/Image'

import { TooltipModal } from '@/modal/TooltipModal'

import QuestionIcon from '@/assets/img/icon/ic-question.svg'
import { useIsMobile } from '@/hooks/ui/useIsMobile'

interface IProps {
  tooltipId: string
  content:
    | string
    | { article: { title: string; value: string }[]; notice: string[] }
  spacing?: number
  showIcon?: boolean
  children?: ReactNode
  place?: PlacesType
}

const StyledTooltipWrapper = styled('span')`
  margin-left: 7px;
  
  .react-tooltip {
    >span {
      opacity: 1;
      font-weight: normal;
    }
  }
`

export function CommonTooltip({
  tooltipId,
  content,
  showIcon = true,
  children,
  place
}: IProps) {
  const styles = useMemo(() => {
    return {
      maxWidth: '270px',
      height: 'auto',
      padding: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: '3px',
      transition: '0.15s cubic-bezier(0, 0, 0.2, 1)',
      transitionProperty: 'opacity, transform',
      willChange: 'opacity, transform, top, left !important',
      color: '#fff',
      fontSize: '1rem',
      fontWeight: 300,
      zIndex: 20
    }
  }, [])
  const contentView = useMemo(() => {
    if (typeof content === 'string') {
      return content
    }

    if (
      typeof content === 'object' &&
      ('article' in content || 'notice' in content)
    ) {
      const markup = (
        <div>
          <ul className="common-tooltip__content">
            {content.article.map((text, i) => {
              return (
                <li key={i} style={{ marginBottom: '10px', fontSize: '12px' }}>
                  <h6 style={{ fontWeight: 700, marginBottom: '5px' }}>
                    {i + 1}. {text.title}
                  </h6>
                  <p>- {text.value}</p>
                </li>
              )
            })}
          </ul>

          <ul className="common-tooltip__notice">
            {content.notice.map((text, i) => {
              return (
                <li key={i} style={{ marginBottom: '10px', fontSize: '12px' }}>
                  <span>* {text}</span>
                </li>
              )
            })}
          </ul>
        </div>
      ) as any

      return ReactDOMServer.renderToStaticMarkup(markup)
    }

    return ''
  }, [content])

  const isMobile = useIsMobile()
  const [show, setShow, portal, close] = useModal()
  const onClickTooltip = useCallback(() => {
    if (!isMobile) {
      return
    }

    setShow()
  }, [isMobile])

  return (
    <>
      <StyledTooltipWrapper
        className="common-tooltip-wrapper"
        onClick={() => onClickTooltip()}
        data-tooltip-id={tooltipId}
        data-tooltip-html={contentView}
        data-tooltip-hidden={isMobile}
        data-tooltip-place={place ?? 'top'}
      >
        {children ? children : null}
        {showIcon && (
          <Image
            src={QuestionIcon}
            alt="tooltip"
            sx={{ cursor: 'pointer' }}
            type="vector"
          />
        )}
        <ReactTooltip
          id={tooltipId}
          content={contentView}
          style={styles}
          noArrow={true}
        />
      </StyledTooltipWrapper>

      {show && portal
        ? createPortal(
            (<TooltipModal content={contentView} onClose={close} />) as any,
            portal
          )
        : null}
    </>
  )
}
