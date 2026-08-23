import { UseGuards } from "@nestjs/common"
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql"
import type { Response } from "express"

import { CurrentUser } from "../common/decorators/current-user.decorator"
import { GqlAuthGuard } from "../common/guards/gql-auth.guard"
import { GqlRefreshAuthGuard } from "../common/guards/gql-refresh-auth.guard"
import type { AccessTokenPayload } from "./strategies/access-token.strategy"
import type { RefreshTokenPayload } from "./strategies/refresh-token.strategy"
import { AuthService } from "./auth.service"
import { AuthPayload } from "./dto/auth-payload.object"
import { LoginInput } from "./dto/login.input"

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  login(@Args("input") input: LoginInput, @Context("res") res: Response) {
    return this.authService.login(input.email, input.password, res)
  }

  @UseGuards(GqlRefreshAuthGuard)
  @Mutation(() => AuthPayload)
  refreshToken(
    @CurrentUser() user: RefreshTokenPayload,
    @Context("res") res: Response
  ) {
    return this.authService.refresh(user.userId, user.refreshToken, res)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  logout(@CurrentUser() user: AccessTokenPayload, @Context("res") res: Response) {
    return this.authService.logout(user.userId, res)
  }
}
