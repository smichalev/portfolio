import { UseGuards } from "@nestjs/common"
import { Query, Resolver } from "@nestjs/graphql"

import { CurrentUser } from "../common/decorators/current-user.decorator"
import { GqlAuthGuard } from "../common/guards/gql-auth.guard"
import type { AccessTokenPayload } from "../auth/strategies/access-token.strategy"
import { User } from "./models/user.model"
import { UsersService } from "./users.service"

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  me(@CurrentUser() user: AccessTokenPayload) {
    return this.usersService.findById(user.userId)
  }
}
