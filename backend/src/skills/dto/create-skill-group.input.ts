import { Field, InputType, Int } from "@nestjs/graphql"
import { IsInt, IsOptional, MinLength } from "class-validator"

@InputType()
export class CreateSkillGroupInput {
  @Field()
  @MinLength(1)
  titleRu: string

  @Field()
  @MinLength(1)
  titleEn: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  order?: number
}
