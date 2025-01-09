import { createContext, useContext, useEffect, useState } from 'react'

import { SwapWidgetProps } from '@/types/index.d.ts'

export const ConfigContext = createContext<SwapWidgetProps>({} as SwapWidgetProps)

export default function ConfigProvider({ children, config }: any) {
  const [render, setRender] = useState<boolean>(false)

  useEffect(() => {
    setTimeout(() => setRender(true), 100)
  }, [])

  return render && (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  )
}

export const useConfigContext = () => useContext(ConfigContext)