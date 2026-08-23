import { Field, InputType, Int } from "@nestjs/graphql"
import { IsInt, IsOptional, MinLength } from "class-validator"

@InputType()
export class UpdateSkillGroupInput {
  @Field({ nullable: true })
  @IsOptional()
  @MinLength(1)
  titleRu?: string

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(1)
  titleEn?: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  order?: number
}
