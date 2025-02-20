import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export function useTranslationSimplify() {
  const { t, i18n } = useTranslation()
  const importByNs: any = useCallback(
    (textId: string, otherProps?: any) => {
      const [ns, text] = textId.split('.')

      return t(text as any, { ns, ...otherProps })
    },
    [t]
  )
  const locale = useMemo(() => i18n.language, [i18n])

  return {
    t: importByNs,
    i18n,
    locale
  }
}
