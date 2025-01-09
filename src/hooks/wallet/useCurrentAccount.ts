import { useMemo } from 'react'

import { useAccount } from 'wagmi'

import { useSearchParams } from '@/hooks/useSearchParams'

export function useCurrentAccount() {
  const { address: account } = useAccount()
  const searchParams = useSearchParams()

  return useMemo(() => {
    return (account ?? '') as `0x${string}`
  }, [account, searchParams])
}