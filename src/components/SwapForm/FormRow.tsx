import { ChangeEvent, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import { formatUnits } from 'viem'


import { TokenIcon } from '@/components/TokenIcon'

import { SelectTokenModal } from '@/modal/SelectTokenModal'

import { Text } from '@/styles/common'

import type { ITokenItem } from '@/hooks/queries/useTokenList'

import TriangleIcon from '@/assets/img/icon/ic-triangle-bottom-disabled-gray.svg'
import { Image } from '@/components/Image/index'
import { FormTokenBalance } from '@/components/SwapForm/FormTokenBalance'
import {
  FormRowInputField,
  FormRowTitle,
  FormSelectToken,
  StyledFormRow,
  FormRowSub
} from '@/components/SwapForm/styles'
import { useConfigContext } from '@/context/ConfigProvider'
import { useFormRow } from '@/hooks/swap/useFormRow'

interface IProps {
  idx: number,
  type: 'swap' | 'pool',
  inputValue: string,
  token: ITokenItem | null,
  title?: string,
  balance?: bigint,
  hasError: boolean,
  hideMax?: boolean,
  isMax: boolean,
  showSelectIcon?: boolean,
  hideNative?: boolean,
  selectable: boolean,
  onInput: (value: ChangeEvent<HTMLInputElement>) => void,
  onFocus: (field: number) => void,
  onMax: (idx: number, balance: string) => void
  onSelect?: (idx: number, token: ITokenItem) => void,
  onSearch?: (address: string) => Promise<ITokenItem & { balance: bigint }>
}

export function FormRow({
  idx,
  type,
  inputValue,
  token,
  title,
  balance,
  hasError,
  isMax,
  showSelectIcon = true,
  hideNative = false,
  hideMax = false,
  selectable,
  onInput,
  onFocus,
  onMax,
  onSelect,
  onSearch
}: IProps) {
  const [focused, setFocused] = useState<boolean>(false)
  const { inputValueView, show, portal, closeSelectToken, showSelectToken } = useFormRow({
    inputValue,
    token,
    showSelectIcon
  })
  const isActiveInput = useMemo(() => {
    return focused || inputValueView
  }, [focused, inputValueView])

  const config = useConfigContext()

  return (
    <StyledFormRow $selectable={selectable}>
      {(title && selectable) && (
        <FormRowTitle className={isActiveInput ? 'active' : ''}>
          <Text size={14} color={isActiveInput ? 'secondaryLight' : 'gray6'} weight={700} data-testid="form-row-title">{title}</Text>
        </FormRowTitle>
      )}

      <section className={!selectable ? 'not-selectable' : ''}>
        <div>
          <FormRowInputField
            type="number"
            step="any"
            inputMode="decimal"
            placeholder="0"
            value={inputValueView}
            onFocus={() => {
              setFocused(true)
              onFocus(idx)
            }}
            onBlur={() => setFocused(false)}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onInput(e)}
            onKeyDown={e => {
              if (e.code === 'Minus' || e.code === 'KeyE') {
                e.preventDefault()
                return false
              }
            }}
            error={hasError}
            data-testid="form-row-input"
          />

          <FormSelectToken className={config.selectable ? 'with-ripple' : ''} $selectable={selectable} onClick={() => config.selectable && showSelectToken()}>
            <Text size={16} weight={700} color={token?.address ? 'black' : 'primary'} data-testid="form-row-symbol">
              {token?.symbol ?? 'Token'}
            </Text>
            <TokenIcon token={token} size={40} />
            {config.selectable ? <Image src={TriangleIcon} alt="select" /> : null}
          </FormSelectToken>
        </div>

        {selectable && (
          <FormRowSub>
            <FormTokenBalance
              token={token}
              balance={balance ?? 0n}
              isMax={isMax}
              onClickMax={() => onMax(idx, formatUnits(balance ?? 0n, token?.decimal ?? 0))}
              hideMax={hideMax}
            />
          </FormRowSub>
        )}
      </section>

      {show && portal ? (
        createPortal((
          <SelectTokenModal
            selectedToken={token}
            hideNative={hideNative}
            onSelect={(token: ITokenItem) => onSelect && onSelect(idx, token)}
            onClose={closeSelectToken}
            onSearch={onSearch}
          /> as any
        ), portal)
      ) : null}
    </StyledFormRow>
  )
}