import { Injectable, NotFoundException } from "@nestjs/common"

import { ErrorCode } from "../common/error-codes"
import { PrismaService } from "../prisma/prisma.service"
import { CreateProfileFactInput } from "./dto/create-profile-fact.input"
import { CreateProfileLanguageInput } from "./dto/create-profile-language.input"
import { UpdateProfileFactInput } from "./dto/update-profile-fact.input"
import { UpdateProfileLanguageInput } from "./dto/update-profile-language.input"
import { UpdateProfileInput } from "./dto/update-profile.input"

const MAIN_PROFILE_ID = "main"

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly includeRelations = {
    facts: { orderBy: { order: "asc" as const } },
    languages: { orderBy: { order: "asc" as const } },
  }

  getProfile() {
    return this.prisma.profile.upsert({
      where: { id: MAIN_PROFILE_ID },
      update: {},
      create: { id: MAIN_PROFILE_ID },
      include: this.includeRelations,
    })
  }

  updateProfile(input: UpdateProfileInput) {
    return this.prisma.profile.upsert({
      where: { id: MAIN_PROFILE_ID },
      update: input,
      create: { id: MAIN_PROFILE_ID, ...input },
      include: this.includeRelations,
    })
  }

  async createFact(input: CreateProfileFactInput) {
    await this.ensureProfileExists()
    return this.prisma.profileFact.create({
      data: { ...input, profileId: MAIN_PROFILE_ID },
    })
  }

  async updateFact(id: string, input: UpdateProfileFactInput) {
    await this.ensureFactExists(id)
    return this.prisma.profileFact.update({ where: { id }, data: input })
  }

  async deleteFact(id: string) {
    await this.ensureFactExists(id)
    await this.prisma.profileFact.delete({ where: { id } })
    return true
  }

  async createLanguage(input: CreateProfileLanguageInput) {
    await this.ensureProfileExists()
    return this.prisma.profileLanguage.create({
      data: { ...input, profileId: MAIN_PROFILE_ID },
    })
  }

  async updateLanguage(id: string, input: UpdateProfileLanguageInput) {
    await this.ensureLanguageExists(id)
    return this.prisma.profileLanguage.update({ where: { id }, data: input })
  }

  async deleteLanguage(id: string) {
    await this.ensureLanguageExists(id)
    await this.prisma.profileLanguage.delete({ where: { id } })
    return true
  }

  private async ensureProfileExists() {
    await this.prisma.profile.upsert({
      where: { id: MAIN_PROFILE_ID },
      update: {},
      create: { id: MAIN_PROFILE_ID },
    })
  }

  private async ensureFactExists(id: string) {
    const fact = await this.prisma.profileFact.findUnique({ where: { id } })
    if (!fact) throw new NotFoundException(ErrorCode.PROFILE_FACT_NOT_FOUND)
  }

  private async ensureLanguageExists(id: string) {
    const language = await this.prisma.profileLanguage.findUnique({ where: { id } })
    if (!language) throw new NotFoundException(ErrorCode.PROFILE_LANGUAGE_NOT_FOUND)
  }
}
