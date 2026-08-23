import * as React from "react"

export type Lang = "ru" | "en"

const LANG_STORAGE_KEY = "lang"

export function getInitialLang(): Lang {
  const stored = localStorage.getItem(LANG_STORAGE_KEY)
  if (stored === "ru" || stored === "en") return stored
  return navigator.language.toLowerCase().startsWith("ru") ? "ru" : "en"
}

export function useLang() {
  const [lang, setLang] = React.useState<Lang>(getInitialLang)

  React.useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  return [lang, setLang] as const
}
