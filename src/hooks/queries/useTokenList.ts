import { useMemo } from 'react'

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { map } from 'lodash'
import { useChainId } from 'wagmi'

import { fetchTokenList } from '@/utils/fetch'

import type { IFetchListOptions, IBridgeMinter } from '@/types/common'

import { contractAddresses, SUPPORT_CHAIN_IDS } from '@/constants/chain'
import { useApiUrl } from '@/hooks/network/useApiUrl'

export interface ITokenList {
  skip: number,
  take: number,
  total: number,
  tokens: ITokenItem[]
}

export interface ITokenItem {
  address: `0x${string}`,
  nameKo: string,
  nameEn: string,
  symbol: string,
  image: string,
  decimal: number,
  price: string,
  bridgeType: string,
  grade: string,
  isStable?: boolean,
  originChain?: string,
  bridgeConfig?: IBridgeMinter
  yesterdayPrice?: string,
  weeklyPrice?: number[]
}

async function fetchListOverLimit({ queryOptions, limit, apiPath }: {
  queryOptions: IFetchListOptions,
  limit: number,
  apiPath: string
}) {
  const take = queryOptions?.take ?? 0

  if (take <= limit) {
    return await fetchTokenList(apiPath, queryOptions)
  }

  const result: ITokenList = { skip: 0, take, total: 0, tokens: [] }
  const queries =  []
  const pages = Math.ceil(take / limit)

  for (let i = 0; i < pages; i++) {
    queries.push({
      skip: i * limit,
      take: limit,
      keyword: queryOptions.keyword
    })
  }

  const fetchedEntireTokens = await Promise.allSettled(
    queries.map(query => fetchTokenList(apiPath, query))
  )

  for (const fetchedData of fetchedEntireTokens) {
    if (fetchedData.status === 'fulfilled') {
      result.total = fetchedData.value.total
      result.tokens = [...result.tokens, ...fetchedData.value.tokens]
    }
  }

  return result
}

export function useTokenList(
  options?: IFetchListOptions & { useWeekly?: boolean } | null,
  initialData?: ITokenList,
  pollingOptions?: { staleTime: number | undefined, refetchInterval: number | undefined },
  queryKey?: string[]
): ITokenList {
  const chainId = useChainId()
  const apiPath = useApiUrl()

  const limit = 100
  const queryOptions = options ?? { skip: 0, take: limit, keyword: '' }

  const { data } = useQuery({
    queryKey: queryKey ?? ['tokenList', chainId, queryOptions.skip, queryOptions.take, queryOptions.keyword],
    queryFn: () => fetchListOverLimit({ queryOptions, limit, apiPath }),
    staleTime: pollingOptions?.staleTime ?? 15 * 1000,
    refetchInterval: pollingOptions?.refetchInterval ?? 15 * 1000,
    initialData: initialData ?? undefined
  })
  const result = data ?? { skip: 0, take: 0, total: 0, tokens: [] }

  if (options?.useWeekly) {
    result.tokens = map(result.tokens, token => {
      return {
        ...token,
        weeklyPrice: map(token.weeklyPrice, price => Number(price))
      }
    })
  }

  return result
}

export function useTokenListDefault() {
  const chainId = useChainId() as SUPPORT_CHAIN_IDS
  const apiPath = useApiUrl()
  const queryOptions = useMemo(() => {
    return {
      skip: 0,
      take: 2,
      addresses: `${contractAddresses.native[chainId]},${contractAddresses.govToken[chainId]}`
    }
  }, [chainId])

  const { data } = useQuery({
    queryKey: ['initialTokens', chainId],
    queryFn: () => fetchTokenList(apiPath, queryOptions),
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  })

  return data ?? { skip: 0, take: 0, total: 0, tokens: [] }
}

export function useTokenListPicked(addresses: `0x${string}`[]) {
  const apiPath = useApiUrl()
  const queryOptions = useMemo(() => {
    return {
      skip: 0,
      take: addresses.length,
      addresses: addresses.join(',')
    }
  }, [addresses])

  const { data } = useQuery({
    queryKey: ['initialTokens', apiPath],
    queryFn: () => fetchTokenList(apiPath, queryOptions),
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  })

  return data ?? { skip: 0, take: 0, total: 0, tokens: [] }
}

export function useTokenListInfinite({ take, keyword }: { take?: number, keyword: string }) {
  const apiPath = useApiUrl()
  const { data, refetch, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    initialData: undefined, initialPageParam: undefined,
    queryKey: ['tokenListInfinite', apiPath],
    queryFn: (params) => {
      if (params.pageParam) {
        return fetchTokenList(apiPath, params.pageParam)
      }

      const queryOptions = { skip: 0, take, keyword }

      return fetchListOverLimit({ queryOptions, limit: 100, apiPath })
    },
    getNextPageParam: (lastPage) => {
      const _take = take ?? 100
      const _total = lastPage?.total ?? 0

      if (lastPage?.skip + lastPage?.take >= _total) {
        return undefined
      }

      if (lastPage.skip + _take > _total) {
        return { skip: lastPage.skip, take: _total - lastPage.skip, keyword }
      }

      return { skip: lastPage.skip + _take, take: _take, keyword }
    },
    staleTime: 20 * 1000
  })
  const tokens = useMemo(() => {
    const res = []

    for (const page of data?.pages ?? []) {
      for (const token of page?.tokens ?? []) {
        res.push(token)
      }
    }

    return res
  }, [data?.pages])

  return { data: tokens, total: data?.pages[0]?.total ?? 0, refetch, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage }
}