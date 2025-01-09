import { create } from 'zustand'

export interface ITxHistory {
  action: string
  hash: `0x${string}`,
  status: ITxState,
  timestamp: number
}

export enum ITxState {
  pending = 'pending',
  success = 'success',
  fail = 'fail'
}

export interface ITxHistoryStore {
  txHistory: ITxHistory[],
  addTx: (hash: `0x${string}`, action: string) => void,
  updateTx: (hash: `0x${string}`, status: ITxState) => void,
  clearTx: () => void,
  isEstimatingFee: boolean,
  setIsEstimatingFee: (flag: boolean) => void
}

export const useTxHistoryStore = create<ITxHistoryStore>()(
  (set, get) => ({
    txHistory: [],
    addTx: (hash, action) => {
      const newState = get().txHistory

      newState.unshift({
        hash,
        action,
        status: ITxState.pending,
        timestamp: new Date().valueOf()
      })

      set({
        txHistory: newState
      })
    },
    updateTx: (hash, status) => {
      const newState = status === ITxState.success ? [...get().txHistory] : get().txHistory
      const txIndex = newState.findIndex(tx => tx.hash === hash)

      if (txIndex === -1) {
        return
      }

      newState[txIndex].status = status

      set({
        txHistory: newState
      })
    },
    clearTx: () => {
      set({ txHistory: [] })
    },
    isEstimatingFee: false,
    setIsEstimatingFee: (flag) => set({ isEstimatingFee: flag })
  } as ITxHistoryStore)
)