import * as React from "react"
import { ArrowLeft, LogOut, Plus, Trash2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useAuth } from "@/lib/auth-context"
import { translateError } from "@/lib/error-messages"
import type { Lang } from "@/lib/lang"
import * as api from "@/lib/site-admin-api"
import { useSiteData, type ProfileRaw, type SiteDataRaw } from "@/lib/site-data"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function BilingualField({
  label,
  fieldRu,
  fieldEn,
  editLang,
  profile,
  onChange,
  onCommit,
  textarea,
  rows,
}: {
  label: string
  fieldRu: keyof ProfileRaw
  fieldEn: keyof ProfileRaw
  editLang: Lang
  profile: ProfileRaw
  onChange: (field: keyof ProfileRaw, value: string) => void
  onCommit: (field: keyof ProfileRaw, value: string) => void
  textarea?: boolean
  rows?: number
}) {
  const field = editLang === "ru" ? fieldRu : fieldEn
  const value = profile[field] as string
  const props = {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) =>
      onChange(field, e.target.value),
    onBlur: () => onCommit(field, value),
  }
  return (
    <Field label={label}>{textarea ? <Textarea rows={rows} {...props} /> : <Input {...props} />}</Field>
  )
}

function ContactField({
  label,
  field,
  profile,
  onChange,
  onCommit,
}: {
  label: string
  field: "email" | "phone" | "telegram" | "github" | "avatarUrl"
  profile: ProfileRaw
  onChange: (field: keyof ProfileRaw, value: string) => void
  onCommit: (field: keyof ProfileRaw, value: string) => void
}) {
  const value = profile[field]
  return (
    <Field label={label}>
      <Input
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        onBlur={() => onCommit(field, value)}
      />
    </Field>
  )
}

function AdminPage() {
  const { data, loading, error } = useSiteData()
  const { accessToken, logout } = useAuth()
  const navigate = useNavigate()

  const [editLang, setEditLang] = React.useState<Lang>("ru")
  const [draft, setDraft] = React.useState<SiteDataRaw | null>(null)
  const [saveError, setSaveError] = React.useState<string | null>(null)

  const hasSeededRef = React.useRef(false)
  React.useEffect(() => {
    if (data && !hasSeededRef.current) {
      hasSeededRef.current = true
      setDraft(data)
    }
  }, [data])

  const reportError = (err: unknown) => {
    setSaveError(translateError(err instanceof Error ? err.message : undefined, editLang))
  }

  const handleLogout = async () => {
    navigate("/", { replace: true })
    await logout()
  }

  // ---- Profile scalar fields ----

  const setProfileField = (field: keyof ProfileRaw, value: string) => {
    setDraft((prev) => (prev ? { ...prev, profile: { ...prev.profile, [field]: value } } : prev))
  }

  const commitProfileField = async (field: keyof ProfileRaw, value: string) => {
    setSaveError(null)
    try {
      await api.updateProfile({ [field]: value }, accessToken)
    } catch (err) {
      reportError(err)
    }
  }

  // ---- Facts ----

  const addFact = async () => {
    setSaveError(null)
    try {
      const created = await api.createProfileFact(
        { textRu: "Новый факт", textEn: "New fact", order: draft?.profile.facts.length ?? 0 },
        accessToken
      )
      setDraft((prev) =>
        prev ? { ...prev, profile: { ...prev.profile, facts: [...prev.profile.facts, created] } } : prev
      )
    } catch (err) {
      reportError(err)
    }
  }

  const removeFact = async (id: string) => {
    setSaveError(null)
    try {
      await api.deleteProfileFact(id, accessToken)
      setDraft((prev) =>
        prev
          ? { ...prev, profile: { ...prev.profile, facts: prev.profile.facts.filter((f) => f.id !== id) } }
          : prev
      )
    } catch (err) {
      reportError(err)
    }
  }

  const setFactField = (id: string, field: "textRu" | "textEn", value: string) => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            profile: {
              ...prev.profile,
              facts: prev.profile.facts.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
            },
          }
        : prev
    )
  }

  const commitFactField = async (id: string, field: "textRu" | "textEn", value: string) => {
    setSaveError(null)
    try {
      await api.updateProfileFact(id, { [field]: value }, accessToken)
    } catch (err) {
      reportError(err)
    }
  }

  // ---- Languages ----

  const addLanguage = async () => {
    setSaveError(null)
    try {
      const created = await api.createProfileLanguage(
        {
          nameRu: "Язык",
          nameEn: "Language",
          levelRu: "Уровень",
          levelEn: "Level",
          order: draft?.profile.languages.length ?? 0,
        },
        accessToken
      )
      setDraft((prev) =>
        prev
          ? { ...prev, profile: { ...prev.profile, languages: [...prev.profile.languages, created] } }
          : prev
      )
    } catch (err) {
      reportError(err)
    }
  }

  const removeLanguage = async (id: string) => {
    setSaveError(null)
    try {
      await api.deleteProfileLanguage(id, accessToken)
      setDraft((prev) =>
        prev
          ? {
              ...prev,
              profile: { ...prev.profile, languages: prev.profile.languages.filter((l) => l.id !== id) },
            }
          : prev
      )
    } catch (err) {
      reportError(err)
    }
  }

  const setLanguageField = (
    id: string,
    field: "nameRu" | "nameEn" | "levelRu" | "levelEn",
    value: string
  ) => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            profile: {
              ...prev.profile,
              languages: prev.profile.languages.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
            },
          }
        : prev
    )
  }

  const commitLanguageField = async (
    id: string,
    field: "nameRu" | "nameEn" | "levelRu" | "levelEn",
    value: string
  ) => {
    setSaveError(null)
    try {
      await api.updateProfileLanguage(id, { [field]: value }, accessToken)
    } catch (err) {
      reportError(err)
    }
  }

  // ---- Skill groups & skills ----

  const addSkillGroup = async () => {
    setSaveError(null)
    try {
      const created = await api.createSkillGroup(
        { titleRu: "Новая группа", titleEn: "New group", order: draft?.skillGroups.length ?? 0 },
        accessToken
      )
      setDraft((prev) => (prev ? { ...prev, skillGroups: [...prev.skillGroups, created] } : prev))
    } catch (err) {
      reportError(err)
    }
  }

  const removeSkillGroup = async (id: string) => {
    setSaveError(null)
    try {
      await api.deleteSkillGroup(id, accessToken)
      setDraft((prev) =>
        prev ? { ...prev, skillGroups: prev.skillGroups.filter((g) => g.id !== id) } : prev
      )
    } catch (err) {
      reportError(err)
    }
  }

  const setSkillGroupField = (id: string, field: "titleRu" | "titleEn", value: string) => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            skillGroups: prev.skillGroups.map((g) => (g.id === id ? { ...g, [field]: value } : g)),
          }
        : prev
    )
  }

  const commitSkillGroupField = async (id: string, field: "titleRu" | "titleEn", value: string) => {
    setSaveError(null)
    try {
      await api.updateSkillGroup(id, { [field]: value }, accessToken)
    } catch (err) {
      reportError(err)
    }
  }

  const addSkill = async (groupId: string, order: number) => {
    setSaveError(null)
    try {
      const created = await api.createSkill(
        { skillGroupId: groupId, nameRu: "Навык", nameEn: "Skill", order },
        accessToken
      )
      setDraft((prev) =>
        prev
          ? {
              ...prev,
              skillGroups: prev.skillGroups.map((g) =>
                g.id === groupId ? { ...g, skills: [...g.skills, created] } : g
              ),
            }
          : prev
      )
    } catch (err) {
      reportError(err)
    }
  }

  const removeSkill = async (groupId: string, skillId: string) => {
    setSaveError(null)
    try {
      await api.deleteSkill(skillId, accessToken)
      setDraft((prev) =>
        prev
          ? {
              ...prev,
              skillGroups: prev.skillGroups.map((g) =>
                g.id === groupId ? { ...g, skills: g.skills.filter((s) => s.id !== skillId) } : g
              ),
            }
          : prev
      )
    } catch (err) {
      reportError(err)
    }
  }

  const setSkillField = (groupId: string, skillId: string, field: "nameRu" | "nameEn", value: string) => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            skillGroups: prev.skillGroups.map((g) =>
              g.id === groupId
                ? { ...g, skills: g.skills.map((s) => (s.id === skillId ? { ...s, [field]: value } : s)) }
                : g
            ),
          }
        : prev
    )
  }

  const commitSkillField = async (skillId: string, field: "nameRu" | "nameEn", value: string) => {
    setSaveError(null)
    try {
      await api.updateSkill(skillId, { [field]: value }, accessToken)
    } catch (err) {
      reportError(err)
    }
  }

  // ---- Experience ----

  const addExperience = async () => {
    setSaveError(null)
    try {
      const created = await api.createExperience(
        {
          titleRu: "Новая позиция",
          titleEn: "New position",
          placeRu: "—",
          placeEn: "—",
          periodRu: "—",
          periodEn: "—",
          descriptionRu: "—",
          descriptionEn: "—",
          order: draft?.experience.length ?? 0,
        },
        accessToken
      )
      setDraft((prev) => (prev ? { ...prev, experience: [...prev.experience, created] } : prev))
    } catch (err) {
      reportError(err)
    }
  }

  const removeExperience = async (id: string) => {
    setSaveError(null)
    try {
      await api.deleteExperience(id, accessToken)
      setDraft((prev) => (prev ? { ...prev, experience: prev.experience.filter((e) => e.id !== id) } : prev))
    } catch (err) {
      reportError(err)
    }
  }

  type ExperienceField =
    | "titleRu"
    | "titleEn"
    | "placeRu"
    | "placeEn"
    | "periodRu"
    | "periodEn"
    | "descriptionRu"
    | "descriptionEn"

  const setExperienceField = (id: string, field: ExperienceField, value: string) => {
    setDraft((prev) =>
      prev
        ? { ...prev, experience: prev.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)) }
        : prev
    )
  }

  const commitExperienceField = async (id: string, field: ExperienceField, value: string) => {
    setSaveError(null)
    try {
      await api.updateExperience(id, { [field]: value }, accessToken)
    } catch (err) {
      reportError(err)
    }
  }

  if (loading && !draft) {
    return (
      <div className="bg-background text-foreground flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm">Загрузка…</p>
      </div>
    )
  }

  if (error && !draft) {
    return (
      <div className="bg-background text-foreground flex min-h-screen items-center justify-center px-6 text-center">
        <p className="text-muted-foreground text-sm">
          Не удалось загрузить данные. ({translateError(error, editLang)})
        </p>
      </div>
    )
  }

  if (!draft) return null

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-6 pt-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">
            <ArrowLeft />
            На сайт
          </Link>
        </Button>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end gap-1">
            <span className="text-muted-foreground text-xs">Редактируете версию</span>
            <LanguageSwitcher lang={editLang} onChange={setEditLang} />
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut />
            Выйти
          </Button>
        </div>
      </div>

      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 pt-6 pb-16">
        {saveError && <p className="text-destructive text-sm">{saveError}</p>}

        <Card>
          <CardHeader>
            <CardTitle>Аватар</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Avatar className="size-16 shrink-0 text-lg">
              <AvatarImage src={draft.profile.avatarUrl} alt="" />
              <AvatarFallback>
                {(editLang === "ru" ? draft.profile.nameRu : draft.profile.nameEn)
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <ContactField
                label="Ссылка на изображение"
                field="avatarUrl"
                profile={draft.profile}
                onChange={setProfileField}
                onCommit={commitProfileField}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Контакты</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <ContactField
              label="Email"
              field="email"
              profile={draft.profile}
              onChange={setProfileField}
              onCommit={commitProfileField}
            />
            <ContactField
              label="Телефон"
              field="phone"
              profile={draft.profile}
              onChange={setProfileField}
              onCommit={commitProfileField}
            />
            <ContactField
              label="Telegram (ссылка)"
              field="telegram"
              profile={draft.profile}
              onChange={setProfileField}
              onCommit={commitProfileField}
            />
            <ContactField
              label="GitHub (ссылка)"
              field="github"
              profile={draft.profile}
              onChange={setProfileField}
              onCommit={commitProfileField}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Основное</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <BilingualField
                label="Имя"
                fieldRu="nameRu"
                fieldEn="nameEn"
                editLang={editLang}
                profile={draft.profile}
                onChange={setProfileField}
                onCommit={commitProfileField}
              />
              <BilingualField
                label="Должность"
                fieldRu="roleRu"
                fieldEn="roleEn"
                editLang={editLang}
                profile={draft.profile}
                onChange={setProfileField}
                onCommit={commitProfileField}
              />
            </div>
            <BilingualField
              label="Локация"
              fieldRu="locationRu"
              fieldEn="locationEn"
              editLang={editLang}
              profile={draft.profile}
              onChange={setProfileField}
              onCommit={commitProfileField}
            />

            <div className="flex flex-col gap-2">
              <Label>Факты (бейджи под должностью)</Label>
              {draft.profile.facts.map((fact) => {
                const field = editLang === "ru" ? "textRu" : "textEn"
                const value = fact[field]
                return (
                  <div key={fact.id} className="flex gap-2">
                    <Input
                      value={value}
                      onChange={(e) => setFactField(fact.id, field, e.target.value)}
                      onBlur={() => void commitFactField(fact.id, field, value)}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => void removeFact(fact.id)}
                      aria-label="Удалить факт"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                )
              })}
              <Button variant="secondary" size="sm" className="self-start" onClick={() => void addFact()}>
                <Plus />
                Добавить факт
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Обо мне</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <BilingualField
              label="Краткое описание"
              fieldRu="bioShortRu"
              fieldEn="bioShortEn"
              editLang={editLang}
              profile={draft.profile}
              onChange={setProfileField}
              onCommit={commitProfileField}
              textarea
              rows={3}
            />
            <BilingualField
              label="Полное описание (в диалоге «Подробнее»)"
              fieldRu="bioFullRu"
              fieldEn="bioFullEn"
              editLang={editLang}
              profile={draft.profile}
              onChange={setProfileField}
              onCommit={commitProfileField}
              textarea
              rows={10}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Навыки</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {draft.skillGroups.map((group) => {
              const titleField = editLang === "ru" ? "titleRu" : "titleEn"
              const titleValue = group[titleField]
              const nameField = editLang === "ru" ? "nameRu" : "nameEn"
              return (
                <div key={group.id} className="flex flex-col gap-2 rounded-lg border p-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Название группы"
                      value={titleValue}
                      onChange={(e) => setSkillGroupField(group.id, titleField, e.target.value)}
                      onBlur={() => void commitSkillGroupField(group.id, titleField, titleValue)}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => void removeSkillGroup(group.id)}
                      aria-label="Удалить группу"
                    >
                      <Trash2 />
                    </Button>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {group.skills.map((skill) => {
                      const value = skill[nameField]
                      return (
                        <div key={skill.id} className="flex gap-2">
                          <Input
                            value={value}
                            onChange={(e) => setSkillField(group.id, skill.id, nameField, e.target.value)}
                            onBlur={() => void commitSkillField(skill.id, nameField, value)}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => void removeSkill(group.id, skill.id)}
                            aria-label="Удалить навык"
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      )
                    })}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="self-start"
                      onClick={() => void addSkill(group.id, group.skills.length)}
                    >
                      <Plus />
                      Добавить навык
                    </Button>
                  </div>
                </div>
              )
            })}
            <Button variant="secondary" size="sm" className="self-start" onClick={() => void addSkillGroup()}>
              <Plus />
              Добавить группу
            </Button>

            <Separator />

            <Label>Языки</Label>
            {draft.profile.languages.map((item) => {
              const nameField = editLang === "ru" ? "nameRu" : "nameEn"
              const levelField = editLang === "ru" ? "levelRu" : "levelEn"
              const nameValue = item[nameField]
              const levelValue = item[levelField]
              return (
                <div key={item.id} className="flex gap-2">
                  <Input
                    placeholder="Язык"
                    value={nameValue}
                    onChange={(e) => setLanguageField(item.id, nameField, e.target.value)}
                    onBlur={() => void commitLanguageField(item.id, nameField, nameValue)}
                  />
                  <Input
                    placeholder="Уровень"
                    value={levelValue}
                    onChange={(e) => setLanguageField(item.id, levelField, e.target.value)}
                    onBlur={() => void commitLanguageField(item.id, levelField, levelValue)}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => void removeLanguage(item.id)}
                    aria-label="Удалить язык"
                  >
                    <Trash2 />
                  </Button>
                </div>
              )
            })}
            <Button variant="secondary" size="sm" className="self-start" onClick={() => void addLanguage()}>
              <Plus />
              Добавить язык
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Опыт работы</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {draft.experience.map((item) => {
              const titleField = editLang === "ru" ? "titleRu" : "titleEn"
              const placeField = editLang === "ru" ? "placeRu" : "placeEn"
              const periodField = editLang === "ru" ? "periodRu" : "periodEn"
              const descriptionField = editLang === "ru" ? "descriptionRu" : "descriptionEn"
              const titleValue = item[titleField]
              const placeValue = item[placeField]
              const periodValue = item[periodField]
              const descriptionValue = item[descriptionField]
              return (
                <div key={item.id} className="flex flex-col gap-2 rounded-lg border p-3">
                  <div className="grid gap-2 sm:grid-cols-3">
                    <Input
                      placeholder="Должность"
                      value={titleValue}
                      onChange={(e) => setExperienceField(item.id, titleField, e.target.value)}
                      onBlur={() => void commitExperienceField(item.id, titleField, titleValue)}
                    />
                    <Input
                      placeholder="Компания"
                      value={placeValue}
                      onChange={(e) => setExperienceField(item.id, placeField, e.target.value)}
                      onBlur={() => void commitExperienceField(item.id, placeField, placeValue)}
                    />
                    <Input
                      placeholder="Период"
                      value={periodValue}
                      onChange={(e) => setExperienceField(item.id, periodField, e.target.value)}
                      onBlur={() => void commitExperienceField(item.id, periodField, periodValue)}
                    />
                  </div>
                  <Textarea
                    rows={3}
                    placeholder="Описание"
                    value={descriptionValue}
                    onChange={(e) => setExperienceField(item.id, descriptionField, e.target.value)}
                    onBlur={() => void commitExperienceField(item.id, descriptionField, descriptionValue)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="self-start"
                    onClick={() => void removeExperience(item.id)}
                  >
                    <Trash2 />
                    Удалить место работы
                  </Button>
                </div>
              )
            })}
            <Button variant="secondary" size="sm" className="self-start" onClick={() => void addExperience()}>
              <Plus />
              Добавить место работы
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Образование</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <BilingualField
              label="Учебное заведение"
              fieldRu="educationPlaceRu"
              fieldEn="educationPlaceEn"
              editLang={editLang}
              profile={draft.profile}
              onChange={setProfileField}
              onCommit={commitProfileField}
            />
            <BilingualField
              label="Город"
              fieldRu="educationCityRu"
              fieldEn="educationCityEn"
              editLang={editLang}
              profile={draft.profile}
              onChange={setProfileField}
              onCommit={commitProfileField}
            />
            <Field label="Год окончания">
              <Input
                value={draft.profile.educationYear}
                onChange={(e) => setProfileField("educationYear", e.target.value)}
                onBlur={() => void commitProfileField("educationYear", draft.profile.educationYear)}
              />
            </Field>
            <BilingualField
              label="Уровень образования"
              fieldRu="educationDegreeRu"
              fieldEn="educationDegreeEn"
              editLang={editLang}
              profile={draft.profile}
              onChange={setProfileField}
              onCommit={commitProfileField}
            />
            <div className="sm:col-span-2">
              <BilingualField
                label="Специальность"
                fieldRu="educationMajorRu"
                fieldEn="educationMajorEn"
                editLang={editLang}
                profile={draft.profile}
                onChange={setProfileField}
                onCommit={commitProfileField}
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default AdminPage
