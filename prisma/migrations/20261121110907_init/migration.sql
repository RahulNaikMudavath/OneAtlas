-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "contextWindow" TEXT NOT NULL,
    "inputPrice" DOUBLE PRECISION NOT NULL,
    "outputPrice" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "capabilities" TEXT[],
    "modalities" TEXT[],
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelProvider" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,

    CONSTRAINT "ModelProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Benchmark" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "source" TEXT,
    "evaluatedAt" TIMESTAMP(3),
    "modelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Benchmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Model_slug_key" ON "Model"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_name_key" ON "Provider"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ModelProvider_modelId_providerId_key" ON "ModelProvider"("modelId", "providerId");

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelProvider" ADD CONSTRAINT "ModelProvider_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelProvider" ADD CONSTRAINT "ModelProvider_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Benchmark" ADD CONSTRAINT "Benchmark_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
