import { useQuery } from '@tanstack/react-query'

import { useEnvContext } from '@/context/EnvProvider'

export function useSiteNotices() {
  const env = useEnvContext()
  const { data } = useQuery({
    queryKey: ['siteNotices'],
    queryFn: async () => {
      return await fetch(
        `${env.OPERATOR_PATH}/info/notice/noticeInfo.json`
      ).then(async (res) => {
        return res.json()
      })
    },
    staleTime: 1000 * 60 * 60
  })

  return data ?? []
}
