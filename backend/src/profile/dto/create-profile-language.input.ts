import { Field, InputType, Int } from "@nestjs/graphql"
import { IsInt, IsOptional, MinLength } from "class-validator"

@InputType()
export class CreateProfileLanguageInput {
  @Field()
  @MinLength(1)
  nameRu: string

  @Field()
  @MinLength(1)
  nameEn: string

  @Field()
  @MinLength(1)
  levelRu: string

  @Field()
  @MinLength(1)
  levelEn: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  order?: number
}
