import { createContext, useContext, useEffect, useState } from 'react'

export const EnvContext = createContext<Record<string, string | number>>({})

export default function EnvProvider({ children, env }: any) {
  const [render, setRender] = useState<boolean>(false)

  useEffect(() => {
    setTimeout(() => setRender(true), 100)
  }, [])

  return (
    render && <EnvContext.Provider value={env}>{children}</EnvContext.Provider>
  )
}

export const useEnvContext = () => useContext(EnvContext)
