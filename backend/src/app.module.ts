import { join } from "path"
import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo"
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { GraphQLModule } from "@nestjs/graphql"

import { AuthModule } from "./auth/auth.module"
import { ExperienceModule } from "./experience/experience.module"
import { PrismaModule } from "./prisma/prisma.module"
import { ProfileModule } from "./profile/profile.module"
import { SkillsModule } from "./skills/skills.module"
import { UsersModule } from "./users/users.module"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      sortSchema: true,
      playground: true,
      context: ({ req, res }: { req: unknown; res: unknown }) => ({ req, res }),
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    SkillsModule,
    ExperienceModule,
    ProfileModule,
  ],
})
export class AppModule {}
