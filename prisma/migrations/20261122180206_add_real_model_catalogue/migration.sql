/*
  Warnings:

  - A unique constraint covering the columns `[modelId,providerId,endpointTag]` on the table `ModelProvider` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ModelProvider_modelId_providerId_key";

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "lastSyncedAt" TIMESTAMP(3),
ADD COLUMN     "releaseDate" TIMESTAMP(3),
ADD COLUMN     "source" TEXT,
ADD COLUMN     "sourceModelId" TEXT,
ADD COLUMN     "supportedParameters" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "ModelProvider" ADD COLUMN     "endpointName" TEXT,
ADD COLUMN     "endpointTag" TEXT NOT NULL DEFAULT 'default',
ADD COLUMN     "maxCompletionTokens" INTEGER,
ADD COLUMN     "maxPromptTokens" INTEGER,
ADD COLUMN     "serviceTier" TEXT,
ADD COLUMN     "uptimeLast30m" DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "ModelProvider_modelId_providerId_endpointTag_key" ON "ModelProvider"("modelId", "providerId", "endpointTag");
