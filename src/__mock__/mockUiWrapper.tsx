import StyleProvider from '@/context/StyleProvider'

export const uiWrapper  = ({ children }: any) => {
  return (
    <StyleProvider>{children}</StyleProvider>
  )
}