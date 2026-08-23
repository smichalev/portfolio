import { Field, ID, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class Experience {
  @Field(() => ID)
  id: string

  @Field(() => Int)
  order: number

  @Field()
  titleRu: string

  @Field()
  titleEn: string

  @Field()
  placeRu: string

  @Field()
  placeEn: string

  @Field()
  periodRu: string

  @Field()
  periodEn: string

  @Field()
  descriptionRu: string

  @Field()
  descriptionEn: string
}
