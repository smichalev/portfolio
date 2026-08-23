FROM node:20-alpine AS build
WORKDIR /app

# Prisma's query/schema engine binaries need the real openssl package to
# detect libssl at runtime — without it they fail with a cryptic
# "Could not parse schema engine response" instead of a clear error.
RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Compiled to plain JS so the runtime image never needs ts-node — running
# prisma/seed.ts through `prisma db seed` (which shells out to ts-node)
# fails on this Alpine/Node combo with a cryptic ESM loader error even
# though the exact same command works fine outside Docker.
RUN npx tsc prisma/seed.ts --outDir dist-seed --module commonjs --target ES2021 \
      --esModuleInterop --skipLibCheck --resolveJsonModule

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY --from=build /app/dist ./dist
COPY --from=build /app/dist-seed ./dist-seed

EXPOSE 4000

# Runs on every start: migrate is a no-op with nothing new to apply, and
# seed skips itself once the database already has content (see seed.ts).
CMD ["sh", "-c", "npx prisma migrate deploy && node dist-seed/seed.js && node dist/main.js"]
