import "reflect-metadata"
import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import cookieParser from "cookie-parser"

import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? true,
    credentials: true,
  })

  const port = process.env.PORT ? Number(process.env.PORT) : 4000
  await app.listen(port)
  console.log(`GraphQL API running on http://localhost:${port}/graphql`)
}

bootstrap()
