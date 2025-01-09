import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'

export const useScrollTo = <T extends Element>() => {
  const ref = useRef<T>(null)
  const [shouldScrollTo, setShouldScrollTo] = useState(false)

  useEffect(() => {
    if (ref.current && shouldScrollTo) {
      ref.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
      setShouldScrollTo(false)
    }
  }, [shouldScrollTo])

  return [ref, setShouldScrollTo] as [
    RefObject<T>,
    Dispatch<SetStateAction<boolean>>,
  ]
}
