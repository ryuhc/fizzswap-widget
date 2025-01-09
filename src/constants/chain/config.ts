import { Chain, defineChain, parseUnits } from 'viem'

export declare type SUPPORT_CHAIN_IDS = 2355 | 1722641160

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const siliconRpc = 'https://rpc.silicon.network'
export const silicon = defineChain({
  id: 2355,
  name: 'Silicon zkEVM',
  network: 'silicon-zk',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  contracts: {
    multicall2: {
      address: '0x566da61a4D0841a67bA8F2c7e5975885fa0Af4DA',
      blockCreated: 96002415,
    },
  },
  rpcUrls: {
    public: {
      http: [siliconRpc],
    },
    default: {
      http: [siliconRpc],
    },
  },
  blockExplorers: {
    etherscan: { name: 'Siliconscope', url: 'https://scope.silicon.network' },
    default: { name: 'Siliconscope', url: 'https://scope.silicon.network' },
  },
  fees: {
    async estimateFeesPerGas({ multiply, type, client }) {
      const gasPrice = await client.request({ method: 'eth_gasPrice' }).then(BigInt)
      // const baseFeePerGas = 1000000000n
      // const maxPriorityFeePerGas = 1n

      if (type === 'legacy') return { gasPrice: multiply(gasPrice) }
      return {
        // maxFeePerGas: multiply(baseFeePerGas) + maxPriorityFeePerGas,
        // maxPriorityFeePerGas
        maxFeePerGas: gasPrice,
        maxPriorityFeePerGas: gasPrice
      }
    }
  }
} as Chain)

const siliconSepoliaRPC = 'https://rpc-sepolia.silicon.network'
export const siliconSepolia = defineChain({
  id: 1722641160,
  name: 'Silicon zkEVM Sepolia Testnet',
  network: 'silicon-sepolia-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  contracts: {
    multicall2: {
      address: '0x18b6bBBcc719E666f3763386E02F20fE4d90bF62',
      blockCreated: 96002415,
    },
  },
  rpcUrls: {
    public: {
      http: [siliconSepoliaRPC],
    },
    default: {
      http: [siliconSepoliaRPC],
    },
  },
  blockExplorers: {
    etherscan: { name: 'Siliconscope', url: 'https://scope-sepolia.silicon.network' },
    default: { name: 'Siliconscope', url: 'https://scope-sepolia.silicon.network' }
  },
  fees: {
    async estimateFeesPerGas({ multiply, type }) {
      const gasPrice = parseUnits('1', 18)
      // const baseFeePerGas = 1000000000n
      // const maxPriorityFeePerGas = 1n

      if (type === 'legacy') return { gasPrice: multiply(gasPrice) }
      return {
        // maxFeePerGas: multiply(baseFeePerGas) + maxPriorityFeePerGas,
        // maxPriorityFeePerGas
        maxFeePerGas: 1000000000n,
        maxPriorityFeePerGas: 1000000000n
      }
    }
  },
  testnet: true
} as Chain)

export const DEFAULT_CHAIN_ID = Number(import.meta.env.DEFAULT_CHAIN ?? import.meta.env.NEXT_PUBLIC_DEFAULT_CHAIN)

export const SUPPORT_CHAINS = import.meta.env.VITE_PROFILE === 'prod' ? [silicon] : [silicon, siliconSepolia]

export const API_URLS: { [p: number]: string } = {
  [silicon.id]: (import.meta.env.API_PATH_2355 || import.meta.env.VITE_PUBLIC_API_2355) ?? '',
  [siliconSepolia.id]: (import.meta.env.API_PATH_1722641160 || import.meta.env.VITE_PUBLIC_API_1722641160) ?? '',
}

export const MIN_AMOUNT_FOR_FEE = '0.0001'

export const POOL_CREATE_FEE = BigInt(0)

export const BLOCK_INTERVAL: { [p: number]: number } = {
  [silicon.id]: 3,
  [siliconSepolia.id]: 3
}