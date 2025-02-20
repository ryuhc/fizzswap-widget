import { useEffect } from 'react'

import { usePrevious } from '@uidotdev/usehooks'

import { useCurrentAccount } from '@/hooks/wallet/useCurrentAccount'

export function useRefetchByAccount(refetch: Function) {
  const account = useCurrentAccount()
  const prevAccount = usePrevious(account)

  useEffect(() => {
    if (account && prevAccount !== account) {
      refetch()
    }
  }, [account, prevAccount])
}
