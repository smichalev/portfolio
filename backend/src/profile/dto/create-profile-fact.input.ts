import { Field, InputType, Int } from "@nestjs/graphql"
import { IsInt, IsOptional, MinLength } from "class-validator"

@InputType()
export class CreateProfileFactInput {
  @Field()
  @MinLength(1)
  textRu: string

  @Field()
  @MinLength(1)
  textEn: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  order?: number
}
