# Backend

NestJS + GraphQL API с JWT-авторизацией (access + refresh токены), PostgreSQL и Prisma ORM.

## Стек

- **NestJS 10** — фреймворк
- **GraphQL** (code-first, `@nestjs/graphql` + Apollo Server) — единственный API-слой, эндпоинт `/graphql`
- **Prisma ORM** + **PostgreSQL** — база данных
- **Passport + `@nestjs/jwt`** — access/refresh JWT-авторизация
- **bcryptjs** — хеширование паролей и refresh-токенов
- **class-validator** — валидация входных данных

## Как устроена авторизация

- `accessToken` — короткоживущий (15 минут по умолчанию), возвращается клиенту в теле GraphQL-ответа. Хранить на клиенте в памяти (не в localStorage) и передавать в заголовке `Authorization: Bearer <token>`.
- `refreshToken` — долгоживущий (30 дней по умолчанию), выдаётся как `httpOnly` cookie (`refresh_token`), недоступен из JS на клиенте. Хеш текущего refresh-токена хранится в БД (`users.refreshTokenHash`) — это позволяет отзывать сессии (logout) и делает кражу токена из БД бесполезной без сравнения хеша.
- При каждом `login`/`register`/`refreshToken` выпускается новая пара токенов (ротация refresh-токена).
- `logout` затирает `refreshTokenHash` в БД и чистит cookie — использовать украденный refresh-токен после этого нельзя.

## GraphQL API

```graphql
type Mutation {
  register(input: RegisterInput!): AuthPayload!
  login(input: LoginInput!): AuthPayload!
  refreshToken: AuthPayload!   # читает refresh_token из cookie
  logout: Boolean!             # требует Authorization: Bearer <accessToken>

  createSkillGroup(input: CreateSkillGroupInput!): SkillGroup!   # требует авторизации
  updateSkillGroup(id: ID!, input: UpdateSkillGroupInput!): SkillGroup!
  deleteSkillGroup(id: ID!): Boolean!
  createSkill(input: CreateSkillInput!): Skill!
  updateSkill(id: ID!, input: UpdateSkillInput!): Skill!
  deleteSkill(id: ID!): Boolean!

  createExperience(input: CreateExperienceInput!): Experience!   # требует авторизации
  updateExperience(id: ID!, input: UpdateExperienceInput!): Experience!
  deleteExperience(id: ID!): Boolean!

  updateProfile(input: UpdateProfileInput!): Profile!   # требует авторизации, upsert синглтона
  createProfileFact(input: CreateProfileFactInput!): ProfileFact!
  updateProfileFact(id: ID!, input: UpdateProfileFactInput!): ProfileFact!
  deleteProfileFact(id: ID!): Boolean!
  createProfileLanguage(input: CreateProfileLanguageInput!): ProfileLanguage!
  updateProfileLanguage(id: ID!, input: UpdateProfileLanguageInput!): ProfileLanguage!
  deleteProfileLanguage(id: ID!): Boolean!
}

type Query {
  me: User!                    # требует Authorization: Bearer <accessToken>
  skillGroups: [SkillGroup!]!  # публичный, с вложенными skills
  experience: [Experience!]!   # публичный
  profile: Profile!            # публичный, с вложенными facts/languages; авто-создаётся при первом обращении
}
```

Полная схема генерируется автоматически в `src/schema.gql` при старте сервера.

## Модули `skills` и `experience`

Оба модуля хранят контент на двух языках — не через enum/аргумент `lang`, а парой колонок `*Ru`/`*En` на каждой сущности (`titleRu`/`titleEn` и т.д.). Это осознанно проще, чем таблицы переводов: языков ровно два и они не меняются, а клиент получает сразу оба варианта и сам выбирает нужный при переключении языка на сайте — без повторных запросов.

- **`SkillGroup`** (`skill_groups`) — группа навыков (`titleRu`/`titleEn`, `order`) с вложенными **`Skill`** (`skills`, `nameRu`/`nameEn`, `order`, `skillGroupId`). При удалении группы навыки удаляются каскадно.
- **`Experience`** (`experience_entries`) — место работы (`titleRu`/`titleEn`, `placeRu`/`placeEn`, `periodRu`/`periodEn`, `descriptionRu`/`descriptionEn`, `order`).

Чтение (`skillGroups`, `experience`) — публичное, без авторизации, чтобы наполнять сайт-визитку. Все мутации создания/изменения/удаления защищены `GqlAuthGuard` (нужен `Authorization: Bearer <accessToken>`).

## Модуль `profile` (личная информация)

Хранит всё, что не относится к навыкам и опыту работы: имя, должность, локация, факты-бейджи под именем (`ProfileFact`), краткое/полное «Обо мне», контакты (email, телефон, telegram, `avatarUrl` — общие для обоих языков), образование и список владения языками (`ProfileLanguage`, например «Русский — Родной»).

`avatarUrl` — просто прямая ссылка на изображение (обычная строка, `@IsString`, без `@IsUrl`, чтобы поле можно было очистить пустой строкой). Файл фото нигде физически не хранится на сервере/в репозитории — фронтенд подставляет ссылку в `<img src>` как есть, а при пустом значении показывает инициалы (fallback).

Это **синглтон** — на сайте одна личная информация, а не список. Реализовано как строка с фиксированным `id = "main"` (`@default("main")` в Prisma-схеме, без обычного uuid). `profile` и `updateProfile` работают через `upsert`, поэтому первый же запрос/мутация создаёт запись автоматически — отдельная мутация создания не нужна, а дублирования быть не может.

## Наполнение данными (seed)

Весь контент сайта-визитки (профиль, факты, языки, навыки, опыт работы) хранится в БД, а не захардкожен во фронтенде. `prisma/seed.ts` заполняет базу реальными данными:

```bash
npm run prisma:seed
```

Скрипт идемпотентен — можно запускать повторно, он пересоздаёт факты/языки/навыки/опыт и обновляет профиль, не плодя дубликаты. Также запускается автоматически после `prisma migrate reset` (стандартное поведение Prisma при наличии `prisma.seed` в `package.json`).

`ProfileFact` и `ProfileLanguage` — обычные дочерние списки с собственным CRUD (`create/update/delete`), как в `skills`. Чтение (`profile`) — публичное; `updateProfile` и мутации над фактами/языками защищены `GqlAuthGuard`.

## Быстрый старт

```bash
cp .env.example .env        # при необходимости поменяйте значения
docker-compose up -d        # поднимает Postgres в контейнере (localhost:5432)
npm install
npx prisma migrate dev      # применяет миграции к БД
npm run start:dev           # http://localhost:4000/graphql
```

Docker Desktop на этой машине не регистрирует плагин `docker compose` — используйте отдельный бинарник `docker-compose` (он уже установлен), а не `docker compose`.

## Переменные окружения (`.env`)

| Переменная | Назначение |
|---|---|
| `DATABASE_URL` | строка подключения к Postgres |
| `JWT_ACCESS_SECRET` / `JWT_ACCESS_EXPIRES_IN` | секрет и TTL access-токена |
| `JWT_REFRESH_SECRET` / `JWT_REFRESH_EXPIRES_IN` | секрет и TTL refresh-токена |
| `CORS_ORIGIN` | разрешённый origin фронтенда (сейчас `http://localhost:5175`) |
| `PORT` | порт сервера (по умолчанию 4000) |
| `COOKIE_SECURE` | `Secure`-флаг у refresh-cookie. Держите `false`, пока перед сервером нет TLS — иначе браузер молча откажется принимать cookie по обычному HTTP, и вход/refresh сломаются. **Не завязан на `NODE_ENV`** намеренно (см. [корневой README](../README.md) про Docker-деплой на обычном HTTP) |

`.env` уже создан со сгенерированными dev-секретами — для продакшена сгенерируйте новые и никогда не коммитьте их.

## Полезные команды

```bash
npm run typecheck       # проверка типов без сборки
npm run build            # компиляция в dist/
npm start                 # запуск собранной версии
npm run prisma:studio    # GUI для просмотра данных в БД
```
