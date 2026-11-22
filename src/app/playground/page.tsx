"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Code2,
  Copy,
  Terminal,
  Check,
  Sparkles,
  Zap,
  Play,
  Cpu,
} from "lucide-react";

type Model = {
  id: string;
  slug: string;
  name: string;
  category: string;
  contextWindow: string;
  inputPrice?: number | null;
  outputPrice?: number | null;
  company: { name: string };
};

function formatPrice(value?: number | null): string {
  if (value === null || value === undefined) return "N/A";
  const num = Number(value);
  if (!Number.isFinite(num)) return "N/A";
  return `$${num.toFixed(2)}`;
}

export default function PlaygroundPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [prompt, setPrompt] = useState(
    "Explain quantum computing principles and recent fault-tolerant qubit milestones in simple terms."
  );
  const [language, setLanguage] = useState<"javascript" | "python">(
    "javascript"
  );
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/models")
      .then((response) => {
        if (!response.ok) throw new Error("Could not load models");
        return response.json();
      })
      .then((result) => {
        const data = result.data || [];
        setModels(data);
        if (data.length) setSelectedSlug(data[0].slug);
      })
      .catch(() => setError("Unable to load models. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const selectedModel = models.find(
    (model) => model.slug === selectedSlug
  );

  const generatedCode = useMemo(() => {
    const safePrompt = JSON.stringify(prompt);
    const modelId = selectedModel?.slug || "meta-llama/llama-3.3-70b-instruct";

    if (language === "python") {
      return `import os
import requests

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "YOUR_API_KEY")

response = requests.post(
    url="https://openrouter.ai/api/v1/chat/completions",
    headers={
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "https://oneatlas.dev",
        "X-Title": "OneAtlas Intelligence",
        "Content-Type": "application/json"
    },
    json={
        "model": "${modelId}",
        "messages": [
            {"role": "user", "content": ${safePrompt}}
        ],
        "temperature": 0.7
    }
)

data = response.json()
print(data["choices"][0]["message"]["content"])`;
    }

    return `import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "YOUR_API_KEY",
  defaultHeaders: {
    "HTTP-Referer": "https://oneatlas.dev",
    "X-Title": "OneAtlas Intelligence",
  },
});

const completion = await openai.chat.completions.create({
  model: "${modelId}",
  messages: [
    { role: "user", content: ${safePrompt} }
  ],
  temperature: 0.7,
});

console.log(completion.choices[0].message.content);`;
  }, [language, prompt, selectedModel]);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Clipboard copy failed. Please select and copy manually.");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07080f] px-5 py-8 text-white sm:px-10">
      {/* Ambient Aurora Glow Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute -right-48 top-1/4 h-[600px] w-[600px] rounded-full bg-cyan-600/10 blur-[150px]" />
        <div className="absolute bottom-10 left-1/3 h-[500px] w-[500px] rounded-full bg-fuchsia-600/08 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Back Link */}
        <Link
          href="/"
          className="group mb-8 inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur-md transition-all duration-200 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Back to Explorer
        </Link>

        {/* Hero Header */}
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-violet-300 backdrop-blur-md">
            <Terminal size={14} className="text-violet-400" />
            Developer Integration Suite
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            API{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              Playground
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Select foundation models, prototype prompts, and generate production-ready OpenAI-compatible and Python SDK integration snippets.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-slate-900/40 p-16 text-center backdrop-blur-xl">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
            <p className="mt-4 text-sm font-medium text-slate-300">Loading playground models...</p>
          </div>
        ) : error && models.length === 0 ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-300 backdrop-blur-xl">
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Configuration Column (2 cols) */}
            <section className="space-y-6 lg:col-span-2">
              <div className="rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6 backdrop-blur-xl">
                <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-white">
                  <Code2 size={18} className="text-violet-400" />
                  Target Architecture
                </h2>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Select AI Model
                </label>

                <select
                  value={selectedSlug}
                  onChange={(e) => setSelectedSlug(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.09] bg-slate-900/80 p-3 text-sm text-white outline-none transition-all focus:border-violet-500/60"
                >
                  {models.map((model) => (
                    <option key={model.slug} value={model.slug} className="bg-slate-900 text-white">
                      {model.name} — {model.company?.name} ({model.category})
                    </option>
                  ))}
                </select>

                {selectedModel && (
                  <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className="font-bold text-white">{selectedModel.name}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {selectedModel.company?.name} · {selectedModel.category}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-3 text-xs">
                      <div>
                        <span className="text-slate-500">Context Window</span>
                        <p className="font-mono font-bold text-slate-200">
                          {selectedModel.contextWindow}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500">In / Out 1M</span>
                        <p className="font-mono font-bold text-emerald-400">
                          {formatPrice(selectedModel.inputPrice)} / {formatPrice(selectedModel.outputPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Prompt Input Area */}
              <div className="rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6 backdrop-blur-xl">
                <h2 className="mb-3 text-base font-bold text-white">Prompt Message</h2>

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  placeholder="Enter message for prompt execution..."
                  className="w-full resize-y rounded-xl border border-white/[0.09] bg-slate-900/80 p-4 text-sm leading-relaxed text-white placeholder-slate-500 outline-none transition-all focus:border-violet-500/60"
                />

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{prompt.length} characters</span>
                  <span>OpenRouter Universal Format</span>
                </div>
              </div>
            </section>

            {/* Generated Code Column (3 cols) */}
            <section className="lg:col-span-3">
              <div className="flex h-full flex-col justify-between rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6 backdrop-blur-xl">
                <div>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="flex items-center gap-2 text-base font-bold text-white">
                      <Terminal size={18} className="text-violet-400" />
                      Client Implementation Code
                    </h2>

                    {/* Language Switcher Tabs */}
                    <div className="flex rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
                      <button
                        onClick={() => setLanguage("javascript")}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                          language === "javascript"
                            ? "bg-violet-600 text-white shadow"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        TypeScript / JS
                      </button>

                      <button
                        onClick={() => setLanguage("python")}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                          language === "python"
                            ? "bg-violet-600 text-white shadow"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Python Requests
                      </button>
                    </div>
                  </div>

                  {/* Code Block Container */}
                  <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-slate-950">
                    <div className="flex items-center justify-between border-b border-white/[0.08] bg-slate-900/90 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-red-500/80" />
                        <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                        <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                        <span className="ml-2 font-mono text-xs text-slate-400">
                          {language === "python" ? "inference.py" : "inference.ts"}
                        </span>
                      </div>

                      <button
                        onClick={copyCode}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs font-semibold text-violet-300 transition-colors hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white"
                      >
                        {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        {copied ? "Copied to Clipboard!" : "Copy Snippet"}
                      </button>
                    </div>

                    <pre className="min-h-[380px] overflow-x-auto p-5 font-mono text-xs leading-relaxed text-emerald-300">
                      <code>{generatedCode}</code>
                    </pre>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-xs text-slate-400">
                  <p>
                    <span className="font-bold text-cyan-300">Integration Notice:</span> Pass your personal OpenRouter API key via <code className="text-violet-300 font-mono">OPENROUTER_API_KEY</code> environment variable. All requests automatically benefit from multi-provider fallback and lowest-latency routing.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        <footer className="mt-12 border-t border-white/[0.08] py-6 text-center text-xs text-slate-500">
          © 2026 OneAtlas. AI Developer Workspace & SDK Snippet Generator.
        </footer>
      </div>
    </main>
  );
}
