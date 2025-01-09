import { useEffect, useMemo, useState } from 'react'

import { DateTime } from 'luxon'
import useBus from 'use-bus'

import useInterval from '@/hooks/useInterval'

import { EVENT_TX_FINISHED } from '@/constants/events'

const timeout = 5 * 60 * 1000

export function useA2AModalActions({ onClose }: {
  onClose: () => void
}) {
  const [startedAt] = useState(new Date().valueOf())
  const [now, setNow] = useState<number>(new Date().valueOf())

  const remain = useMemo(() => {
    if (now === 0) {
      return { minutes: 0, seconds: 0 }
    }

    const diff = DateTime.fromMillis(startedAt + timeout).diff(DateTime.fromMillis(now), ['minutes', 'seconds']).toObject()

    return {
      minutes: Math.floor(diff.minutes ?? 0),
      seconds: Math.floor(diff.seconds ?? 0),
    }
  }, [startedAt, now])
  const isFinished = useMemo(() => {
    return startedAt + timeout <= now
  }, [startedAt, now])

  useInterval(() => {
    setNow(new Date().valueOf())
  }, 1000, false)

  useBus(EVENT_TX_FINISHED, () => onClose())

  useEffect(() => {
    if (isFinished) {
      onClose()
    }
  }, [isFinished])

  return {
    remain,
    isFinished
  }
}