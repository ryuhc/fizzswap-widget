import { useEffect } from 'react'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

import { useEnvContext } from '@/context/EnvProvider'
import { useBlockNumber } from '@/hooks/queries/useBlockNumber'
import { useTokenListDefault } from '@/hooks/queries/useTokenList'
import { useScroll } from '@/hooks/ui/useScroll'
import { useWindowInfo } from '@/hooks/ui/useWindowInfo'

gsap.registerPlugin(useGSAP)

export default function GlobalHooksProvider() {
  const env = useEnvContext()

  useWindowInfo()
  useBlockNumber()
  useScroll()
  useTokenListDefault()

  // show version for qa
  useEffect(() => {
    console.log(`widget version : ${import.meta.env.APP_VERSION}`, String(env.PROFILE))
  }, [env])

  return null
}