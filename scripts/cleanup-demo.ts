import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const demoSlugs = [
  "claude-sonnet-4-5",
  "deepseek-v3",
  "gemini-2-5-pro",
  "gpt-5-1",
  "llama-4-maverick",
];

async function main() {
  await prisma.$transaction(async (tx) => {
    const demoModels = await tx.model.findMany({
      where: { slug: { in: demoSlugs } },
      select: { id: true, name: true, slug: true },
    });

    const ids = demoModels.map((model) => model.id);

    console.log("Models selected for cleanup:", demoModels);

    if (ids.length === 0) {
      console.log("No demo models found. Nothing to delete.");
      return;
    }

    await tx.modelProvider.deleteMany({
      where: { modelId: { in: ids } },
    });

    await tx.benchmark.deleteMany({
      where: { modelId: { in: ids } },
    });

    await tx.model.deleteMany({
      where: { id: { in: ids } },
    });

    await tx.company.deleteMany({
      where: { models: { none: {} } },
    });

    await tx.provider.deleteMany({
      where: { models: { none: {} } },
    });

    console.log(`Successfully removed ${ids.length} demo models.`);
  });

  const remaining = await prisma.model.count();
  const benchmarks = await prisma.benchmark.count();

  console.log("Remaining models:", remaining);
  console.log("Remaining benchmark records:", benchmarks);
}

main()
  .catch((error) => {
    console.error("Cleanup failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
