import { Field, ID, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class ProfileLanguage {
  @Field(() => ID)
  id: string

  @Field(() => Int)
  order: number

  @Field()
  nameRu: string

  @Field()
  nameEn: string

  @Field()
  levelRu: string

  @Field()
  levelEn: string
}
