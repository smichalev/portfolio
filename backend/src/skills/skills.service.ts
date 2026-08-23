import { Injectable, NotFoundException } from "@nestjs/common"

import { ErrorCode } from "../common/error-codes"
import { PrismaService } from "../prisma/prisma.service"
import { CreateSkillGroupInput } from "./dto/create-skill-group.input"
import { CreateSkillInput } from "./dto/create-skill.input"
import { UpdateSkillGroupInput } from "./dto/update-skill-group.input"
import { UpdateSkillInput } from "./dto/update-skill.input"

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  findAllGroups() {
    return this.prisma.skillGroup.findMany({
      orderBy: { order: "asc" },
      include: { skills: { orderBy: { order: "asc" } } },
    })
  }

  createGroup(input: CreateSkillGroupInput) {
    return this.prisma.skillGroup.create({
      data: input,
      include: { skills: true },
    })
  }

  async updateGroup(id: string, input: UpdateSkillGroupInput) {
    await this.ensureGroupExists(id)
    return this.prisma.skillGroup.update({
      where: { id },
      data: input,
      include: { skills: { orderBy: { order: "asc" } } },
    })
  }

  async deleteGroup(id: string) {
    await this.ensureGroupExists(id)
    await this.prisma.skillGroup.delete({ where: { id } })
    return true
  }

  async createSkill(input: CreateSkillInput) {
    await this.ensureGroupExists(input.skillGroupId)
    return this.prisma.skill.create({ data: input })
  }

  async updateSkill(id: string, input: UpdateSkillInput) {
    await this.ensureSkillExists(id)
    return this.prisma.skill.update({ where: { id }, data: input })
  }

  async deleteSkill(id: string) {
    await this.ensureSkillExists(id)
    await this.prisma.skill.delete({ where: { id } })
    return true
  }

  private async ensureGroupExists(id: string) {
    const group = await this.prisma.skillGroup.findUnique({ where: { id } })
    if (!group) throw new NotFoundException(ErrorCode.SKILL_GROUP_NOT_FOUND)
  }

  private async ensureSkillExists(id: string) {
    const skill = await this.prisma.skill.findUnique({ where: { id } })
    if (!skill) throw new NotFoundException(ErrorCode.SKILL_NOT_FOUND)
  }
}
