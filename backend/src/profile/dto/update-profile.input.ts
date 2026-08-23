import { Field, InputType } from "@nestjs/graphql"
import { IsEmail, IsOptional, IsString } from "class-validator"

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nameRu?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nameEn?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  roleRu?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  roleEn?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  locationRu?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  locationEn?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  avatarUrl?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bioShortRu?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bioShortEn?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bioFullRu?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bioFullEn?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  telegram?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  github?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  educationPlaceRu?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  educationPlaceEn?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  educationCityRu?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  educationCityEn?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  educationYear?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  educationDegreeRu?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  educationDegreeEn?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  educationMajorRu?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  educationMajorEn?: string
}
