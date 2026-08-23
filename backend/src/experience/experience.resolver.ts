import { UseGuards } from "@nestjs/common"
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql"

import { GqlAuthGuard } from "../common/guards/gql-auth.guard"
import { CreateExperienceInput } from "./dto/create-experience.input"
import { UpdateExperienceInput } from "./dto/update-experience.input"
import { Experience } from "./models/experience.model"
import { ExperienceService } from "./experience.service"

@Resolver(() => Experience)
export class ExperienceResolver {
  constructor(private readonly experienceService: ExperienceService) {}

  @Query(() => [Experience])
  experience() {
    return this.experienceService.findAll()
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Experience)
  createExperience(@Args("input") input: CreateExperienceInput) {
    return this.experienceService.create(input)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Experience)
  updateExperience(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateExperienceInput
  ) {
    return this.experienceService.update(id, input)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  deleteExperience(@Args("id", { type: () => ID }) id: string) {
    return this.experienceService.delete(id)
  }
}
