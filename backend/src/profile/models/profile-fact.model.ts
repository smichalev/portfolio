import { Field, ID, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class ProfileFact {
  @Field(() => ID)
  id: string

  @Field(() => Int)
  order: number

  @Field()
  textRu: string

  @Field()
  textEn: string
}
