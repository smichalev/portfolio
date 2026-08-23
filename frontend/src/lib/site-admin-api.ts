import { graphqlRequest } from "@/lib/graphql-client"
import {
  PROFILE_FIELDS,
  type ExperienceRaw,
  type ProfileFactRaw,
  type ProfileLanguageRaw,
  type ProfileRaw,
  type SkillGroupRaw,
  type SkillRaw,
} from "@/lib/site-data"

type Token = string | null

// ---- Profile ----

export type UpdateProfileFields = Partial<Omit<ProfileRaw, "id" | "facts" | "languages">>

export async function updateProfile(input: UpdateProfileFields, token: Token) {
  const data = await graphqlRequest<{ updateProfile: ProfileRaw }>(
    `mutation UpdateProfile($input: UpdateProfileInput!) { updateProfile(input: $input) { ${PROFILE_FIELDS} } }`,
    { input },
    token
  )
  return data.updateProfile
}

// ---- Profile facts ----

export async function createProfileFact(
  input: { textRu: string; textEn: string; order?: number },
  token: Token
) {
  const data = await graphqlRequest<{ createProfileFact: ProfileFactRaw }>(
    `mutation CreateProfileFact($input: CreateProfileFactInput!) {
      createProfileFact(input: $input) { id order textRu textEn }
    }`,
    { input },
    token
  )
  return data.createProfileFact
}

export async function updateProfileFact(
  id: string,
  input: { textRu?: string; textEn?: string; order?: number },
  token: Token
) {
  const data = await graphqlRequest<{ updateProfileFact: ProfileFactRaw }>(
    `mutation UpdateProfileFact($id: ID!, $input: UpdateProfileFactInput!) {
      updateProfileFact(id: $id, input: $input) { id order textRu textEn }
    }`,
    { id, input },
    token
  )
  return data.updateProfileFact
}

export async function deleteProfileFact(id: string, token: Token) {
  await graphqlRequest<{ deleteProfileFact: boolean }>(
    `mutation DeleteProfileFact($id: ID!) { deleteProfileFact(id: $id) }`,
    { id },
    token
  )
}

// ---- Profile languages ----

export async function createProfileLanguage(
  input: { nameRu: string; nameEn: string; levelRu: string; levelEn: string; order?: number },
  token: Token
) {
  const data = await graphqlRequest<{ createProfileLanguage: ProfileLanguageRaw }>(
    `mutation CreateProfileLanguage($input: CreateProfileLanguageInput!) {
      createProfileLanguage(input: $input) { id order nameRu nameEn levelRu levelEn }
    }`,
    { input },
    token
  )
  return data.createProfileLanguage
}

export async function updateProfileLanguage(
  id: string,
  input: { nameRu?: string; nameEn?: string; levelRu?: string; levelEn?: string; order?: number },
  token: Token
) {
  const data = await graphqlRequest<{ updateProfileLanguage: ProfileLanguageRaw }>(
    `mutation UpdateProfileLanguage($id: ID!, $input: UpdateProfileLanguageInput!) {
      updateProfileLanguage(id: $id, input: $input) { id order nameRu nameEn levelRu levelEn }
    }`,
    { id, input },
    token
  )
  return data.updateProfileLanguage
}

export async function deleteProfileLanguage(id: string, token: Token) {
  await graphqlRequest<{ deleteProfileLanguage: boolean }>(
    `mutation DeleteProfileLanguage($id: ID!) { deleteProfileLanguage(id: $id) }`,
    { id },
    token
  )
}

// ---- Skill groups ----

export async function createSkillGroup(
  input: { titleRu: string; titleEn: string; order?: number },
  token: Token
) {
  const data = await graphqlRequest<{ createSkillGroup: SkillGroupRaw }>(
    `mutation CreateSkillGroup($input: CreateSkillGroupInput!) {
      createSkillGroup(input: $input) {
        id order titleRu titleEn
        skills { id order nameRu nameEn skillGroupId }
      }
    }`,
    { input },
    token
  )
  return data.createSkillGroup
}

export async function updateSkillGroup(
  id: string,
  input: { titleRu?: string; titleEn?: string; order?: number },
  token: Token
) {
  const data = await graphqlRequest<{ updateSkillGroup: SkillGroupRaw }>(
    `mutation UpdateSkillGroup($id: ID!, $input: UpdateSkillGroupInput!) {
      updateSkillGroup(id: $id, input: $input) {
        id order titleRu titleEn
        skills { id order nameRu nameEn skillGroupId }
      }
    }`,
    { id, input },
    token
  )
  return data.updateSkillGroup
}

export async function deleteSkillGroup(id: string, token: Token) {
  await graphqlRequest<{ deleteSkillGroup: boolean }>(
    `mutation DeleteSkillGroup($id: ID!) { deleteSkillGroup(id: $id) }`,
    { id },
    token
  )
}

// ---- Skills ----

export async function createSkill(
  input: { skillGroupId: string; nameRu: string; nameEn: string; order?: number },
  token: Token
) {
  const data = await graphqlRequest<{ createSkill: SkillRaw }>(
    `mutation CreateSkill($input: CreateSkillInput!) {
      createSkill(input: $input) { id order nameRu nameEn skillGroupId }
    }`,
    { input },
    token
  )
  return data.createSkill
}

export async function updateSkill(
  id: string,
  input: { nameRu?: string; nameEn?: string; order?: number },
  token: Token
) {
  const data = await graphqlRequest<{ updateSkill: SkillRaw }>(
    `mutation UpdateSkill($id: ID!, $input: UpdateSkillInput!) {
      updateSkill(id: $id, input: $input) { id order nameRu nameEn skillGroupId }
    }`,
    { id, input },
    token
  )
  return data.updateSkill
}

export async function deleteSkill(id: string, token: Token) {
  await graphqlRequest<{ deleteSkill: boolean }>(
    `mutation DeleteSkill($id: ID!) { deleteSkill(id: $id) }`,
    { id },
    token
  )
}

// ---- Experience ----

const EXPERIENCE_FIELDS = `
  id order
  titleRu titleEn
  placeRu placeEn
  periodRu periodEn
  descriptionRu descriptionEn
`

export async function createExperience(
  input: {
    titleRu: string
    titleEn: string
    placeRu: string
    placeEn: string
    periodRu: string
    periodEn: string
    descriptionRu: string
    descriptionEn: string
    order?: number
  },
  token: Token
) {
  const data = await graphqlRequest<{ createExperience: ExperienceRaw }>(
    `mutation CreateExperience($input: CreateExperienceInput!) {
      createExperience(input: $input) { ${EXPERIENCE_FIELDS} }
    }`,
    { input },
    token
  )
  return data.createExperience
}

export async function updateExperience(
  id: string,
  input: Partial<{
    titleRu: string
    titleEn: string
    placeRu: string
    placeEn: string
    periodRu: string
    periodEn: string
    descriptionRu: string
    descriptionEn: string
    order: number
  }>,
  token: Token
) {
  const data = await graphqlRequest<{ updateExperience: ExperienceRaw }>(
    `mutation UpdateExperience($id: ID!, $input: UpdateExperienceInput!) {
      updateExperience(id: $id, input: $input) { ${EXPERIENCE_FIELDS} }
    }`,
    { id, input },
    token
  )
  return data.updateExperience
}

export async function deleteExperience(id: string, token: Token) {
  await graphqlRequest<{ deleteExperience: boolean }>(
    `mutation DeleteExperience($id: ID!) { deleteExperience(id: $id) }`,
    { id },
    token
  )
}
