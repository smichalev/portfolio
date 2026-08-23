import { ArrowLeft, Compass } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLang, type Lang } from "@/lib/lang"

type Content = {
  title: string
  description: string
  backLink: string
}

const CONTENT: Record<Lang, Content> = {
  ru: {
    title: "Страница не найдена",
    description: "Такой страницы не существует — возможно, она была перемещена или удалена.",
    backLink: "На главную",
  },
  en: {
    title: "Page not found",
    description: "This page doesn't exist — it may have been moved or removed.",
    backLink: "Back home",
  },
}

function NotFoundPage() {
  const [lang, setLang] = useLang()
  const t = CONTENT[lang]

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-2xl justify-end px-6 pt-6">
        <LanguageSwitcher lang={lang} onChange={setLang} />
      </div>

      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <div className="bg-muted flex size-16 items-center justify-center rounded-full">
          <Compass className="text-muted-foreground size-8" />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-sm font-medium tracking-widest">404</p>
          <h1 className="text-2xl font-bold tracking-tight">{t.title}</h1>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
            {t.description}
          </p>
        </div>

        <Button asChild>
          <Link to="/">
            <ArrowLeft />
            {t.backLink}
          </Link>
        </Button>
      </main>
    </div>
  )
}

export default NotFoundPage
