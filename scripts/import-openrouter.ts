import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BASE_URL = "https://openrouter.ai/api/v1";
const CONCURRENCY = 5;

type OpenRouterModel = {
  id: string;
  canonical_slug?: string;
  name: string;
  description?: string;
  created?: number;
  context_length?: number;
  architecture?: {
    input_modalities?: string[];
    output_modalities?: string[];
  };
  pricing?: {
    prompt?: string;
    completion?: string;
  };
  supported_parameters?: string[];
  benchmarks?: Record<string, unknown>;
};

type ProviderEndpoint = {
  name?: string;
  provider_name?: string;
  tag?: string;
  service_tier?: string | null;
  quantization?: string;
  context_length?: number;
  max_prompt_tokens?: number;
  max_completion_tokens?: number;
  pricing?: {
    prompt?: string;
    completion?: string;
  };
  uptime_last_30m?: number | null;
  latency_last_30m?: number | null;
  status?: number;
};

function pricePerMillion(value?: string): number {
  const price = Number(value ?? 0);
  return Number.isFinite(price) ? price * 1_000_000 : 0;
}

function formatContext(tokens?: number): string {
  if (!tokens) return "Unknown";
  if (tokens >= 1_000_000) {
    return `${Number((tokens / 1_000_000).toFixed(2))}M`;
  }
  if (tokens >= 1_000) {
    return `${Number((tokens / 1_000).toFixed(2))}K`;
  }
  return String(tokens);
}

function getCompanyName(model: OpenRouterModel): string {
  const fromName = model.name.split(":")[0]?.trim();
  if (fromName) return fromName;

  return model.id.split("/")[0] ?? "Unknown";
}

function getCategory(
  input: string[],
  output: string[],
  parameters: string[]
): string {
  if (input.length > 1 || input.includes("image") ||
      input.includes("audio") || input.includes("video")) {
    return "Multimodal";
  }

  if (
    parameters.includes("reasoning") ||
    parameters.includes("include_reasoning")
  ) {
    return "Reasoning";
  }

  if (parameters.includes("tools") || parameters.includes("tool_choice")) {
    return "Tool Use";
  }

  return "Chat";
}

function getCapabilities(parameters: string[]): string[] {
  const capabilities: string[] = [];

  const mapping: Record<string, string> = {
    reasoning: "Reasoning",
    include_reasoning: "Reasoning",
    tools: "Tool Calling",
    tool_choice: "Tool Calling",
    response_format: "Structured Output",
    structured_outputs: "Structured Output",
    temperature: "Temperature Control",
    seed: "Seed Control",
  };

  for (const parameter of parameters) {
    const capability = mapping[parameter];
    if (capability && !capabilities.includes(capability)) {
      capabilities.push(capability);
    }
  }

  return capabilities;
}

function getSlug(id: string): string {
  return id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "OneAtlas-Model-Importer/1.0",
    },
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${url}`);
  }

  return response.json() as Promise<T>;
}

async function saveBenchmarks(
  modelId: string,
  benchmarks?: Record<string, unknown>
) {
  const artificialAnalysis = benchmarks?.artificial_analysis;

  if (
    !artificialAnalysis ||
    typeof artificialAnalysis !== "object"
  ) {
    return;
  }

  for (const [name, value] of Object.entries(artificialAnalysis)) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      continue;
    }

    await prisma.benchmark.upsert({
      where: { id: `${modelId}-${name}` },
      update: {
        score: value,
        source: "OpenRouter: Artificial Analysis",
        category: name,
      },
      create: {
        id: `${modelId}-${name}`,
        modelId,
        name,
        category: name,
        score: value,
        source: "OpenRouter: Artificial Analysis",
      },
    });
  }
}

async function importModel(model: OpenRouterModel) {
  const inputModalities = model.architecture?.input_modalities ?? ["text"];
  const outputModalities = model.architecture?.output_modalities ?? ["text"];
  const parameters = model.supported_parameters ?? [];

  const companyName = getCompanyName(model);

  const company = await prisma.company.upsert({
    where: { name: companyName },
    update: {},
    create: {
      name: companyName,
      description: `${companyName} model publisher.`,
      type: "AI Company / Model Publisher",
    },
  });

  const slug = getSlug(model.id);

  const savedModel = await prisma.model.upsert({
    where: { slug },
    update: {
      name: model.name,
      description: model.description ?? null,
      category: getCategory(inputModalities, outputModalities, parameters),
      contextWindow: formatContext(model.context_length),
      inputPrice: pricePerMillion(model.pricing?.prompt),
      outputPrice: pricePerMillion(model.pricing?.completion),
      capabilities: getCapabilities(parameters),
      modalities: [...new Set([...inputModalities, ...outputModalities])],
      source: "OpenRouter",
      sourceModelId: model.id,
      sourceCreatedAt: model.created
        ? new Date(model.created * 1000)
        : null,
      supportedParameters: parameters,
      lastSyncedAt: new Date(),
      companyId: company.id,
    },
    create: {
      slug,
      name: model.name,
      description: model.description ?? null,
      category: getCategory(inputModalities, outputModalities, parameters),
      contextWindow: formatContext(model.context_length),
      inputPrice: pricePerMillion(model.pricing?.prompt),
      outputPrice: pricePerMillion(model.pricing?.completion),
      capabilities: getCapabilities(parameters),
      modalities: [...new Set([...inputModalities, ...outputModalities])],
      source: "OpenRouter",
      sourceModelId: model.id,
      sourceCreatedAt: model.created
        ? new Date(model.created * 1000)
        : null,
      supportedParameters: parameters,
      lastSyncedAt: new Date(),
      companyId: company.id,
    },
  });

  await saveBenchmarks(savedModel.id, model.benchmarks);

  const detailUrl =
    `${BASE_URL}/models/${model.id}/endpoints`;

  const details = await fetchJson<{
    data?: { endpoints?: ProviderEndpoint[] };
  }>(detailUrl);

  const endpoints = details.data?.endpoints ?? [];

  for (const endpoint of endpoints) {
    if (!endpoint.provider_name) continue;

    const provider = await prisma.provider.upsert({
      where: { name: endpoint.provider_name },
      update: {},
      create: { name: endpoint.provider_name },
    });

    const endpointTag = [
      endpoint.tag ?? "default",
      endpoint.service_tier ?? "standard",
      endpoint.quantization ?? "unknown",
    ].join("|");

    await prisma.modelProvider.upsert({
      where: {
        modelId_providerId_endpointTag: {
          modelId: savedModel.id,
          providerId: provider.id,
          endpointTag,
        },
      },
      update: {
        endpointName: endpoint.name ?? null,
        serviceTier: endpoint.service_tier ?? null,
        inputPricePerMillion: pricePerMillion(endpoint.pricing?.prompt),
        outputPricePerMillion: pricePerMillion(endpoint.pricing?.completion),
        maxPromptTokens: endpoint.max_prompt_tokens ?? null,
        maxCompletionTokens: endpoint.max_completion_tokens ?? null,
        uptimeLast30m: endpoint.uptime_last_30m ?? null,
        latencyMs: endpoint.latency_last_30m ?? null,
        lastCheckedAt: new Date(),
      },
      create: {
        modelId: savedModel.id,
        providerId: provider.id,
        endpointTag,
        endpointName: endpoint.name ?? null,
        serviceTier: endpoint.service_tier ?? null,
        inputPricePerMillion: pricePerMillion(endpoint.pricing?.prompt),
        outputPricePerMillion: pricePerMillion(endpoint.pricing?.completion),
        maxPromptTokens: endpoint.max_prompt_tokens ?? null,
        maxCompletionTokens: endpoint.max_completion_tokens ?? null,
        uptimeLast30m: endpoint.uptime_last_30m ?? null,
        latencyMs: endpoint.latency_last_30m ?? null,
        lastCheckedAt: new Date(),
      },
    });
  }

  return {
    name: model.name,
    providers: endpoints.length,
  };
}

async function main() {
  console.log("Fetching OpenRouter model catalogue...");

  const catalogue = await fetchJson<{ data: OpenRouterModel[] }>(
    `${BASE_URL}/models`
  );

  const models = catalogue.data ?? [];

  console.log(`Found ${models.length} models.`);

  let completed = 0;
  let failed = 0;

  for (let i = 0; i < models.length; i += CONCURRENCY) {
    const batch = models.slice(i, i + CONCURRENCY);

    const results = await Promise.allSettled(
      batch.map((model) => importModel(model))
    );

    for (const result of results) {
      completed++;

      if (result.status === "fulfilled") {
        console.log(
          `[${completed}/${models.length}] Imported: ${result.value.name}`
        );
      } else {
        failed++;
        console.error(
          `[${completed}/${models.length}] Import failed:`,
          result.reason
        );
      }
    }
  }

  console.log("\nImport completed.");
  console.log(`Processed: ${completed}`);
  console.log(`Failed: ${failed}`);

  const [modelCount, companyCount, providerCount, endpointCount] =
    await Promise.all([
      prisma.model.count(),
      prisma.company.count(),
      prisma.provider.count(),
      prisma.modelProvider.count(),
    ]);

  console.log({
    modelsInDatabase: modelCount,
    companiesInDatabase: companyCount,
    providersInDatabase: providerCount,
    providerEndpointsInDatabase: endpointCount,
  });
}

main()
  .catch((error) => {
    console.error("Import failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
