import { create } from 'zustand'

import type { ITokenItem } from '@/hooks/queries/useTokenList'

export interface IFormError {
  message: string,
  fields: Record<string, boolean>
}

export interface ISwapStore {
  inputToken: ITokenItem,
  outputToken: ITokenItem,
  selectToken: (field: number, token: ITokenItem) => void,
  rate: number,
  changeRate: (rate: number) => void,
  typedField: number,
  focusOnField: (field: number) => void,
  inputValue: string,
  outputValue: string,
  updateValue: (value: string, typedField?: number) => void,
  isMaxInput: boolean,
  setMaxInput: (isMaxInput: boolean) => void,
  error: IFormError,
  setError: (message: string, fields: Record<string, boolean>) => void,
  priceImpact: number,
  setPriceImpact: (newValue: number) => void,
  clearState: () => void,
  clearInput: () => void
}

const initialState = {
  inputToken: {} as ITokenItem,
  outputToken: {} as ITokenItem,
  rate: 0,
  typedField: -1,
  inputValue: '',
  outputValue: '',
  isMaxInput: false,
  error: { message: '', fields: {} },
  priceImpact: 0
}

export const useSwapState = create<ISwapStore>()(
  (set, get) => ({
    inputToken: {} as ITokenItem,
    outputToken: {} as ITokenItem,
    selectToken: (field: number, token: ITokenItem) => {
      set({
        [field === 0 ? 'inputToken' : 'outputToken']: token
      })
    },
    rate: 0,
    changeRate: (newRate) => set({ rate: newRate }),
    typedField: 0,
    focusOnField: (field) => set({ typedField: field }),
    inputValue: '',
    outputValue: '',
    updateValue: (value, typedField?: number) => {
      const targetField = typedField ?? get().typedField

      if (targetField === -1) {
        return
      }

      set({ [targetField === 0 ? 'inputValue' : 'outputValue']: value })
    },
    isMaxInput: false,
    setMaxInput: (isMaxInput) => set({ isMaxInput }),
    error: { message: '', fields: { token0: false, token1: false } },
    setError: (message, fields) => set({
      error: {
        message,
        fields: { ...get().error.fields, ...fields }
      }
    }),
    priceImpact: 0,
    setPriceImpact: (priceImpact) => set({ priceImpact }),
    clearState: () => {
      set({ ...initialState })
    },
    clearInput: () => {
      set({ inputValue: '', outputValue: '', isMaxInput: false, priceImpact: 0 })
    }
  } as ISwapStore)
)