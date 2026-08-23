FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Same-origin deployment: nginx serves the SPA and proxies /graphql to the
# backend container, so the client calls a relative path — no CORS, no
# baked-in localhost URL. This overrides anything in a copied .env (which
# .dockerignore excludes from the build context anyway).
ENV VITE_GRAPHQL_URL=/graphql

RUN npm run build

FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
