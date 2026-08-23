-- Data migration: bakes the site's current real content (profile, facts,
-- languages, skills, experience) directly into migration history, so a
-- fresh `prisma migrate deploy` reproduces it exactly — no separate seed
-- step required. Safe to re-run: every statement upserts by primary key,
-- so applying this to a database that already has this data is a no-op.
-- `updatedAt` is set explicitly because @updatedAt is Prisma-Client-side
-- only — it has no DB default, so raw SQL must supply it.

INSERT INTO "profile" (
  id, "nameRu", "nameEn", "roleRu", "roleEn", "locationRu", "locationEn", "avatarUrl", "bioShortRu", "bioShortEn", "bioFullRu", "bioFullEn", "email", "phone", "telegram", "github", "educationPlaceRu", "educationPlaceEn", "educationCityRu", "educationCityEn", "educationYear", "educationDegreeRu", "educationDegreeEn", "educationMajorRu", "educationMajorEn", "updatedAt"
) VALUES (
  'main', 'Сергей Михалёв', 'Sergey Mikhalev', 'Fullstack-разработчик (Node.js / NestJS)', 'Fullstack Developer (Node.js / NestJS)', 'Тольятти, Россия', 'Tolyatti, Russia', 'https://lh3.googleusercontent.com/a/ACg8ocJuOxo3k0t4CpBXXBCr2KgOs9MgykKb0iLVaeJopltJRpFNJstl=s576-c-no', 'Backend-разработчик (Node.js / NestJS) с 7+ годами опыта разработки backend-сервисов, микросервисной архитектуры и высоконагруженных web-приложений.', 'Backend developer (Node.js / NestJS) with 7+ years of experience building backend services, microservice architecture, and high-load web applications.', 'Backend-разработчик (Node.js / NestJS) с 7+ годами опыта разработки backend-сервисов, микросервисной архитектуры и высоконагруженных web-приложений.

Специализируюсь на проектировании REST API, реализации поисковых сервисов, интеграции микросервисов и разработке событийной архитектуры.

Имею большой опыт работы с NestJS, Express.js, PostgreSQL, MongoDB, Redis, Kafka, RabbitMQ, OpenSearch и ScyllaDB.

Использую современные AI-инструменты (OpenAI Codex и Claude) для ускорения разработки, анализа кода, рефакторинга и генерации тестов, сохраняя полный контроль над архитектурой решений и качеством кода.

Разрабатываю unit- и интеграционные тесты на Jest, участвую в code review, проектировании архитектуры сервисов и расследовании production-инцидентов.

Есть опыт полного цикла разработки: от проектирования архитектуры и реализации бизнес-логики до деплоя, сопровождения и оптимизации production-систем.

Дополнительно имею опыт fullstack-разработки на Vue.js и React/React Native.', 'Backend developer (Node.js / NestJS) with 7+ years of experience building backend services, microservice architecture, and high-load web applications.

I specialize in designing REST APIs, building search services, integrating microservices, and developing event-driven architecture.

Extensive experience with NestJS, Express.js, PostgreSQL, MongoDB, Redis, Kafka, RabbitMQ, OpenSearch, and ScyllaDB.

I use modern AI tools (OpenAI Codex and Claude) to speed up development, code analysis, refactoring, and test generation, while keeping full control over solution architecture and code quality.

I write unit and integration tests with Jest, participate in code review, service architecture design, and production incident investigation.

Full-cycle development experience: from architecture design and business logic implementation to deployment, maintenance, and optimization of production systems.

I also have experience with fullstack development using Vue.js and React/React Native.', 'smichalev95@gmail.com', '+7 (939) 713-78-00', 'https://t.me/michalev', 'https://github.com/smichalev', 'Самарский государственный экономический университет', 'Samara State University of Economics', 'Самара', 'Samara', '2017', 'Высшее образование', 'Higher education', 'Экономика предприятия и организаций', 'Enterprise and Organizational Economics', NOW()
)
ON CONFLICT (id) DO UPDATE SET
  "nameRu" = EXCLUDED."nameRu",
  "nameEn" = EXCLUDED."nameEn",
  "roleRu" = EXCLUDED."roleRu",
  "roleEn" = EXCLUDED."roleEn",
  "locationRu" = EXCLUDED."locationRu",
  "locationEn" = EXCLUDED."locationEn",
  "avatarUrl" = EXCLUDED."avatarUrl",
  "bioShortRu" = EXCLUDED."bioShortRu",
  "bioShortEn" = EXCLUDED."bioShortEn",
  "bioFullRu" = EXCLUDED."bioFullRu",
  "bioFullEn" = EXCLUDED."bioFullEn",
  "email" = EXCLUDED."email",
  "phone" = EXCLUDED."phone",
  "telegram" = EXCLUDED."telegram",
  "github" = EXCLUDED."github",
  "educationPlaceRu" = EXCLUDED."educationPlaceRu",
  "educationPlaceEn" = EXCLUDED."educationPlaceEn",
  "educationCityRu" = EXCLUDED."educationCityRu",
  "educationCityEn" = EXCLUDED."educationCityEn",
  "educationYear" = EXCLUDED."educationYear",
  "educationDegreeRu" = EXCLUDED."educationDegreeRu",
  "educationDegreeEn" = EXCLUDED."educationDegreeEn",
  "educationMajorRu" = EXCLUDED."educationMajorRu",
  "educationMajorEn" = EXCLUDED."educationMajorEn",
  "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "profile_facts" (id, "order", "textRu", "textEn", "profileId")
VALUES ('0a32a044-cbea-4e1f-a2a0-22c67801a287', 0, '7 лет 2 месяца опыта', '7 years 2 months of experience', 'main')
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "textRu" = EXCLUDED."textRu", "textEn" = EXCLUDED."textEn";

INSERT INTO "profile_facts" (id, "order", "textRu", "textEn", "profileId")
VALUES ('2c07f981-b007-47f7-ba39-ff1bbcfa5ff8', 1, '220 000 ₽ на руки', '$2500', 'main')
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "textRu" = EXCLUDED."textRu", "textEn" = EXCLUDED."textEn";

INSERT INTO "profile_facts" (id, "order", "textRu", "textEn", "profileId")
VALUES ('ea3d66ba-bd8e-4a3f-b5b8-40254fe5fa6d', 2, 'Удалённо / гибрид', 'Remote / hybrid', 'main')
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "textRu" = EXCLUDED."textRu", "textEn" = EXCLUDED."textEn";

INSERT INTO "profile_languages" (id, "order", "nameRu", "nameEn", "levelRu", "levelEn", "profileId")
VALUES ('84d67f0b-eb66-40d3-9563-2ecbd7df4ebd', 0, 'Русский', 'Russian', 'Родной', 'Native', 'main')
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "levelRu" = EXCLUDED."levelRu", "levelEn" = EXCLUDED."levelEn";

INSERT INTO "profile_languages" (id, "order", "nameRu", "nameEn", "levelRu", "levelEn", "profileId")
VALUES ('5ada0525-c39a-43ad-92d1-0cb8f3c837ee', 1, 'Английский', 'English', 'A1 — начальный', 'A1 — elementary', 'main')
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "levelRu" = EXCLUDED."levelRu", "levelEn" = EXCLUDED."levelEn";

INSERT INTO "skill_groups" (id, "order", "titleRu", "titleEn", "updatedAt")
VALUES ('9839ba47-8e3e-4ace-9db5-bb9a97e3848f', 0, 'Backend', 'Backend', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "titleRu" = EXCLUDED."titleRu", "titleEn" = EXCLUDED."titleEn", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('d7f34199-34c9-43d6-a7a9-a208494e7eaf', 0, 'Node.js', 'Node.js', '9839ba47-8e3e-4ace-9db5-bb9a97e3848f', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('7be9951e-8493-41bd-b280-c06c1872a010', 1, 'NestJS', 'NestJS', '9839ba47-8e3e-4ace-9db5-bb9a97e3848f', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('ffdfe02a-eef1-4206-baab-2fc80b6ea073', 2, 'Express.js', 'Express.js', '9839ba47-8e3e-4ace-9db5-bb9a97e3848f', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('22816c24-2b0e-4bbd-8928-331211b377b3', 3, 'TypeScript', 'TypeScript', '9839ba47-8e3e-4ace-9db5-bb9a97e3848f', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('2fedd0c0-c983-4e78-9005-c2d8f8aa3a02', 4, 'JavaScript', 'JavaScript', '9839ba47-8e3e-4ace-9db5-bb9a97e3848f', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skill_groups" (id, "order", "titleRu", "titleEn", "updatedAt")
VALUES ('537a5498-cadc-4f89-9914-2b175234fc2e', 1, 'Базы данных и очереди', 'Databases & Queues', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "titleRu" = EXCLUDED."titleRu", "titleEn" = EXCLUDED."titleEn", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('cd74135f-4c83-40fa-b2a3-bf954d2815dc', 0, 'PostgreSQL', 'PostgreSQL', '537a5498-cadc-4f89-9914-2b175234fc2e', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('e9219801-4dc9-4cb6-a707-0f9ce2401c6b', 1, 'MongoDB', 'MongoDB', '537a5498-cadc-4f89-9914-2b175234fc2e', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('eb74371a-b10d-4624-b6ff-6e799c176b7b', 2, 'Redis', 'Redis', '537a5498-cadc-4f89-9914-2b175234fc2e', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('59f10cca-2db5-45e4-a6c4-62a714cbff49', 3, 'Memcached', 'Memcached', '537a5498-cadc-4f89-9914-2b175234fc2e', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('1ec037c5-47e1-4776-a6d1-557be55096bb', 4, 'ScyllaDB', 'ScyllaDB', '537a5498-cadc-4f89-9914-2b175234fc2e', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('51818d69-7ef6-4d21-872a-7248e74f7b55', 5, 'Elasticsearch', 'Elasticsearch', '537a5498-cadc-4f89-9914-2b175234fc2e', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('09dcc159-d7e4-4c71-8fff-5bd8a53470a4', 6, 'OpenSearch', 'OpenSearch', '537a5498-cadc-4f89-9914-2b175234fc2e', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('07d130c6-15ae-4291-8236-21ced24c5c2a', 7, 'Apache Kafka', 'Apache Kafka', '537a5498-cadc-4f89-9914-2b175234fc2e', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('8834edc4-4782-4cda-a772-cd1ed6a5ab34', 8, 'RabbitMQ', 'RabbitMQ', '537a5498-cadc-4f89-9914-2b175234fc2e', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('945459c1-e4be-4dee-937e-d0d73fe2ba03', 9, 'BullMQ', 'BullMQ', '537a5498-cadc-4f89-9914-2b175234fc2e', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('78e5fa6d-6222-4988-844d-d05ee4cc97b3', 10, 'TypeORM', 'TypeORM', '537a5498-cadc-4f89-9914-2b175234fc2e', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skill_groups" (id, "order", "titleRu", "titleEn", "updatedAt")
VALUES ('a199ccef-f96c-449c-9951-0fab9aad9fe3', 2, 'Frontend', 'Frontend', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "titleRu" = EXCLUDED."titleRu", "titleEn" = EXCLUDED."titleEn", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('2d02534f-7cf2-44fa-b008-5b35bb5ff79b', 0, 'React', 'React', 'a199ccef-f96c-449c-9951-0fab9aad9fe3', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('3370efc9-8c33-4898-a0c9-2830cb690ff4', 1, 'Vue.js', 'Vue.js', 'a199ccef-f96c-449c-9951-0fab9aad9fe3', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('5e075aaa-7213-4bc5-a62e-623d012f9c32', 2, 'React Native', 'React Native', 'a199ccef-f96c-449c-9951-0fab9aad9fe3', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('5cf4ef80-dd41-4fa9-b7a7-0af6a6537cbd', 3, 'HTML', 'HTML', 'a199ccef-f96c-449c-9951-0fab9aad9fe3', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('5a32a76c-0a61-48b3-9721-e0a2f486ad2d', 4, 'CSS', 'CSS', 'a199ccef-f96c-449c-9951-0fab9aad9fe3', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skill_groups" (id, "order", "titleRu", "titleEn", "updatedAt")
VALUES ('5a0d456a-c900-4e8b-a2e0-076cffe02fba', 3, 'Инфраструктура и другое', 'Infrastructure & Other', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "titleRu" = EXCLUDED."titleRu", "titleEn" = EXCLUDED."titleEn", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('9ea1a482-e6a9-486c-97c5-467934eb6797', 0, 'Docker', 'Docker', '5a0d456a-c900-4e8b-a2e0-076cffe02fba', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('8ba3027f-5965-4ee1-9d3f-b425fea2c3b9', 1, 'Kubernetes', 'Kubernetes', '5a0d456a-c900-4e8b-a2e0-076cffe02fba', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('e0213a49-7a6d-4825-ad74-c8742aa87f7a', 2, 'Git', 'Git', '5a0d456a-c900-4e8b-a2e0-076cffe02fba', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('2ec8afea-25a8-4f59-9cb7-99a072c485da', 3, 'WebSocket', 'WebSocket', '5a0d456a-c900-4e8b-a2e0-076cffe02fba', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('4793961e-e49e-4ec5-9d2b-cc09b1560fc6', 4, 'Bitcoin Core', 'Bitcoin Core', '5a0d456a-c900-4e8b-a2e0-076cffe02fba', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "skills" (id, "order", "nameRu", "nameEn", "skillGroupId", "updatedAt")
VALUES ('2f73d7d4-80cf-45b6-ab96-c6c1ee985ae5', 5, 'Web3', 'Web3', '5a0d456a-c900-4e8b-a2e0-076cffe02fba', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "nameRu" = EXCLUDED."nameRu", "nameEn" = EXCLUDED."nameEn", "skillGroupId" = EXCLUDED."skillGroupId", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "experience_entries" ("id", "order", "titleRu", "titleEn", "placeRu", "placeEn", "periodRu", "periodEn", "descriptionRu", "descriptionEn", "updatedAt")
VALUES ('5a9354d2-2c05-4095-8a91-2c613b21e2e9', 0, 'Разработчик Node.js', 'Node.js Developer', 'MyGig', 'MyGig', 'Февраль 2024 — Июль 2026 · 2 года 6 месяцев', 'February 2024 — July 2026 · 2 years 6 months', 'Проектирование микросервисной архитектуры, разработка backend-сервисов на NestJS, REST API, интеграции через Kafka и RabbitMQ, контейнеризация в Docker, деплой и сопровождение в Kubernetes, unit- и integration-тесты на Jest, code review, диагностика production-инцидентов. Разрабатывал поисковые сервисы на OpenSearch и сложные запросы/агрегации для MongoDB.', 'Designed microservice architecture, developed backend services with NestJS, REST APIs, integrations via Kafka and RabbitMQ, containerized services with Docker, deployed and maintained them on Kubernetes, wrote unit and integration tests with Jest, code review, production incident diagnostics. Built search services on OpenSearch and complex queries/aggregations for MongoDB.', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "titleRu" = EXCLUDED."titleRu", "titleEn" = EXCLUDED."titleEn", "placeRu" = EXCLUDED."placeRu", "placeEn" = EXCLUDED."placeEn", "periodRu" = EXCLUDED."periodRu", "periodEn" = EXCLUDED."periodEn", "descriptionRu" = EXCLUDED."descriptionRu", "descriptionEn" = EXCLUDED."descriptionEn", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "experience_entries" ("id", "order", "titleRu", "titleEn", "placeRu", "placeEn", "periodRu", "periodEn", "descriptionRu", "descriptionEn", "updatedAt")
VALUES ('3f2098ae-c018-4f4a-89e5-ae788b931e14', 1, 'Node.js Developer', 'Node.js Developer', 'IT & SEA Solutions (Германия)', 'IT & SEA Solutions (Germany)', 'Январь 2023 — Февраль 2024 · 1 год 2 месяца', 'January 2023 — February 2024 · 1 year 2 months', 'Разработка backend-микросервисов на NestJS, проектирование REST API, участие в разработке frontend на React. Реализовал realtime-уведомления через WebSocket + PUSH и интегрировал ChatGPT во внутренний корпоративный чат.', 'Developed backend microservices with NestJS, designed REST APIs, contributed to frontend development with React. Implemented realtime notifications via WebSocket + PUSH and integrated ChatGPT into an internal corporate chat.', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "titleRu" = EXCLUDED."titleRu", "titleEn" = EXCLUDED."titleEn", "placeRu" = EXCLUDED."placeRu", "placeEn" = EXCLUDED."placeEn", "periodRu" = EXCLUDED."periodRu", "periodEn" = EXCLUDED."periodEn", "descriptionRu" = EXCLUDED."descriptionRu", "descriptionEn" = EXCLUDED."descriptionEn", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "experience_entries" ("id", "order", "titleRu", "titleEn", "placeRu", "placeEn", "periodRu", "periodEn", "descriptionRu", "descriptionEn", "updatedAt")
VALUES ('ad01c612-a3be-43b4-b97e-15aed2608e68', 2, 'Фуллстек разработчик', 'Fullstack Developer', 'ООО «РСМ-системы»', 'RSM-Systems LLC', 'Январь 2022 — Ноябрь 2022 · 11 месяцев', 'January 2022 — November 2022 · 11 months', 'Внутренняя CRM-система для ПАО «Газпром нефть»: backend на NestJS, frontend на Vue.js, REST API, бизнес-логика CRM, работа с PostgreSQL и TypeORM, исправление production-багов.', 'Internal CRM system for Gazprom Neft PJSC: backend with NestJS, frontend with Vue.js, REST API, CRM business logic, worked with PostgreSQL and TypeORM, fixed production bugs.', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "titleRu" = EXCLUDED."titleRu", "titleEn" = EXCLUDED."titleEn", "placeRu" = EXCLUDED."placeRu", "placeEn" = EXCLUDED."placeEn", "periodRu" = EXCLUDED."periodRu", "periodEn" = EXCLUDED."periodEn", "descriptionRu" = EXCLUDED."descriptionRu", "descriptionEn" = EXCLUDED."descriptionEn", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "experience_entries" ("id", "order", "titleRu", "titleEn", "placeRu", "placeEn", "periodRu", "periodEn", "descriptionRu", "descriptionEn", "updatedAt")
VALUES ('90e3781a-3b66-4eef-aa79-6003d767dee7', 3, 'Fullstack разработчик', 'Fullstack Developer', 'ООО «ИНФИНИТИ», Тольятти', 'INFINITY LLC, Tolyatti', 'Июнь 2020 — Декабрь 2021 · 1 год 7 месяцев', 'June 2020 — December 2021 · 1 year 7 months', 'Криптовалютная платформа (NDA): backend на Express.js, интеграции с Bitcoin Core и Web3, асинхронное взаимодействие сервисов через Apache Kafka, realtime-функциональность на Socket.IO, PostgreSQL и Sequelize ORM, аутентификация и защита приложения.', 'Cryptocurrency platform (NDA): backend on Express.js, integrations with Bitcoin Core and Web3, asynchronous service communication via Apache Kafka, realtime functionality with Socket.IO, PostgreSQL and Sequelize ORM, application authentication and security.', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "titleRu" = EXCLUDED."titleRu", "titleEn" = EXCLUDED."titleEn", "placeRu" = EXCLUDED."placeRu", "placeEn" = EXCLUDED."placeEn", "periodRu" = EXCLUDED."periodRu", "periodEn" = EXCLUDED."periodEn", "descriptionRu" = EXCLUDED."descriptionRu", "descriptionEn" = EXCLUDED."descriptionEn", "updatedAt" = EXCLUDED."updatedAt";

INSERT INTO "experience_entries" ("id", "order", "titleRu", "titleEn", "placeRu", "placeEn", "periodRu", "periodEn", "descriptionRu", "descriptionEn", "updatedAt")
VALUES ('7686752f-b93c-4470-b18f-c3f4b157f08d', 4, 'Программист JavaScript', 'JavaScript Programmer', 'ИП Скибин', 'Sole Proprietor Skibin', 'Май 2019 — Июнь 2020 · 1 год 2 месяца', 'May 2019 — June 2020 · 1 year 2 months', 'Небольшая web-студия, разработка проектов на Node.js.', 'Small web studio, worked on Node.js projects.', NOW())
ON CONFLICT (id) DO UPDATE SET "order" = EXCLUDED."order", "titleRu" = EXCLUDED."titleRu", "titleEn" = EXCLUDED."titleEn", "placeRu" = EXCLUDED."placeRu", "placeEn" = EXCLUDED."placeEn", "periodRu" = EXCLUDED."periodRu", "periodEn" = EXCLUDED."periodEn", "descriptionRu" = EXCLUDED."descriptionRu", "descriptionEn" = EXCLUDED."descriptionEn", "updatedAt" = EXCLUDED."updatedAt";
