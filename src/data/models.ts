export type AIModel = {
  slug: string;
  name: string;
  company: string;
  category: string;
  context: string;
  input: string;
  output: string;
  releaseDate: string;
  description: string;
  capabilities: string[];
  modalities: string[];
};

export const models: AIModel[] = [
  {
    slug: "gpt-5-1",
    name: "GPT-5.1",
    company: "OpenAI",
    category: "Reasoning",
    context: "400K",
    input: "$1.25",
    output: "$10.00",
    releaseDate: "2025-11-12",
    description:
      "An advanced AI model designed for reasoning, problem solving and general-purpose intelligence.",
    capabilities: ["Reasoning", "Coding", "Analysis", "Instruction Following"],
    modalities: ["Text", "Image"],
  },
  {
    slug: "claude-sonnet-4-5",
    name: "Claude Sonnet 4.5",
    company: "Anthropic",
    category: "Reasoning",
    context: "200K",
    input: "$3.00",
    output: "$15.00",
    releaseDate: "2025-09-29",
    description:
      "A capable AI model designed for coding, complex reasoning and professional workflows.",
    capabilities: ["Coding", "Reasoning", "Analysis", "Writing"],
    modalities: ["Text", "Image"],
  },
  {
    slug: "gemini-2-5-pro",
    name: "Gemini 2.5 Pro",
    company: "Google",
    category: "Multimodal",
    context: "1M",
    input: "$1.25",
    output: "$10.00",
    releaseDate: "2025-03-25",
    description:
      "A multimodal AI model designed to understand and process different types of information.",
    capabilities: ["Reasoning", "Coding", "Long Context", "Analysis"],
    modalities: ["Text", "Image", "Audio", "Video"],
  },
  {
    slug: "deepseek-v3",
    name: "DeepSeek V3",
    company: "DeepSeek",
    category: "Chat",
    context: "128K",
    input: "$0.27",
    output: "$1.10",
    releaseDate: "2024-12-26",
    description:
      "An AI language model built for general-purpose conversation and technical tasks.",
    capabilities: ["Coding", "Chat", "Reasoning"],
    modalities: ["Text"],
  },
  {
    slug: "llama-4-maverick",
    name: "Llama 4 Maverick",
    company: "Meta",
    category: "Multimodal",
    context: "1M",
    input: "$0.20",
    output: "$0.60",
    releaseDate: "2025-04-05",
    description:
      "An open-weight multimodal model from Meta for a variety of AI applications.",
    capabilities: ["Multimodal", "Coding", "Reasoning"],
    modalities: ["Text", "Image"],
  },
];
