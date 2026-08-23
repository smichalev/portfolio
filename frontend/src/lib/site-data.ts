import * as React from "react"

import { graphqlRequest } from "@/lib/graphql-client"
import type { Lang } from "@/lib/lang"

// ---- Raw shapes, mirroring the backend GraphQL schema exactly ----

export type ProfileFactRaw = { id: string; order: number; textRu: string; textEn: string }

export type ProfileLanguageRaw = {
  id: string
  order: number
  nameRu: string
  nameEn: string
  levelRu: string
  levelEn: string
}

export type ProfileRaw = {
  id: string
  nameRu: string
  nameEn: string
  roleRu: string
  roleEn: string
  locationRu: string
  locationEn: string
  avatarUrl: string
  bioShortRu: string
  bioShortEn: string
  bioFullRu: string
  bioFullEn: string
  email: string
  phone: string
  telegram: string
  github: string
  educationPlaceRu: string
  educationPlaceEn: string
  educationCityRu: string
  educationCityEn: string
  educationYear: string
  educationDegreeRu: string
  educationDegreeEn: string
  educationMajorRu: string
  educationMajorEn: string
  facts: ProfileFactRaw[]
  languages: ProfileLanguageRaw[]
}

export type SkillRaw = {
  id: string
  order: number
  nameRu: string
  nameEn: string
  skillGroupId: string
}

export type SkillGroupRaw = {
  id: string
  order: number
  titleRu: string
  titleEn: string
  skills: SkillRaw[]
}

export type ExperienceRaw = {
  id: string
  order: number
  titleRu: string
  titleEn: string
  placeRu: string
  placeEn: string
  periodRu: string
  periodEn: string
  descriptionRu: string
  descriptionEn: string
}

export type SiteDataRaw = {
  profile: ProfileRaw
  skillGroups: SkillGroupRaw[]
  experience: ExperienceRaw[]
}

// ---- Per-language view model, consumed by the public site (Home.tsx) ----

export type Fact = { id: string; text: string }
export type Skill = { id: string; name: string }
export type SkillGroup = { id: string; title: string; skills: Skill[] }
export type LanguageSkill = { id: string; name: string; level: string }
export type Experience = {
  id: string
  title: string
  place: string
  period: string
  description: string
}
export type Education = {
  place: string
  city: string
  year: string
  degree: string
  major: string
}
export type ResumeContent = {
  name: string
  role: string
  location: string
  facts: Fact[]
  bioShort: string
  bioFull: string
  skillGroups: SkillGroup[]
  languages: LanguageSkill[]
  experience: Experience[]
  education: Education
}
export type ContactInfo = {
  email: string
  phone: string
  telegram: string
  github: string
  avatarUrl: string
}

export function pickResume(data: SiteDataRaw, lang: Lang): ResumeContent {
  const p = data.profile
  const isRu = lang === "ru"
  return {
    name: isRu ? p.nameRu : p.nameEn,
    role: isRu ? p.roleRu : p.roleEn,
    location: isRu ? p.locationRu : p.locationEn,
    facts: p.facts.map((f) => ({ id: f.id, text: isRu ? f.textRu : f.textEn })),
    bioShort: isRu ? p.bioShortRu : p.bioShortEn,
    bioFull: isRu ? p.bioFullRu : p.bioFullEn,
    skillGroups: data.skillGroups.map((g) => ({
      id: g.id,
      title: isRu ? g.titleRu : g.titleEn,
      skills: g.skills.map((s) => ({ id: s.id, name: isRu ? s.nameRu : s.nameEn })),
    })),
    languages: p.languages.map((l) => ({
      id: l.id,
      name: isRu ? l.nameRu : l.nameEn,
      level: isRu ? l.levelRu : l.levelEn,
    })),
    experience: data.experience.map((e) => ({
      id: e.id,
      title: isRu ? e.titleRu : e.titleEn,
      place: isRu ? e.placeRu : e.placeEn,
      period: isRu ? e.periodRu : e.periodEn,
      description: isRu ? e.descriptionRu : e.descriptionEn,
    })),
    education: {
      place: isRu ? p.educationPlaceRu : p.educationPlaceEn,
      city: isRu ? p.educationCityRu : p.educationCityEn,
      year: p.educationYear,
      degree: isRu ? p.educationDegreeRu : p.educationDegreeEn,
      major: isRu ? p.educationMajorRu : p.educationMajorEn,
    },
  }
}

export function pickContact(data: SiteDataRaw): ContactInfo {
  return {
    email: data.profile.email,
    phone: data.profile.phone,
    telegram: data.profile.telegram,
    github: data.profile.github,
    avatarUrl: data.profile.avatarUrl,
  }
}

// ---- Fetching ----

export const PROFILE_FIELDS = `
  id
  nameRu nameEn
  roleRu roleEn
  locationRu locationEn
  avatarUrl
  bioShortRu bioShortEn
  bioFullRu bioFullEn
  email phone telegram github
  educationPlaceRu educationPlaceEn
  educationCityRu educationCityEn
  educationYear
  educationDegreeRu educationDegreeEn
  educationMajorRu educationMajorEn
  facts { id order textRu textEn }
  languages { id order nameRu nameEn levelRu levelEn }
`

// One request, one GraphQL document, three root fields — the whole point
// of GraphQL is that this doesn't need three separate round-trips.
const SITE_DATA_QUERY = `
  query SiteData {
    profile { ${PROFILE_FIELDS} }
    skillGroups {
      id order titleRu titleEn
      skills { id order nameRu nameEn skillGroupId }
    }
    experience {
      id order
      titleRu titleEn
      placeRu placeEn
      periodRu periodEn
      descriptionRu descriptionEn
    }
  }
`

async function fetchSiteData(): Promise<SiteDataRaw> {
  return graphqlRequest<SiteDataRaw>(SITE_DATA_QUERY)
}

export function useSiteData() {
  const [data, setData] = React.useState<SiteDataRaw | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | undefined>(undefined)

  const load = React.useCallback(async () => {
    setLoading(true)
    setError(undefined)
    try {
      setData(await fetchSiteData())
    } catch (err) {
      setError(err instanceof Error ? err.message : "NETWORK_ERROR")
    } finally {
      setLoading(false)
    }
  }, [])

  const hasLoadedRef = React.useRef(false)

  React.useEffect(() => {
    // Guard against React StrictMode's double effect invocation in dev.
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true
    void load()
  }, [load])

  return { data, loading, error, refetch: load }
}
