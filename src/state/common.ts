import { create } from 'zustand'

interface IWindowInfo {
  width: number,
  height: number,
  isSmall: boolean
}

export enum NetworkHealth {
  health = 'health',
  latency = 'latency',
  sick = 'sick'
}

export interface ICurrentBlock {
  height: number,
  timestamp: number,
  status: NetworkHealth
}

export interface IAlert {
  icon?: string,
  text: string,
  hideIcon?: boolean,
  submitTitle?: string,
  callback?: () => void,
  cancelTitle?: string,
  onCancel?: () => void
}

export interface ICommonStore {
  windowInfo: IWindowInfo,
  setWindowInfo: (props: { width: number | null, height: number | null }) => void
  slippage: number,
  setSlippage: (slippage: number) => void,
  watchingTokens: `0x${string}`[],
  setWatchingTokens: (tokens: `0x${string}`[]) => void,
  scroll: { x: number, y: number },
  setScroll: ({ x, y }: { x?: number, y?: number }) => void,
  isConnectingWallet: boolean,
  setIsConnectingWallet: (flag: boolean) => void,
  connectingWalletId: string,
  setConnectingWalletId: (id: string) => void,
  currentBlock: {
    height: number,
    timestamp: number,
    status: NetworkHealth
  },
  setCurrentBlock: (newBlock: ICurrentBlock) => void,
  alertData: IAlert | null,
  showAlert: (alert: IAlert) => void,
  hideAlert: () => void
}

export const useCommonStore = create<ICommonStore>()(
  (set, get) => ({
    windowInfo: {
      width: 0,
      height: 0,
      isSmall: false
    },
    setWindowInfo: (newState) => {
      const defaultState = get().windowInfo
      const newWidth = newState.width || defaultState.width

      set({
        windowInfo: {
          width: newWidth,
          height: newState.height || defaultState.height,
          isSmall: newWidth < 1024
        }
      })
    },
    slippage: 0.5,
    setSlippage: (slippage) => set({ slippage }),
    watchingTokens: [],
    setWatchingTokens: (newTokens: ICommonStore['watchingTokens']) => {
      if (newTokens.length === 0) {
        return set({ watchingTokens: ['0x0000000000000000000000000000000000000000'] })
      }

      return set({ watchingTokens: newTokens })
    },
    scroll: { x: 0, y: 0 },
    setScroll: (newScroll) => set({ scroll: { ...get().scroll, ...newScroll } }),
    isConnectingWallet: false,
    setIsConnectingWallet: (flag) => set({ isConnectingWallet: flag }),
    connectingWalletId: '',
    setConnectingWalletId: (id) => set({ connectingWalletId: id }),
    currentBlock: {
      height: 0,
      timestamp: 0,
      status: NetworkHealth.health
    },
    setCurrentBlock: (newBlock) => set({ currentBlock: newBlock }),
    alertData: null,
    showAlert: (alertData) => set({ alertData }),
    hideAlert: () => set({ alertData: null })
  } as ICommonStore)
)