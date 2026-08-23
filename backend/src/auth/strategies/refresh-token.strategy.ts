import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import type { Request } from "express"
import { Strategy } from "passport-jwt"

import type { JwtPayload } from "./access-token.strategy"

export type RefreshTokenPayload = {
  userId: string
  email: string
  refreshToken: string | null
}

const REFRESH_COOKIE_NAME = "refresh_token"

function cookieExtractor(req: Request): string | null {
  return req?.cookies?.[REFRESH_COOKIE_NAME] ?? null
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>("JWT_REFRESH_SECRET"),
      passReqToCallback: true,
    })
  }

  validate(req: Request, payload: JwtPayload): RefreshTokenPayload {
    return {
      userId: payload.sub,
      email: payload.email,
      refreshToken: cookieExtractor(req),
    }
  }
}
