import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const MAIN_PROFILE_ID = "main"

async function main() {
  // Only ever seed an empty database. This script runs on every container
  // start (see backend/Dockerfile) so it must not clobber real edits made
  // through /admin after the first boot.
  const alreadySeeded = await prisma.skillGroup.count()
  if (alreadySeeded > 0) {
    console.log("Database already has content — skipping seed.")
    return
  }

  await prisma.profile.upsert({
    where: { id: MAIN_PROFILE_ID },
    update: {},
    create: { id: MAIN_PROFILE_ID },
  })

  await prisma.profile.update({
    where: { id: MAIN_PROFILE_ID },
    data: {
      nameRu: "Сергей Михалёв",
      nameEn: "Sergey Mikhalev",
      roleRu: "Fullstack-разработчик (Node.js / NestJS)",
      roleEn: "Fullstack Developer (Node.js / NestJS)",
      locationRu: "Тольятти, Россия",
      locationEn: "Tolyatti, Russia",
      bioShortRu:
        "Backend-разработчик (Node.js / NestJS) с 7+ годами опыта разработки backend-сервисов, микросервисной архитектуры и высоконагруженных web-приложений.",
      bioShortEn:
        "Backend developer (Node.js / NestJS) with 7+ years of experience building backend services, microservice architecture, and high-load web applications.",
      bioFullRu: `Backend-разработчик (Node.js / NestJS) с 7+ годами опыта разработки backend-сервисов, микросервисной архитектуры и высоконагруженных web-приложений.

Специализируюсь на проектировании REST API, реализации поисковых сервисов, интеграции микросервисов и разработке событийной архитектуры.

Имею большой опыт работы с NestJS, Express.js, PostgreSQL, MongoDB, Redis, Kafka, RabbitMQ, OpenSearch и ScyllaDB.

Использую современные AI-инструменты (OpenAI Codex и Claude) для ускорения разработки, анализа кода, рефакторинга и генерации тестов, сохраняя полный контроль над архитектурой решений и качеством кода.

Разрабатываю unit- и интеграционные тесты на Jest, участвую в code review, проектировании архитектуры сервисов и расследовании production-инцидентов.

Есть опыт полного цикла разработки: от проектирования архитектуры и реализации бизнес-логики до деплоя, сопровождения и оптимизации production-систем.

Дополнительно имею опыт fullstack-разработки на Vue.js и React/React Native.`,
      bioFullEn: `Backend developer (Node.js / NestJS) with 7+ years of experience building backend services, microservice architecture, and high-load web applications.

I specialize in designing REST APIs, building search services, integrating microservices, and developing event-driven architecture.

Extensive experience with NestJS, Express.js, PostgreSQL, MongoDB, Redis, Kafka, RabbitMQ, OpenSearch, and ScyllaDB.

I use modern AI tools (OpenAI Codex and Claude) to speed up development, code analysis, refactoring, and test generation, while keeping full control over solution architecture and code quality.

I write unit and integration tests with Jest, participate in code review, service architecture design, and production incident investigation.

Full-cycle development experience: from architecture design and business logic implementation to deployment, maintenance, and optimization of production systems.

I also have experience with fullstack development using Vue.js and React/React Native.`,
      email: "smichalev95@gmail.com",
      phone: "+7 (939) 713-78-00",
      telegram: "https://t.me/michalev",
      github: "https://github.com/smichalev",
      educationPlaceRu: "Самарский государственный экономический университет",
      educationPlaceEn: "Samara State University of Economics",
      educationCityRu: "Самара",
      educationCityEn: "Samara",
      educationYear: "2017",
      educationDegreeRu: "Высшее образование",
      educationDegreeEn: "Higher education",
      educationMajorRu: "Экономика предприятия и организаций",
      educationMajorEn: "Enterprise and Organizational Economics",
    },
  })

  await prisma.profileFact.deleteMany({ where: { profileId: MAIN_PROFILE_ID } })
  await prisma.profileFact.createMany({
    data: [
      { profileId: MAIN_PROFILE_ID, order: 0, textRu: "7 лет 2 месяца опыта", textEn: "7 years 2 months of experience" },
      { profileId: MAIN_PROFILE_ID, order: 1, textRu: "200 000 ₽ на руки", textEn: "₽200,000 net" },
      { profileId: MAIN_PROFILE_ID, order: 2, textRu: "Удалённо / гибрид", textEn: "Remote / hybrid" },
    ],
  })

  await prisma.profileLanguage.deleteMany({ where: { profileId: MAIN_PROFILE_ID } })
  await prisma.profileLanguage.createMany({
    data: [
      {
        profileId: MAIN_PROFILE_ID,
        order: 0,
        nameRu: "Русский",
        nameEn: "Russian",
        levelRu: "Родной",
        levelEn: "Native",
      },
      {
        profileId: MAIN_PROFILE_ID,
        order: 1,
        nameRu: "Английский",
        nameEn: "English",
        levelRu: "B1 — средний",
        levelEn: "B1 — Intermediate",
      },
    ],
  })

  await prisma.skill.deleteMany({})
  await prisma.skillGroup.deleteMany({})

  const skillGroups: { titleRu: string; titleEn: string; skills: string[] }[] = [
    {
      titleRu: "Backend",
      titleEn: "Backend",
      skills: ["Node.js", "NestJS", "Express.js", "TypeScript", "JavaScript"],
    },
    {
      titleRu: "Базы данных и очереди",
      titleEn: "Databases & Queues",
      skills: [
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "Memcached",
        "ScyllaDB",
        "Elasticsearch",
        "OpenSearch",
        "Apache Kafka",
        "RabbitMQ",
        "BullMQ",
        "TypeORM",
      ],
    },
    {
      titleRu: "Frontend",
      titleEn: "Frontend",
      skills: ["React", "Vue.js", "React Native", "HTML", "CSS"],
    },
    {
      titleRu: "Инфраструктура и другое",
      titleEn: "Infrastructure & Other",
      skills: ["Docker", "Kubernetes", "Git", "WebSocket", "Bitcoin Core", "Web3"],
    },
  ]

  for (const [groupIndex, group] of skillGroups.entries()) {
    await prisma.skillGroup.create({
      data: {
        order: groupIndex,
        titleRu: group.titleRu,
        titleEn: group.titleEn,
        skills: {
          create: group.skills.map((name, skillIndex) => ({
            order: skillIndex,
            nameRu: name,
            nameEn: name,
          })),
        },
      },
    })
  }

  await prisma.experience.deleteMany({})
  await prisma.experience.createMany({
    data: [
      {
        order: 0,
        titleRu: "Разработчик Node.js",
        titleEn: "Node.js Developer",
        placeRu: "MyGig",
        placeEn: "MyGig",
        periodRu: "Февраль 2024 — Июль 2026 · 2 года 6 месяцев",
        periodEn: "February 2024 — July 2026 · 2 years 6 months",
        descriptionRu:
          "Проектирование микросервисной архитектуры, разработка backend-сервисов на NestJS, REST API, интеграции через Kafka и RabbitMQ, контейнеризация в Docker, деплой и сопровождение в Kubernetes, unit- и integration-тесты на Jest, code review, диагностика production-инцидентов. Разрабатывал поисковые сервисы на OpenSearch и сложные запросы/агрегации для MongoDB.",
        descriptionEn:
          "Designed microservice architecture, developed backend services with NestJS, REST APIs, integrations via Kafka and RabbitMQ, containerized services with Docker, deployed and maintained them on Kubernetes, wrote unit and integration tests with Jest, code review, production incident diagnostics. Built search services on OpenSearch and complex queries/aggregations for MongoDB.",
      },
      {
        order: 1,
        titleRu: "Node.js Developer",
        titleEn: "Node.js Developer",
        placeRu: "IT & SEA Solutions (Германия)",
        placeEn: "IT & SEA Solutions (Germany)",
        periodRu: "Январь 2023 — Февраль 2024 · 1 год 2 месяца",
        periodEn: "January 2023 — February 2024 · 1 year 2 months",
        descriptionRu:
          "Разработка backend-микросервисов на NestJS, проектирование REST API, участие в разработке frontend на React. Реализовал realtime-уведомления через WebSocket + PUSH и интегрировал ChatGPT во внутренний корпоративный чат.",
        descriptionEn:
          "Developed backend microservices with NestJS, designed REST APIs, contributed to frontend development with React. Implemented realtime notifications via WebSocket + PUSH and integrated ChatGPT into an internal corporate chat.",
      },
      {
        order: 2,
        titleRu: "Фуллстек разработчик",
        titleEn: "Fullstack Developer",
        placeRu: "ООО «РСМ-системы»",
        placeEn: "RSM-Systems LLC",
        periodRu: "Январь 2022 — Ноябрь 2022 · 11 месяцев",
        periodEn: "January 2022 — November 2022 · 11 months",
        descriptionRu:
          "Внутренняя CRM-система для ПАО «Газпром нефть»: backend на NestJS, frontend на Vue.js, REST API, бизнес-логика CRM, работа с PostgreSQL и TypeORM, исправление production-багов.",
        descriptionEn:
          "Internal CRM system for Gazprom Neft PJSC: backend with NestJS, frontend with Vue.js, REST API, CRM business logic, worked with PostgreSQL and TypeORM, fixed production bugs.",
      },
      {
        order: 3,
        titleRu: "Fullstack разработчик",
        titleEn: "Fullstack Developer",
        placeRu: "ООО «ИНФИНИТИ», Тольятти",
        placeEn: "INFINITY LLC, Tolyatti",
        periodRu: "Июнь 2020 — Декабрь 2021 · 1 год 7 месяцев",
        periodEn: "June 2020 — December 2021 · 1 year 7 months",
        descriptionRu:
          "Криптовалютная платформа (NDA): backend на Express.js, интеграции с Bitcoin Core и Web3, асинхронное взаимодействие сервисов через Apache Kafka, realtime-функциональность на Socket.IO, PostgreSQL и Sequelize ORM, аутентификация и защита приложения.",
        descriptionEn:
          "Cryptocurrency platform (NDA): backend on Express.js, integrations with Bitcoin Core and Web3, asynchronous service communication via Apache Kafka, realtime functionality with Socket.IO, PostgreSQL and Sequelize ORM, application authentication and security.",
      },
      {
        order: 4,
        titleRu: "Программист JavaScript",
        titleEn: "JavaScript Programmer",
        placeRu: "ИП Скибин",
        placeEn: "Sole Proprietor Skibin",
        periodRu: "Май 2019 — Июнь 2020 · 1 год 2 месяца",
        periodEn: "May 2019 — June 2020 · 1 year 2 months",
        descriptionRu: "Небольшая web-студия, разработка проектов на Node.js.",
        descriptionEn: "Small web studio, worked on Node.js projects.",
      },
    ],
  })

  console.log("Seed complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
