import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import bcrypt from "bcryptjs"
import type { Response } from "express"

import { ErrorCode } from "../common/error-codes"
import { PrismaService } from "../prisma/prisma.service"

const REFRESH_COOKIE_NAME = "refresh_token"
const REFRESH_COOKIE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  async register(email: string, password: string, name: string, res: Response) {
    const existing = await this.prisma.user.findUnique({ where: { email } })
    if (existing) {
      throw new ConflictException(ErrorCode.AUTH_EMAIL_ALREADY_REGISTERED)
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await this.prisma.user.create({
      data: { email, passwordHash, name },
    })

    const accessToken = await this.issueTokenPair(user.id, user.email, res)
    return { accessToken, user }
  }

  async login(email: string, password: string, res: Response) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw new UnauthorizedException(ErrorCode.AUTH_INVALID_CREDENTIALS)
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash)
    if (!passwordMatches) {
      throw new UnauthorizedException(ErrorCode.AUTH_INVALID_CREDENTIALS)
    }

    const accessToken = await this.issueTokenPair(user.id, user.email, res)
    return { accessToken, user }
  }

  async refresh(userId: string, providedRefreshToken: string | null, res: Response) {
    if (!providedRefreshToken) {
      throw new UnauthorizedException(ErrorCode.AUTH_REFRESH_TOKEN_MISSING)
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user?.refreshTokenHash) {
      throw new UnauthorizedException(ErrorCode.AUTH_SESSION_INVALID)
    }

    const matches = await bcrypt.compare(providedRefreshToken, user.refreshTokenHash)
    if (!matches) {
      throw new UnauthorizedException(ErrorCode.AUTH_SESSION_INVALID)
    }

    const accessToken = await this.issueTokenPair(user.id, user.email, res)
    return { accessToken, user }
  }

  async logout(userId: string, res: Response) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    })
    res.clearCookie(REFRESH_COOKIE_NAME, { path: "/" })
    return true
  }

  private async issueTokenPair(userId: string, email: string, res: Response) {
    const payload = { sub: userId, email }

    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>("JWT_ACCESS_SECRET"),
      expiresIn: this.config.get<string>("JWT_ACCESS_EXPIRES_IN", "15m"),
    })

    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>("JWT_REFRESH_SECRET"),
      expiresIn: this.config.get<string>("JWT_REFRESH_EXPIRES_IN", "30d"),
    })

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10)
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    })

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      // Deliberately not tied to NODE_ENV: a "production" deploy served
      // over plain HTTP (e.g. behind nginx without TLS) still needs
      // secure:false, or the browser silently drops the cookie and every
      // refresh/login breaks. Only flip this via COOKIE_SECURE once TLS
      // actually terminates in front of this server.
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax",
      path: "/",
      maxAge: REFRESH_COOKIE_MAX_AGE_MS,
    })

    return accessToken
  }
}
