import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"

import { AuthResolver } from "./auth.resolver"
import { AuthService } from "./auth.service"
import { AccessTokenStrategy } from "./strategies/access-token.strategy"
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy"

@Module({
  imports: [PassportModule, JwtModule.register({})],
  providers: [AuthService, AuthResolver, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
