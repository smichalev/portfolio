-- CreateTable
CREATE TABLE "profile" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "nameRu" TEXT NOT NULL DEFAULT '',
    "nameEn" TEXT NOT NULL DEFAULT '',
    "roleRu" TEXT NOT NULL DEFAULT '',
    "roleEn" TEXT NOT NULL DEFAULT '',
    "locationRu" TEXT NOT NULL DEFAULT '',
    "locationEn" TEXT NOT NULL DEFAULT '',
    "bioShortRu" TEXT NOT NULL DEFAULT '',
    "bioShortEn" TEXT NOT NULL DEFAULT '',
    "bioFullRu" TEXT NOT NULL DEFAULT '',
    "bioFullEn" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "telegram" TEXT NOT NULL DEFAULT '',
    "educationPlaceRu" TEXT NOT NULL DEFAULT '',
    "educationPlaceEn" TEXT NOT NULL DEFAULT '',
    "educationCityRu" TEXT NOT NULL DEFAULT '',
    "educationCityEn" TEXT NOT NULL DEFAULT '',
    "educationYear" TEXT NOT NULL DEFAULT '',
    "educationDegreeRu" TEXT NOT NULL DEFAULT '',
    "educationDegreeEn" TEXT NOT NULL DEFAULT '',
    "educationMajorRu" TEXT NOT NULL DEFAULT '',
    "educationMajorEn" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_facts" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "textRu" TEXT NOT NULL,
    "textEn" TEXT NOT NULL,
    "profileId" TEXT NOT NULL DEFAULT 'main',

    CONSTRAINT "profile_facts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_languages" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "nameRu" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "levelRu" TEXT NOT NULL,
    "levelEn" TEXT NOT NULL,
    "profileId" TEXT NOT NULL DEFAULT 'main',

    CONSTRAINT "profile_languages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "profile_facts" ADD CONSTRAINT "profile_facts_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_languages" ADD CONSTRAINT "profile_languages_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
