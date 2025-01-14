import { initReactI18next } from 'react-i18next'

import i18n from 'i18next'

import TranslationData from '@/assets/translate.json'

const messages: Record<string, Record<string, Record<string, string>>> = {}

for (const locale in TranslationData) {
  const namespaces: Record<string, Record<string, string>> = {}

  if (locale === 'version') {
    continue
  }

  // @ts-ignore
  for (const [namespaceId, namespaceValues] of Object.entries(TranslationData[locale] ?? {})) {
    const parsedValues: Record<string, string> = {}

    for (const [key, value] of Object.entries((namespaceValues ?? {}) as Record<string, string>)) {
      if (!key.includes('.')) {
        parsedValues[key] = value.replace(/{/g, '{{').replace(/}/g, '}}')
      }
    }

    namespaces[namespaceId] = parsedValues
  }

  messages[locale] = namespaces
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ko: messages.ko,
      en: messages.en
    },
    lng: 'ko',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;