import { useChainId } from 'wagmi'

import { SUPPORT_CHAIN_IDS } from '@/constants/chain'
import { useEnvContext } from '@/context/EnvProvider'

export function useApiUrl() {
  const env = useEnvContext()
  const chainId = useChainId() as SUPPORT_CHAIN_IDS

  return env[`API_PATH_${chainId}`] as string
}