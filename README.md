# Portfolio

Сайт-визитка: React-фронтенд + NestJS/GraphQL-бэкенд + PostgreSQL. Весь контент редактируется на `/admin` и хранится в базе, а не захардкожен.

- [`frontend/`](frontend) — React, Vite, Tailwind, shadcn/ui. Подробности: [frontend/README.md](frontend/README.md) (если заведён) и комментарии в коде.
- [`backend/`](backend) — NestJS, GraphQL, Prisma, JWT-авторизация (access/refresh). Подробности: [backend/README.md](backend/README.md).

## Запуск в Docker (единственный открытый порт — 8081)

```bash
cp .env.example .env   # заполните секреты — см. ниже
docker-compose up -d --build
```

Открыть: **http://localhost:8081**

### Как это устроено

```
                 ┌──────────────────────────┐
  host:8081 ───▶ │  nginx (единственный      │
                  │  опубликованный порт)     │
                  │                            │
                  │  /            → статика    │
                  │  /graphql     → backend:4000│
                  └───────┬───────────┬────────┘
                          │           │
                   (внутренняя сеть compose, наружу не торчит)
                          │           │
                  ┌───────▼───┐  ┌────▼──────────┐
                  │ backend    │  │ postgres       │
                  │ :4000      │─▶│ :5432          │
                  └────────────┘  └────────────────┘
```

- **`nginx`** — единственный сервис с `ports:` в `docker-compose.yml` (`8081:80`). Собирается из [`frontend/Dockerfile`](frontend/Dockerfile): multi-stage — сборка Vite-приложения, затем статика отдаётся из `nginx:alpine`. [`frontend/nginx.conf`](frontend/nginx.conf) проксирует `/graphql` на `backend:4000` и отдаёт `index.html` для всех остальных путей (client-side routing).
- **`backend`** и **`postgres`** — без `ports:` вообще, недоступны с хоста, видны только друг другу и `nginx` по внутренней docker-сети. Единственный способ до них достучаться снаружи — через nginx.
- Поскольку и статика, и API теперь на одном origin (`localhost:8081`), браузер видит только same-origin запросы — CORS в проде фактически не участвует (фронтенд собирается с `VITE_GRAPHQL_URL=/graphql`, относительным путём, а не `http://localhost:4000/graphql`, который использовался бы вне Docker).
- `backend/Dockerfile` при каждом старте контейнера выполняет `prisma migrate deploy`, затем сид (`dist-seed/seed.js` — seed.ts, скомпилированный в обычный JS на этапе сборки, без `ts-node` в рантайме, потому что `prisma db seed` внутри Alpine-контейнера падал с ESM-ошибкой). Сид **сам себя пропускает**, если в базе уже есть контент (проверяет `skillGroup.count()`), — так что перезапуск контейнера не затирает правки, сделанные через `/admin`.

### Переменные окружения (`.env` в корне)

| Переменная | Назначение |
|---|---|
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Postgres |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` (+ `_EXPIRES_IN`) | JWT |
| `CORS_ORIGIN` | на случай прямого обращения к backend в обход nginx (не используется в проде через nginx) |
| `COOKIE_SECURE` | **держите `false`**, пока перед стеком нет TLS — иначе браузер тихо не примет refresh-cookie по обычному HTTP, и вход/обновление сессии сломаются |

`.env` уже создан со сгенерированными секретами для локального запуска — для реального деплоя сгенерируйте новые и никогда их не коммитьте.

### Полезные команды

```bash
docker-compose ps                 # статус контейнеров и портов
docker-compose logs -f backend    # логи backend (миграции, сид, ошибки)
docker-compose down               # остановить всё (данные в volume сохранятся)
docker-compose down -v            # остановить и стереть volume Postgres — полный сброс БД
docker-compose up -d --build      # пересобрать образы после изменений в коде
```
