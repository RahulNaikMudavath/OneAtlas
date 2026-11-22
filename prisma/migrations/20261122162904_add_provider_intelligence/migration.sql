-- AlterTable
ALTER TABLE "ModelProvider" ADD COLUMN     "inputPricePerMillion" DOUBLE PRECISION,
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastCheckedAt" TIMESTAMP(3),
ADD COLUMN     "latencyMs" DOUBLE PRECISION,
ADD COLUMN     "outputPricePerMillion" DOUBLE PRECISION,
ADD COLUMN     "uptimePercent" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "ModelProvider_providerId_idx" ON "ModelProvider"("providerId");

-- CreateIndex
CREATE INDEX "ModelProvider_modelId_idx" ON "ModelProvider"("modelId");
