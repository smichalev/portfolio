import { Field, ID, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class Skill {
  @Field(() => ID)
  id: string

  @Field(() => Int)
  order: number

  @Field()
  nameRu: string

  @Field()
  nameEn: string

  @Field(() => ID)
  skillGroupId: string
}
