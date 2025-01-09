import { isValidAddress } from '@ethereumjs/util'
import { useQuery } from '@tanstack/react-query'
import { useChainId } from 'wagmi'

import { ISwapRoutes } from '@/hooks/useFetchRoutes'
import { mulBN, safeDiv, subBN } from '@/utils/number'

import { SUPPORT_CHAIN_IDS } from '@/constants/chain'
import { useApiUrl } from '@/hooks/network/useApiUrl'
import { ITokenItem } from '@/hooks/queries/useTokenList'
import { fetchSwapRoutes } from '@/state/swap/fetch/fetchSwapRoutes'

interface IProps {
  inputToken: ITokenItem,
  outputToken: ITokenItem,
  amount: string,
  isPos: boolean
}

const initialRoute = {
  best: { fromAmount: '0', toAmount: '0', path: [], priceImpact: '0' },
  others: [],
  fee: '0',
} as unknown as ISwapRoutes

export function useSwapRoutes({ inputToken, outputToken, amount, isPos }: IProps) {
  const chainId = useChainId() as SUPPORT_CHAIN_IDS
  const apiPath = useApiUrl()
  const queryKey = ['swapRoute', chainId, inputToken.address ?? '-', outputToken.address ?? '-', amount, isPos]
  const { data, refetch, isFetching, isStale } = useQuery({
    queryKey,
    queryFn: () => {
      if (amount === '0' || !amount || !outputToken.address || !inputToken.address) {
        return initialRoute
      }

      return fetchSwapRoutes(apiPath, {
        from: inputToken.address,
        to: outputToken.address,
        amount,
        useOutput: !isPos
      }).then(res => {
        let currentInput = res.best.fromAmount

        for (const path of res.best.path) {
          currentInput = mulBN(currentInput, 1 - safeDiv(path.fee, 100))
        }

        res.fee = subBN(res.best.fromAmount, currentInput)

        return res
      }) as Promise<ISwapRoutes>
    },
    enabled: isValidAddress(inputToken.address) && isValidAddress(outputToken.address) && Number(amount) > 0,
    staleTime: 60 * 1000,
    initialData: initialRoute
  })

  return { data: data ?? initialRoute, refetch, isFetching, queryKey }
}