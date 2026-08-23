import * as React from "react"
import { ArrowLeft, LogIn } from "lucide-react"
import { Link, useLocation, useNavigate, type Location } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useAuth } from "@/lib/auth-context"
import { translateError } from "@/lib/error-messages"
import { useLang, type Lang } from "@/lib/lang"

type Content = {
  backLink: string
  title: string
  description: string
  emailLabel: string
  passwordLabel: string
  submit: string
  submitting: string
}

const CONTENT: Record<Lang, Content> = {
  ru: {
    backLink: "На главную",
    title: "Вход",
    description: "Войдите, чтобы продолжить",
    emailLabel: "Email",
    passwordLabel: "Пароль",
    submit: "Войти",
    submitting: "Входим…",
  },
  en: {
    backLink: "Back home",
    title: "Sign in",
    description: "Sign in to continue",
    emailLabel: "Email",
    passwordLabel: "Password",
    submit: "Sign in",
    submitting: "Signing in…",
  },
}

function LoginPage() {
  const [lang, setLang] = useLang()
  const t = CONTENT[lang]
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as Location & { state?: { from?: Location } }

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
      const redirectTo = location.state?.from?.pathname ?? "/admin"
      navigate(redirectTo, { replace: true })
    } catch (err) {
      const code = err instanceof Error ? err.message : undefined
      setError(translateError(code, lang))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 pt-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">
            <ArrowLeft />
            {t.backLink}
          </Link>
        </Button>
        <LanguageSwitcher lang={lang} onChange={setLang} />
      </div>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">{t.emailLabel}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">{t.passwordLabel}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button type="submit" className="mt-1" disabled={submitting}>
                <LogIn />
                {submitting ? t.submitting : t.submit}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default LoginPage
