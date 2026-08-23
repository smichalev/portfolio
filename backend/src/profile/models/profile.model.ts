import { Field, ID, ObjectType } from "@nestjs/graphql"

import { ProfileFact } from "./profile-fact.model"
import { ProfileLanguage } from "./profile-language.model"

@ObjectType()
export class Profile {
  @Field(() => ID)
  id: string

  @Field()
  nameRu: string

  @Field()
  nameEn: string

  @Field()
  roleRu: string

  @Field()
  roleEn: string

  @Field()
  locationRu: string

  @Field()
  locationEn: string

  @Field()
  avatarUrl: string

  @Field()
  bioShortRu: string

  @Field()
  bioShortEn: string

  @Field()
  bioFullRu: string

  @Field()
  bioFullEn: string

  @Field()
  email: string

  @Field()
  phone: string

  @Field()
  telegram: string

  @Field()
  github: string

  @Field()
  educationPlaceRu: string

  @Field()
  educationPlaceEn: string

  @Field()
  educationCityRu: string

  @Field()
  educationCityEn: string

  @Field()
  educationYear: string

  @Field()
  educationDegreeRu: string

  @Field()
  educationDegreeEn: string

  @Field()
  educationMajorRu: string

  @Field()
  educationMajorEn: string

  @Field(() => [ProfileFact])
  facts: ProfileFact[]

  @Field(() => [ProfileLanguage])
  languages: ProfileLanguage[]
}
