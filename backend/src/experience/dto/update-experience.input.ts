import { Field, InputType, Int } from "@nestjs/graphql"
import { IsInt, IsOptional, MinLength } from "class-validator"

@InputType()
export class UpdateExperienceInput {
  @Field({ nullable: true })
  @IsOptional()
  @MinLength(1)
  titleRu?: string

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(1)
  titleEn?: string

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(1)
  placeRu?: string

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(1)
  placeEn?: string

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(1)
  periodRu?: string

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(1)
  periodEn?: string

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(1)
  descriptionRu?: string

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(1)
  descriptionEn?: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  order?: number
}
