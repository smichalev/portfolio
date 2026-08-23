import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"

export type JwtPayload = { sub: string; email: string }
export type AccessTokenPayload = { userId: string; email: string }

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt-access") {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>("JWT_ACCESS_SECRET"),
    })
  }

  validate(payload: JwtPayload): AccessTokenPayload {
    return { userId: payload.sub, email: payload.email }
  }
}
