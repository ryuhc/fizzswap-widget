import React from 'react'

import { ThemeProvider } from 'styled-components'

import createBreakpoints from '@/styles/createBreakPoints'

import type { SwapWidgetProps } from '@/types/index.d.ts'

import { darkColors, lightColors } from '@/constants/colors'

export default function StyleProvider({ theme, children }: { theme?: SwapWidgetProps['theme'], children: React.ReactNode }) {
  const mode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  const currentTheme = {
    colors: mode === 'light' ? {
      ...lightColors,
      ...theme?.light ?? {},
    } : {
      ...darkColors,
      ...theme?.dark ?? {},
    },
    breakpoints: createBreakpoints()
  }
  
  return (
    <ThemeProvider theme={currentTheme}>
      {children}
    </ThemeProvider>
  )
}