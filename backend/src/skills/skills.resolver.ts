import { UseGuards } from "@nestjs/common"
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql"

import { GqlAuthGuard } from "../common/guards/gql-auth.guard"
import { CreateSkillGroupInput } from "./dto/create-skill-group.input"
import { CreateSkillInput } from "./dto/create-skill.input"
import { UpdateSkillGroupInput } from "./dto/update-skill-group.input"
import { UpdateSkillInput } from "./dto/update-skill.input"
import { SkillGroup } from "./models/skill-group.model"
import { Skill } from "./models/skill.model"
import { SkillsService } from "./skills.service"

@Resolver(() => SkillGroup)
export class SkillsResolver {
  constructor(private readonly skillsService: SkillsService) {}

  @Query(() => [SkillGroup])
  skillGroups() {
    return this.skillsService.findAllGroups()
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => SkillGroup)
  createSkillGroup(@Args("input") input: CreateSkillGroupInput) {
    return this.skillsService.createGroup(input)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => SkillGroup)
  updateSkillGroup(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateSkillGroupInput
  ) {
    return this.skillsService.updateGroup(id, input)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  deleteSkillGroup(@Args("id", { type: () => ID }) id: string) {
    return this.skillsService.deleteGroup(id)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Skill)
  createSkill(@Args("input") input: CreateSkillInput) {
    return this.skillsService.createSkill(input)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Skill)
  updateSkill(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateSkillInput
  ) {
    return this.skillsService.updateSkill(id, input)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  deleteSkill(@Args("id", { type: () => ID }) id: string) {
    return this.skillsService.deleteSkill(id)
  }
}
