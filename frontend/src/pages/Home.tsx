import { Briefcase, GraduationCap, Mail, MapPin, Phone, Send } from "lucide-react"
import { Link } from "react-router-dom"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { LanguageSwitcher } from "@/components/language-switcher"
import { GithubIcon } from "@/components/icons/github"
import { useAuth } from "@/lib/auth-context"
import { translateError } from "@/lib/error-messages"
import { useLang, type Lang } from "@/lib/lang"
import { pickContact, pickResume, useSiteData } from "@/lib/site-data"

type Chrome = {
  bioTitle: string
  more: string
  skillsTab: string
  experienceTab: string
  languagesTitle: string
  telegram: string
  login: string
  edit: string
  loading: string
  loadError: string
}

const CHROME: Record<Lang, Chrome> = {
  ru: {
    bioTitle: "Обо мне",
    more: "Подробнее",
    skillsTab: "Навыки",
    experienceTab: "Опыт",
    languagesTitle: "Языки",
    telegram: "Telegram",
    login: "Войти",
    edit: "Редактировать",
    loading: "Загрузка…",
    loadError: "Не удалось загрузить данные сайта.",
  },
  en: {
    bioTitle: "About me",
    more: "Read more",
    skillsTab: "Skills",
    experienceTab: "Experience",
    languagesTitle: "Languages",
    telegram: "Telegram",
    login: "Log in",
    edit: "Edit",
    loading: "Loading…",
    loadError: "Could not load site data.",
  },
}

function HomePage() {
  const [lang, setLang] = useLang()
  const { status } = useAuth()
  const { data, loading, error } = useSiteData()
  const c = CHROME[lang]

  if (loading || !data) {
    return (
      <div className="bg-background text-foreground flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm">{c.loading}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-background text-foreground flex min-h-screen items-center justify-center px-6 text-center">
        <p className="text-muted-foreground text-sm">
          {c.loadError} ({translateError(error, lang)})
        </p>
      </div>
    )
  }

  const t = pickResume(data, lang)
  const contact = pickContact(data)

  const initials = t.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  const contacts = [
    { label: contact.email, href: `mailto:${contact.email}`, icon: Mail },
    {
      label: contact.phone,
      href: `tel:${contact.phone.replace(/[^\d+]/g, "")}`,
      icon: Phone,
    },
    { label: c.telegram, href: contact.telegram, icon: Send },
    { label: "GitHub", href: contact.github, icon: GithubIcon },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-2xl justify-end px-6 pt-6">
        <LanguageSwitcher lang={lang} onChange={setLang} />
      </div>

      <main className="mx-auto flex max-w-2xl flex-col gap-10 px-6 pt-6 pb-16">
        <section className="flex flex-col items-center gap-4 text-center">
          <Avatar className="size-24 text-2xl">
            <AvatarImage src={contact.avatarUrl} alt={t.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.name}</h1>
            <p className="text-muted-foreground mt-1 text-lg">{t.role}</p>
            <p className="text-muted-foreground mt-1 flex items-center justify-center gap-1 text-sm">
              <MapPin className="size-3.5" />
              {t.location}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-1.5">
            {t.facts.map((fact) => (
              <Badge key={fact.id} variant="outline">
                {fact.text}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            {contacts.map(({ label, href, icon: Icon }) => (
              <Tooltip key={label}>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" asChild>
                    <a href={href} target="_blank" rel="noreferrer" aria-label={label}>
                      <Icon />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </section>

        <Separator />

        <section>
          <Card>
            <CardHeader>
              <CardTitle>{c.bioTitle}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-muted-foreground leading-relaxed">{t.bioShort}</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm" className="self-start">
                    {c.more}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t.name}</DialogTitle>
                    <DialogDescription>{t.role}</DialogDescription>
                  </DialogHeader>
                  <p className="text-muted-foreground max-h-[60vh] overflow-y-auto whitespace-pre-line text-sm leading-relaxed">
                    {t.bioFull}
                  </p>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </section>

        <section>
          <Tabs defaultValue="skills">
            <TabsList className="w-full">
              <TabsTrigger value="skills">{c.skillsTab}</TabsTrigger>
              <TabsTrigger value="experience">{c.experienceTab}</TabsTrigger>
            </TabsList>

            <TabsContent value="skills" className="mt-4">
              <Card>
                <CardContent className="flex flex-col gap-5 pt-6">
                  {t.skillGroups.map((group) => (
                    <div key={group.id} className="flex flex-col gap-2">
                      <h3 className="text-sm font-medium">{group.title}</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {group.skills.map((skill) => (
                          <Badge key={skill.id} variant="secondary">
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-medium">{c.languagesTitle}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {t.languages.map((item) => (
                        <Badge key={item.id} variant="outline">
                          {item.name} — {item.level}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <Accordion type="single" collapsible defaultValue="item-0">
                    {t.experience.map((item, index) => (
                      <AccordionItem key={item.id} value={`item-${index}`}>
                        <AccordionTrigger>
                          <div className="flex items-start gap-3 text-left">
                            <Briefcase className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                            <div className="flex flex-col">
                              <span>{item.title}</span>
                              <span className="text-muted-foreground text-xs font-normal">
                                {item.place} · {item.period}
                              </span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pl-7">
                          {item.description}
                        </AccordionContent>
                      </AccordionItem>
                    ))}

                    <AccordionItem value="education">
                      <AccordionTrigger>
                        <div className="flex items-start gap-3 text-left">
                          <GraduationCap className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                          <div className="flex flex-col">
                            <span>{t.education.degree}</span>
                            <span className="text-muted-foreground text-xs font-normal">
                              {t.education.place}, {t.education.city} · {t.education.year}
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pl-7">
                        {t.education.major}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <footer className="text-muted-foreground flex flex-col items-center gap-2 pt-4 text-center text-sm">
          <span>
            © {new Date().getFullYear()} {t.name}
          </span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground/50">
            {status === "authenticated" ? (
              <Link to="/admin" className="hover:text-muted-foreground transition-colors">
                {c.edit}
              </Link>
            ) : (
              <Link to="/login" className="hover:text-muted-foreground transition-colors">
                {c.login}
              </Link>
            )}
          </div>
        </footer>
      </main>
    </div>
  )
}

export default HomePage
