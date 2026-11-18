-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "analyses" (
    "id" UUID NOT NULL,
    "score" INTEGER NOT NULL,
    "indicators" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "riskLevel" "RiskLevel" NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "analyses_pkey" PRIMARY KEY ("id")
);
