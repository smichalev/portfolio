import { Field, ID, Int, ObjectType } from "@nestjs/graphql"

import { Skill } from "./skill.model"

@ObjectType()
export class SkillGroup {
  @Field(() => ID)
  id: string

  @Field(() => Int)
  order: number

  @Field()
  titleRu: string

  @Field()
  titleEn: string

  @Field(() => [Skill])
  skills: Skill[]
}
