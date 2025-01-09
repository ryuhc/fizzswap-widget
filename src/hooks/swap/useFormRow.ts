import { useCallback, useMemo, useState } from 'react'

import useModal from '@/hooks/useModal'
import { dclean, dprec } from '@/utils/number'

import type { ITokenItem } from '@/hooks/queries/useTokenList'


interface IProps {
  inputValue: string,
  token: ITokenItem | null,
  showSelectIcon?: boolean
}

export function useFormRow({ inputValue, token, showSelectIcon }: IProps) {
  const origin = useMemo(() => window?.location?.origin, [])
  const inputValueView = useMemo(() => {
    const divideByDot = inputValue.split('.')

    if (inputValue === '0' || inputValue.endsWith('.') || (inputValue.endsWith('0') && (divideByDot[1]?.length ?? 0) <= 6)) {
      return inputValue
    }

    if ((!divideByDot[0] && divideByDot[1])) {
      return `0.${divideByDot[1]}`
    }

    return parseFloat(inputValue) > 0 ? dclean(dprec(inputValue, Math.min(6, token?.decimal ?? 6))) : ''
  }, [inputValue, token])
  const [hoverOnIcon, setHoverOnIcon] = useState<boolean>(false)

  const [show, setShow, portal, closeSelectToken] = useModal()
  const showSelectToken = useCallback(() => {
    showSelectIcon && setShow()
  }, [setShow, showSelectIcon])

  return {
    origin,
    inputValueView,
    hoverOnIcon,
    setHoverOnIcon,
    show,
    setShow,
    portal,
    closeSelectToken,
    showSelectToken
  }
}