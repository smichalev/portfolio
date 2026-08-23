import { Field, ID, InputType, Int } from "@nestjs/graphql"
import { IsInt, IsOptional, IsUUID, MinLength } from "class-validator"

@InputType()
export class CreateSkillInput {
  @Field(() => ID)
  @IsUUID()
  skillGroupId: string

  @Field()
  @MinLength(1)
  nameRu: string

  @Field()
  @MinLength(1)
  nameEn: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  order?: number
}
