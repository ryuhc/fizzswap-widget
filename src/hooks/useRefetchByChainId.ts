import { useEffect } from 'react'

import { usePrevious } from '@uidotdev/usehooks'
import { useChainId } from 'wagmi'

export function useRefetchByChainId(refetch: Function) {
  const chainId = useChainId()
  const prevChainId = usePrevious(chainId)

  useEffect(() => {
    if (prevChainId && prevChainId !== chainId) {
      refetch(chainId)
    }
  }, [chainId, prevChainId])
}
