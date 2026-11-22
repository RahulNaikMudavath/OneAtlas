import { PrismaClient } from "@prisma/client";
import { models } from "../src/data/models";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting OneAtlas database seeding...");

  const benchmarkScores: Record<
    string,
    { overall: number; reasoning: number; coding: number; knowledge: number }
  > = {
    "gpt-5-1": { overall: 96, reasoning: 95, coding: 97, knowledge: 94 },
    "claude-sonnet-4-5": { overall: 94, reasoning: 96, coding: 98, knowledge: 91 },
    "gemini-2-5-pro": { overall: 92, reasoning: 94, coding: 91, knowledge: 96 },
    "deepseek-v3": { overall: 89, reasoning: 91, coding: 93, knowledge: 86 },
    "llama-4-maverick": { overall: 86, reasoning: 85, coding: 87, knowledge: 88 },
  };

  // Illustrative provider performance data.
  // These are demo values, NOT live measurements.
  const providerMetrics: Record<
    string,
    { latencyMs: number; uptimePercent: number; isAvailable: boolean }
  > = {
    "gpt-5-1": {
      latencyMs: 320,
      uptimePercent: 99.95,
      isAvailable: true,
    },
    "claude-sonnet-4-5": {
      latencyMs: 280,
      uptimePercent: 99.92,
      isAvailable: true,
    },
    "gemini-2-5-pro": {
      latencyMs: 250,
      uptimePercent: 99.90,
      isAvailable: true,
    },
    "deepseek-v3": {
      latencyMs: 410,
      uptimePercent: 99.80,
      isAvailable: true,
    },
    "llama-4-maverick": {
      latencyMs: 350,
      uptimePercent: 99.85,
      isAvailable: true,
    },
  };

  for (const model of models) {
    const inputPrice = Number(model.input.replace("$", ""));
    const outputPrice = Number(model.output.replace("$", ""));

    const company = await prisma.company.upsert({
      where: { name: model.company },
      update: {},
      create: {
        name: model.company,
        description: `${model.company} AI research and model development.`,
        type: "AI Company",
      },
    });

    const provider = await prisma.provider.upsert({
      where: { name: model.company },
      update: {},
      create: {
        name: model.company,
      },
    });

    const savedModel = await prisma.model.upsert({
      where: { slug: model.slug },
      update: {
        name: model.name,
        category: model.category,
        contextWindow: model.context,
        inputPrice,
        outputPrice,
        description: model.description,
        capabilities: model.capabilities,
        modalities: model.modalities,
        companyId: company.id,
      },
      create: {
        slug: model.slug,
        name: model.name,
        category: model.category,
        contextWindow: model.context,
        inputPrice,
        outputPrice,
        description: model.description,
        capabilities: model.capabilities,
        modalities: model.modalities,
        companyId: company.id,
      },
    });

    const metrics = providerMetrics[model.slug];

    await prisma.modelProvider.upsert({
      where: {
        modelId_providerId_endpointTag: {
          modelId: savedModel.id,
          providerId: provider.id,
          endpointTag: "default",
        },
      },
      update: {
        endpointTag: "default",
        inputPricePerMillion: inputPrice,
        outputPricePerMillion: outputPrice,
        latencyMs: metrics?.latencyMs ?? null,
        uptimePercent: metrics?.uptimePercent ?? null,
        isAvailable: metrics?.isAvailable ?? true,
        lastCheckedAt: new Date(),
      },
      create: {
        modelId: savedModel.id,
        providerId: provider.id,
        endpointTag: "default",
        inputPricePerMillion: inputPrice,
        outputPricePerMillion: outputPrice,
        latencyMs: metrics?.latencyMs ?? null,
        uptimePercent: metrics?.uptimePercent ?? null,
        isAvailable: metrics?.isAvailable ?? true,
        lastCheckedAt: new Date(),
      },
    });

    const scores = benchmarkScores[model.slug];

    if (scores) {
      for (const [category, score] of Object.entries(scores)) {
        const benchmarkName = `${category} demonstration score`;

        const existing = await prisma.benchmark.findFirst({
          where: {
            modelId: savedModel.id,
            name: benchmarkName,
          },
        });

        if (existing) {
          await prisma.benchmark.update({
            where: { id: existing.id },
            data: {
              score,
              source: "Illustrative demonstration data",
              category,
            },
          });
        } else {
          await prisma.benchmark.create({
            data: {
              modelId: savedModel.id,
              name: benchmarkName,
              category,
              score,
              source: "Illustrative demonstration data",
            },
          });
        }
      }
    }

    console.log(`Seeded: ${model.name} with provider intelligence`);
  }

  console.log("OneAtlas database seeding completed!");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
