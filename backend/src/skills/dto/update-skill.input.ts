import { Field, InputType, Int } from "@nestjs/graphql"
import { IsInt, IsOptional, MinLength } from "class-validator"

@InputType()
export class UpdateSkillInput {
  @Field({ nullable: true })
  @IsOptional()
  @MinLength(1)
  nameRu?: string

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(1)
  nameEn?: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  order?: number
}
