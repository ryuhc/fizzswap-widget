import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'

import { filter } from 'lodash'

import { useTranslationSimplify } from '@/hooks/useTranslationSimplify'

import { CircleProgress } from '@/components/CircleProgress'
import { SwapPriceUpdated } from '@/components/SwapPriceUpdated'
import { CommonTooltip } from '@/components/Tooltip'
import { TxAgreement } from '@/components/TxAgreement'

import { ModalClose } from '@/modal/ModalClose'
import { ModalWrapper } from '@/modal/ModalWrapper'

import { useTxHistoryStore } from '@/state/txHistory'

import { Paragraph, Text } from '@/styles/common'
import { ModalSubmitButton, StyledModalSubmitArea } from '@/styles/modal'

import { useApproveToken } from '@/hooks/token/useApproveToken'
import {
  StyledTxConfirmEventLabel,
  StyledTxConfirmModal,
  StyledTxConfirmTitle,
  StyledTxEventBody,
  StyledTxEventDetail,
  StyledTxEventEstimated,
  StyledTxEventEstimatedRow,
  StyledTxEventEstimatedRowTitle,
  StyledTxEventEstimatedRowValue,
  StyledTxEventNotice,
  StyledTxEventNoticeItem,
  StyledTxEventNoticeItems,
  StyledTxEventRow,
  StyledTxEventRowTitle,
  StyledTxEventRowValue
} from '@/modal/TxConfirmModal/styles'

export interface ITxConfirmParams {
  event: string
  title?: string
  isMax?: boolean
  eventNotice?: string
  eventData?: ITxEvent[]
  estimateData?: ITxEstimate[]
  notice?: string
  notices?: string[]
  approvals?: IApproveOptions
  submitText?: string
  isLoading: boolean
  nativeBalance: bigint
  needAgreement?: boolean
  isSummary?: boolean
  onSubmit: () => void
  onClose: () => void
  priceHandler?: {
    show: boolean
    callback?: Function
  }
}

export interface ITxEvent {
  title: string
  value?: string
  childNode?: ReactNode
  style?: any
}

interface ITxEstimate {
  title: string
  tooltip?: string
  value?: string
  childNode?: ReactNode
  align?: string
}

interface IApproveOptions {
  ids: `0x${string}`[] | number[]
  symbols: string[]
  amounts?: bigint[]
  spender: `0x${string}`
  nftAddress?: `0x${string}`
  nativeBalance: bigint
}

export function TxConfirmModal(props: ITxConfirmParams) {
  const {
    event,
    title,
    isMax,
    eventNotice,
    eventData,
    estimateData,
    notice,
    notices,
    approvals,
    nativeBalance,
    submitText,
    isLoading,
    needAgreement,
    isSummary,
    onSubmit,
    onClose,
    priceHandler
  } = props

  const [modalState, setModalState] = useState<ITxConfirmParams | null>(null)
  useEffect(() => {
    setModalState({
      event,
      title,
      isMax,
      eventNotice,
      eventData,
      estimateData,
      notice,
      notices,
      approvals,
      nativeBalance,
      submitText,
      isLoading,
      needAgreement,
      isSummary,
      onSubmit,
      onClose
    })
  }, [])

  const { t } = useTranslationSimplify()
  const eventTitle = useMemo(() => {
    return (
      {
        swap: t('General.TxTitleSwap'),
        deposit: t('General.Deposit'),
        prepareZap: t('General.Deposit'),
        zap: t('General.Deposit'),
        VaultDeposit: t('General.Deposit'),
        withdraw: t('General.Withdraw'),
        bridgeWithdraw: t('General.Withdraw'),
        VaultWithdraw: t('General.Withdraw'),
        approve: t('General.ApproveToken'),
        claim: t('General.TxTitleClaim'),
        claimToken: t('General.ClaimAsset'),
        claimStakingReward: t('General.TxTitleClaim'),
        claimVotingReward: t('General.TxTitleClaim'),
        createPool: t('General.TxTitleCreatePool'),
        stakingKSP: t('Staking.Staking'),
        unstakingKSP: t('Staking.Unstaking'),
        extendStakingKSP: t('Ecopot.ExtendStaking'),
        resetStakingBoost: t('Ecopot.ResetStakingBoost'),
        // addVoting: t('Staking.Vote'),
        // removeVoting: t('Staking.RetractVoteOfPool'),
        // removeAllVoting: t('Staking.RetractVoteOfAll'),
        claimAllTokenRewards: t('Staking.ClaimAll'),
        propose: t('Gov.VotingProposalTitle'),
        plusDeposit: t('Vault.PlusDeposit'),
        plusDepositConfirm: t('Vault.PlusDeposit'),
        plusWithdraw: t('Vault.PlusWithdraw'),
        plusWithdrawConfirm: t('Vault.PlusWithdraw'),
        ecoPotAddVoting: t('Ecopot.ParticipatedEcopot'),
        ecoPotRemove: t('Ecopot.EcoPotRemove'),
        addPositionCollat: t('General.ShortLongTxPopupAddDeposit'),
        addPositionLong: t('General.ShortLongTxPopupLongDeposit'),
        addPositionShort: t('General.ShortLongTxPopupShortDeposit'),
        closePosition: t('General.ShortLongTxPopupClosePosition'),
        voting: t('Gov.Voting'),
        convert: t('Asset.ConvertGuideTitle'),
        concentrated: t('General.Deposit'),
        migrateVersion: t('General.Deposit'),
        migrateTick: t('General.Deposit'),
        createdClp: t('V3.CreatePoolTXTitle'),
        finalDeposit: t('General.Deposit')
      }[event] ?? ''
    )
  }, [event])

  const { isEstimatingFee } = useTxHistoryStore()
  const { needApprove, isApproving, handleApprove, step, isFetched } =
    useApproveToken({
      ids: approvals?.ids ?? [],
      symbols: approvals?.symbols ?? [],
      amounts: approvals?.amounts ?? [],
      spender: approvals?.spender ?? '0x',
      nftAddress: approvals?.nftAddress ?? undefined,
      nativeBalance,
      isSummary
    })
  const isProgressApproving = useMemo(() => {
    return !isFetched || step < needApprove.length
  }, [isFetched, step, needApprove])

  const [checked, setChecked] = useState<boolean>(false)
  const [errorAboutAgreement, setErrorAboutAgreement] = useState<boolean>(false)
  const handleChecked = useCallback(() => {
    setChecked(!checked)
  }, [checked])

  const modalTitle = useMemo(() => {
    return isProgressApproving || !title ? t('General.ConfirmTxTitle') : title
  }, [title, isProgressApproving])
  const handleSubmit = useCallback(() => {
    if (isProgressApproving || isLoading || isEstimatingFee) {
      return
    }

    if (needAgreement && !checked) {
      return setErrorAboutAgreement(true)
    }

    onSubmit()
  }, [needAgreement, checked, isProgressApproving, isLoading, isEstimatingFee])

  const needApprovalCount = useMemo(() => {
    return filter(needApprove, (item) => !item.initialized).length
  }, [needApprove])

  const handlePriceChange = useCallback(() => {
    priceHandler?.callback && priceHandler.callback()
  }, [priceHandler, props])

  return (
    <ModalWrapper>
      <StyledTxConfirmModal>
        <ModalClose onClose={onClose} />

        <StyledTxConfirmTitle>{modalTitle}</StyledTxConfirmTitle>

        <StyledTxConfirmEventLabel>
          {(function () {
            if (isProgressApproving) {
              return (
                <article>
                  <Text color="secondaryActive" size={16}>
                    {t('General.TxSubmitApprove')}
                  </Text>
                </article>
              )
            }

            if (!eventNotice) {
              return (
                <article>
                  <Text color="secondaryActive" size={16}>
                    {eventTitle}
                    {isMax && <Text> Max</Text>}
                  </Text>
                </article>
              )
            }

            return (
              <article>
                <Text color="gray" size={12}>
                  {eventNotice}
                </Text>
              </article>
            )
          })()}
        </StyledTxConfirmEventLabel>

        {isProgressApproving ? (
          <StyledTxEventBody>
            <StyledTxEventDetail>
              <StyledTxEventRow>
                <StyledTxEventRowTitle>
                  <Text weight={700} color="secondaryLight">
                    Token
                  </Text>
                </StyledTxEventRowTitle>
                <StyledTxEventRowValue>
                  <Text
                    size={18}
                    dangerouslySetInnerHTML={{
                      __html: (approvals?.symbols ?? [])[step] ?? ''
                    }}
                  />
                </StyledTxEventRowValue>
              </StyledTxEventRow>
            </StyledTxEventDetail>

            <StyledTxEventNotice style={{ marginBottom: '30px' }}>
              <Paragraph
                size={12}
                color="gray"
                dangerouslySetInnerHTML={{
                  __html: t('General.ApproveTxNotice')
                }}
              />
            </StyledTxEventNotice>
          </StyledTxEventBody>
        ) : (
          <StyledTxEventBody>
            <StyledTxEventDetail>
              <article>
                {eventData?.map((row, i) => {
                  return (
                    <StyledTxEventRow key={i} style={row?.style ?? {}}>
                      <StyledTxEventRowTitle>
                        <Text weight={700} color="secondaryLight">
                          {row.title}
                        </Text>
                      </StyledTxEventRowTitle>
                      <StyledTxEventRowValue>
                        {row.childNode ? (
                          row.childNode
                        ) : (
                          <Text
                            size={18}
                            color="gray"
                            dangerouslySetInnerHTML={{ __html: row.value }}
                          />
                        )}
                      </StyledTxEventRowValue>
                    </StyledTxEventRow>
                  )
                })}
              </article>
            </StyledTxEventDetail>

            {notice && (
              <StyledTxEventNotice>
                <Paragraph size={12} color="gray">
                  {notice}
                </Paragraph>
              </StyledTxEventNotice>
            )}

            <StyledTxEventEstimated>
              {estimateData &&
                estimateData.map((item, i) => {
                  return (
                    <StyledTxEventEstimatedRow
                      key={i}
                      style={{
                        alignItems: item?.align ?? 'center'
                      }}
                    >
                      <StyledTxEventEstimatedRowTitle>
                        <Text size={12} color="gray">
                          {item.title}
                        </Text>
                        {item.tooltip && (
                          <CommonTooltip
                            tooltipId={`about_${item.title}_i`}
                            content={item.tooltip}
                          />
                        )}
                      </StyledTxEventEstimatedRowTitle>
                      <StyledTxEventEstimatedRowValue>
                        {item.childNode ? (
                          item.childNode
                        ) : (
                          <Text
                            size={12}
                            color="gray"
                            dangerouslySetInnerHTML={{ __html: item.value }}
                          />
                        )}
                      </StyledTxEventEstimatedRowValue>
                    </StyledTxEventEstimatedRow>
                  )
                })}
            </StyledTxEventEstimated>

            {notices && (
              <StyledTxEventNotice>
                <StyledTxEventNoticeItems>
                  {notices.map((item, i) => {
                    return (
                      <StyledTxEventNoticeItem key={i}>
                        <Text
                          size={12}
                          color="gray"
                          dangerouslySetInnerHTML={{ __html: item }}
                        />
                      </StyledTxEventNoticeItem>
                    )
                  })}
                </StyledTxEventNoticeItems>
              </StyledTxEventNotice>
            )}
          </StyledTxEventBody>
        )}

        {!priceHandler?.show ||
        isLoading ||
        isEstimatingFee ||
        isApproving ? null : (
          <SwapPriceUpdated onRefresh={handlePriceChange} />
        )}

        {needAgreement && (
          <TxAgreement
            checked={checked}
            isError={errorAboutAgreement}
            onCheck={handleChecked}
          />
        )}

        <StyledModalSubmitArea>
          {needApprove.map((approval, i) => {
            return (
              !approval.initialized && (
                <ModalSubmitButton
                  key={approval.id}
                  type={step !== i || approval.finished ? 'gray2' : 'secondary'}
                  onClick={() => handleApprove(approval)}
                  style={{
                    width: `${100 / (needApprovalCount + 1)}%`
                  }}
                >
                  {step === i &&
                  (isApproving ||
                    (step <= needApprove.length - 1 && isEstimatingFee)) ? (
                    <CircleProgress size={32} />
                  ) : (
                    <Text weight={700}>
                      {approval.finished
                        ? t('General.ApproveFinished')
                        : t('General.TxSubmitApprove')}
                    </Text>
                  )}
                </ModalSubmitButton>
              )
            )
          })}

          <ModalSubmitButton
            type={isProgressApproving ? 'gray2' : 'secondary'}
            onClick={() => handleSubmit()}
            style={{
              width:
                needApprovalCount === 0
                  ? '100%'
                  : `${100 / (needApprovalCount + 1)}%`
            }}
          >
            {(needApprove.length === 0 || step >= needApprove.length) &&
            (isLoading || isEstimatingFee || !isFetched) ? (
              <CircleProgress size={32} />
            ) : (
              <Text weight={700}>{submitText ?? t('General.Confirm')}</Text>
            )}
          </ModalSubmitButton>
        </StyledModalSubmitArea>
      </StyledTxConfirmModal>
    </ModalWrapper>
  )
}
