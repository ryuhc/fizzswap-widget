import React, { useCallback, useEffect, useMemo, useState } from 'react'
import InfiniteScroller from 'react-infinite-scroller'

import { isValidAddress } from '@ethereumjs/util'
import { useDebounce } from '@uidotdev/usehooks'
import { filter } from 'lodash'
import { useChainId } from 'wagmi'


import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'
import { isNativeToken, isSameAddress } from '@/utils/address'
import { pickTokenName } from '@/utils/common'
import { addComma, dprec, mulBNWithDecimal, toReadableBN } from '@/utils/number'

import { Checkbox } from '@/components/Checkbox'
import { SearchBar } from '@/components/SearchBar'
import { TokenIcon } from '@/components/TokenIcon'

import {
  StyledSelectTokenModal,
  StyledSelectTokenTitle,
  StyledTokenFilterOption,
  StyledTokenSearchBar,
  StyledTokenTable,
  StyledTokenTableHeader,
  StyledTokenTableHeaderCol,
  StyledTokenTableRow,
  StyledTokenTableRowCol,
  StyledTokenTableRowColToken,
  StyledTokenTableScrollable
} from './styles'
import { ModalClose } from '@/modal/ModalClose'
import { ModalWrapper } from '@/modal/ModalWrapper'

import { Paragraph, TableEmpty, Text } from '@/styles/common'

import { SUPPORT_CHAIN_IDS } from '@/constants/chain'
import { useTokenBalances } from '@/hooks/queries/useTokenBalances'
import { ITokenItem, useTokenListInfinite } from '@/hooks/queries/useTokenList'
import { useSafeToken } from '@/hooks/token/useSafeToken'

interface IProps {
  selectedToken: ITokenItem | null,
  hideNative?: boolean,
  version?: number,
  onSelect: (token: ITokenItem) => void,
  onClose: () => void,
  onSearch?: (address: string) => Promise<ITokenItem & { balance: bigint }>
}

export function SelectTokenModal({ selectedToken, hideNative, version, onSearch, onSelect, onClose }: IProps) {
  const { t, i18n } = useTranslationSimplify()

  const [showOnlyHave, setShowOnlyHave] = useState<boolean>(false)
  const [totalLength, setTotalLength] = useState<number>(0)

  const [searchedToken, setSearchedToken] = useState<(ITokenItem & { balance: bigint }) | null>(null)
  const [keyword, setKeyword] = useState<string>('')
  const { data: tokens, refetch, remove, total, hasNextPage, fetchNextPage, isFetchingNextPage } = useTokenListInfinite({
    take: showOnlyHave ? totalLength : 50,
    keyword
  })

  const [searchId, setSearchId] = useState<number>(0)
  const debouncedSearchId = useDebounce(searchId, 500)
  useEffect(() => {
    if (onSearch && searchId !== debouncedSearchId) {
      onSearch(keyword).then(searchedToken => {
        setSearchedToken(searchedToken)
      })
    }
  }, [searchId, debouncedSearchId, keyword])
  const handleInputKeyword = useCallback((typedValue: string) => {
    setKeyword(typedValue)

    if (onSearch && isValidAddress(typedValue)) {
      setSearchId(searchId + 1)
      return
    }

    if (typedValue.length > 1 || (typedValue.length === 0 && keyword.length > 0)) {
      setTimeout(() => {
        remove()
        refetch()
      }, 100)
    }
  }, [keyword, searchId, onSearch])

  const loadMore = useCallback(async (page: number) => {
    if (showOnlyHave || isFetchingNextPage) {
      return
    }

    await fetchNextPage()
  }, [fetchNextPage, showOnlyHave, isFetchingNextPage])
  useEffect(() => {
    setTotalLength(total)
  }, [total])

  const { balances } = useTokenBalances(tokens.map(token => token.address))
  const handleShowOnlyHave = useCallback(() => {
    setShowOnlyHave(!showOnlyHave)

    if (!showOnlyHave) {
      setTimeout(refetch, 1000)
    }
  }, [showOnlyHave, refetch])
  const renderList = useMemo(() => {
    if (!showOnlyHave) {
      return tokens
    }

    return filter(tokens, token => {
      return balances[token.address] > 0n
    })
  }, [showOnlyHave, tokens, balances])

  useEffect(() => {
    refetch().finally()
  }, [])

  const [newToken, setNewToken] = useState<ITokenItem | null>(null)
  const { safeAlert, openSafeAlert, hideTokenAlert } = useSafeToken(
    newToken ? [newToken] : [],
    () => {
      if (!newToken) {
        return
      }

      onSelect(newToken)
      onClose()
    }
  )

  const chainId = useChainId() as SUPPORT_CHAIN_IDS
  const handleSelect = useCallback((token: ITokenItem) => {
    const disableUntil = hideTokenAlert[token.address]
    const isUnsafe = !disableUntil || disableUntil <= new Date().valueOf()

    if (isUnsafe) {
      setNewToken(token)
      return
    }

    onSelect(token)
    onClose()
  }, [hideTokenAlert, onSelect, onClose])
  useEffect(() => {
    if (newToken) {
      setTimeout(() => openSafeAlert(), 100)
    }
  }, [newToken])

  return (
    <>
      <ModalWrapper>
        <StyledSelectTokenModal data-testid="select-token-modal">
          <ModalClose onClose={onClose} />
          <StyledSelectTokenTitle style={{
            marginBottom: version === 3 ? '8px' : '40px'
          }}>
            {t('General.TokenNotSelected')}
          </StyledSelectTokenTitle>

          {version === 3 && (
            <Paragraph size={12} color="gray" style={{
              padding: '0 30px',
            }}>
              {t('V3.CreatePoolTokenPopup')}
            </Paragraph>
          )}

          <StyledTokenSearchBar className={version === 3 ? 'v3' : ''}>
            <SearchBar
              typedValue={keyword}
              isActive={keyword.length > 1}
              onInput={handleInputKeyword}
              placeholder={t('General.TokenSearchLabel')}
            />
            {version !== 3 && (
              <StyledTokenFilterOption>
                <Checkbox
                  label={t('Asset.ShowHoldAssets')}
                  checked={showOnlyHave}
                  onCheck={handleShowOnlyHave}
                />
              </StyledTokenFilterOption>
            )}
          </StyledTokenSearchBar>

          <StyledTokenTable>
            <StyledTokenTableHeader>
              <StyledTokenTableHeaderCol className="token">
                {t('General.Token')}
              </StyledTokenTableHeaderCol>
              <StyledTokenTableHeaderCol className="price">
                {t('Asset.Price')}
              </StyledTokenTableHeaderCol>
              <StyledTokenTableHeaderCol className="balance">
                {t('General.Balance')} / {t('General.SelectTokenEstimatedValue')}
              </StyledTokenTableHeaderCol>
            </StyledTokenTableHeader>

            {searchedToken ? (
              <StyledTokenTableScrollable>
                <StyledTokenTableRow selected={isSameAddress(searchedToken.address, selectedToken?.address ?? '')} onClick={() => handleSelect({ ...searchedToken, price: '0' })}>
                  <StyledTokenTableRowCol className="token">
                    <TokenIcon token={searchedToken} size={32} />
                    <StyledTokenTableRowColToken>
                      <Paragraph color="#475566" style={{ marginBottom: '3px' }}>{pickTokenName(searchedToken, i18n.language)}</Paragraph>
                      <Paragraph size={12} color="gray">{searchedToken.symbol}</Paragraph>
                    </StyledTokenTableRowColToken>
                  </StyledTokenTableRowCol>
                  <StyledTokenTableRowCol className="price">
                    $ {addComma(dprec(selectedToken?.price ?? '0', 4))}
                  </StyledTokenTableRowCol>
                  <StyledTokenTableRowCol className="balance">
                    <Paragraph weight={700} style={{ wordBreak: 'break-all', paddingLeft: '5px' }}>
                      {searchedToken.balance === 0n ? 0 : toReadableBN(searchedToken.balance, searchedToken.decimal, 6, true)}
                    </Paragraph>
                    <Paragraph size={12}>$ 0</Paragraph>
                  </StyledTokenTableRowCol>
                </StyledTokenTableRow>
              </StyledTokenTableScrollable>
            ) : (
              <StyledTokenTableScrollable>
                <InfiniteScroller
                  pageStart={0}
                  hasMore={!showOnlyHave && hasNextPage}
                  loadMore={loadMore}
                  useWindow={false}
                >
                  {keyword.length > 1 && renderList.length === 0 && (
                    <TableEmpty style={{ height: '330px' }}>
                      <Text size={12} color="gray">{t('General.NotFound')}</Text>
                    </TableEmpty>
                  )}
                  {renderList.map((token: ITokenItem) => {
                    const balance = balances[token.address] ?? 0n
                    const readableBalance = toReadableBN(balance, token.decimal, token.decimal)

                    return !(hideNative && isNativeToken(token.address, chainId)) && (
                      <StyledTokenTableRow key={token.address} selected={isSameAddress(token.address, selectedToken?.address ?? '')} onClick={() => handleSelect(token)}>
                        <StyledTokenTableRowCol className="token">
                          <TokenIcon token={token} size={32} lazyload={true} />
                          <StyledTokenTableRowColToken>
                            <Paragraph color="#475566" style={{ marginBottom: '3px' }}>{pickTokenName(token, i18n.language)}</Paragraph>
                            <Paragraph size={12} color="gray">{token.symbol}</Paragraph>
                          </StyledTokenTableRowColToken>
                        </StyledTokenTableRowCol>
                        <StyledTokenTableRowCol className="price">
                          $ {addComma(dprec(token.price, 4))}
                        </StyledTokenTableRowCol>
                        <StyledTokenTableRowCol className="balance">
                          <Paragraph weight={700} style={{ wordBreak: 'break-all', paddingLeft: '5px' }}>
                            {balance === 0n ? 0 : addComma(dprec(readableBalance, 6))}
                          </Paragraph>
                          <Paragraph size={12}>$ {dprec(mulBNWithDecimal(readableBalance, token.price, 4, true), 4)}</Paragraph>
                        </StyledTokenTableRowCol>
                      </StyledTokenTableRow>
                    )
                  }) as any}
                </InfiniteScroller>
              </StyledTokenTableScrollable>
            )}
          </StyledTokenTable>
        </StyledSelectTokenModal>
      </ModalWrapper>
      {safeAlert}
    </>
  )
}