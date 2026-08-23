import { UseGuards } from "@nestjs/common"
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql"

import { GqlAuthGuard } from "../common/guards/gql-auth.guard"
import { CreateProfileFactInput } from "./dto/create-profile-fact.input"
import { CreateProfileLanguageInput } from "./dto/create-profile-language.input"
import { UpdateProfileFactInput } from "./dto/update-profile-fact.input"
import { UpdateProfileLanguageInput } from "./dto/update-profile-language.input"
import { UpdateProfileInput } from "./dto/update-profile.input"
import { ProfileFact } from "./models/profile-fact.model"
import { ProfileLanguage } from "./models/profile-language.model"
import { Profile } from "./models/profile.model"
import { ProfileService } from "./profile.service"

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => Profile)
  profile() {
    return this.profileService.getProfile()
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Profile)
  updateProfile(@Args("input") input: UpdateProfileInput) {
    return this.profileService.updateProfile(input)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProfileFact)
  createProfileFact(@Args("input") input: CreateProfileFactInput) {
    return this.profileService.createFact(input)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProfileFact)
  updateProfileFact(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateProfileFactInput
  ) {
    return this.profileService.updateFact(id, input)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  deleteProfileFact(@Args("id", { type: () => ID }) id: string) {
    return this.profileService.deleteFact(id)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProfileLanguage)
  createProfileLanguage(@Args("input") input: CreateProfileLanguageInput) {
    return this.profileService.createLanguage(input)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProfileLanguage)
  updateProfileLanguage(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateProfileLanguageInput
  ) {
    return this.profileService.updateLanguage(id, input)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  deleteProfileLanguage(@Args("id", { type: () => ID }) id: string) {
    return this.profileService.deleteLanguage(id)
  }
}
