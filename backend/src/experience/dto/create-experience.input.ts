import { Field, InputType, Int } from "@nestjs/graphql"
import { IsInt, IsOptional, MinLength } from "class-validator"

@InputType()
export class CreateExperienceInput {
  @Field()
  @MinLength(1)
  titleRu: string

  @Field()
  @MinLength(1)
  titleEn: string

  @Field()
  @MinLength(1)
  placeRu: string

  @Field()
  @MinLength(1)
  placeEn: string

  @Field()
  @MinLength(1)
  periodRu: string

  @Field()
  @MinLength(1)
  periodEn: string

  @Field()
  @MinLength(1)
  descriptionRu: string

  @Field()
  @MinLength(1)
  descriptionEn: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  order?: number
}
