import { Injectable, NotFoundException } from "@nestjs/common"

import { ErrorCode } from "../common/error-codes"
import { PrismaService } from "../prisma/prisma.service"
import { CreateExperienceInput } from "./dto/create-experience.input"
import { UpdateExperienceInput } from "./dto/update-experience.input"

@Injectable()
export class ExperienceService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.experience.findMany({ orderBy: { order: "asc" } })
  }

  create(input: CreateExperienceInput) {
    return this.prisma.experience.create({ data: input })
  }

  async update(id: string, input: UpdateExperienceInput) {
    await this.ensureExists(id)
    return this.prisma.experience.update({ where: { id }, data: input })
  }

  async delete(id: string) {
    await this.ensureExists(id)
    await this.prisma.experience.delete({ where: { id } })
    return true
  }

  private async ensureExists(id: string) {
    const entry = await this.prisma.experience.findUnique({ where: { id } })
    if (!entry) throw new NotFoundException(ErrorCode.EXPERIENCE_NOT_FOUND)
  }
}
