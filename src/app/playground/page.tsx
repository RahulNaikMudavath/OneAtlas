"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Code2,
  Copy,
  Terminal,
  Check,
} from "lucide-react";

type Model = {
  id: string;
  slug: string;
  name: string;
  category: string;
  contextWindow: string;
  inputPrice: number;
  outputPrice: number;
  company: { name: string };
};

export default function PlaygroundPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [prompt, setPrompt] = useState(
    "Explain how artificial intelligence works in simple terms."
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

    if (language === "python") {
      return `import requests

API_KEY = "YOUR_API_KEY"
API_URL = "YOUR_PROVIDER_API_ENDPOINT"

response = requests.post(
    API_URL,
    headers={
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    },
    json={
        "model": "YOUR_MODEL_ID",
        "messages": [
            {"role": "user", "content": ${safePrompt}}
        ]
    }
)

print(response.json())`;
    }

    return `const response = await fetch(
  "YOUR_PROVIDER_API_ENDPOINT",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "YOUR_MODEL_ID",
      messages: [
        { role: "user", content: ${safePrompt} }
      ]
    })
  }
);

const result = await response.json();
console.log(result);`;
  }, [language, prompt]);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Clipboard access failed. Please copy the code manually.");
    }
  }

  return (
    <main className="min-h-screen bg-[#08090d] px-5 py-8 text-white sm:px-10">
      <div className="mx-auto max-w-7xl">

        <Link
          href="/"
          className="mb-9 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to OneAtlas
        </Link>

        <div className="mb-9">
          <div className="mb-3 flex items-center gap-2 text-xs tracking-widest text-violet-400">
            <Terminal size={17} />
            DEVELOPER WORKSPACE
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            API <span className="text-violet-400">Playground</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-zinc-400">
            Explore models, create prompts and generate API integration examples.
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-zinc-400">Loading models...</p>
        ) : error && models.length === 0 ? (
          <p className="rounded-xl border border-red-500/20 p-5 text-sm text-red-400">
            {error}
          </p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-5">

            <section className="space-y-5 lg:col-span-2">
              <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-6">
                <h2 className="mb-5 flex items-center gap-2 font-semibold">
                  <Code2 size={19} className="text-violet-400" />
                  Configuration
                </h2>

                <label className="mb-2 block text-xs text-zinc-400">
                  Select AI Model
                </label>

                <select
                  value={selectedSlug}
                  onChange={(e) => setSelectedSlug(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#08090d] p-3 text-sm text-white"
                >
                  {models.map((model) => (
                    <option key={model.slug} value={model.slug}>
                      {model.name} — {model.company.name}
                    </option>
                  ))}
                </select>

                {selectedModel && (
                  <div className="mt-5 rounded-xl bg-white/[0.03] p-4">
                    <p className="font-semibold">{selectedModel.name}</p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {selectedModel.company.name} · {selectedModel.category}
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-zinc-500">Context</p>
                        <p className="mt-1 text-sm font-semibold">
                          {selectedModel.contextWindow}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Input / 1M</p>
                        <p className="mt-1 text-sm font-semibold">
                          ${selectedModel.inputPrice}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-6">
                <h2 className="mb-4 font-semibold">Your Prompt</h2>

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={7}
                  placeholder="Write your prompt here..."
                  className="w-full resize-y rounded-xl border border-white/10 bg-[#08090d] p-4 text-sm leading-6 text-white outline-none focus:border-violet-500"
                />

                <p className="mt-2 text-xs text-zinc-500">
                  {prompt.length} characters
                </p>
              </div>
            </section>

            <section className="lg:col-span-3">
              <div className="h-full rounded-2xl border border-white/[0.08] bg-[#101117] p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="flex items-center gap-2 font-semibold">
                    <Terminal size={19} className="text-violet-400" />
                    Generated API Code
                  </h2>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setLanguage("javascript")}
                      className={`rounded-lg px-3 py-2 text-xs ${
                        language === "javascript"
                          ? "bg-violet-600 text-white"
                          : "border border-white/10 text-zinc-400"
                      }`}
                    >
                      JavaScript
                    </button>

                    <button
                      onClick={() => setLanguage("python")}
                      className={`rounded-lg px-3 py-2 text-xs ${
                        language === "python"
                          ? "bg-violet-600 text-white"
                          : "border border-white/10 text-zinc-400"
                      }`}
                    >
                      Python
                    </button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-white/10">
                  <div className="flex items-center justify-between border-b border-white/10 bg-[#171820] px-4 py-3">
                    <span className="text-xs text-zinc-400">
                      {language === "python" ? "main.py" : "main.js"}
                    </span>

                    <button
                      onClick={copyCode}
                      className="flex items-center gap-2 text-xs text-violet-400 hover:text-violet-300"
                    >
                      {copied ? <Check size={15} /> : <Copy size={15} />}
                      {copied ? "Copied!" : "Copy code"}
                    </button>
                  </div>

                  <pre className="min-h-[380px] overflow-x-auto whitespace-pre-wrap break-words bg-[#08090d] p-5 text-xs leading-6 text-emerald-300">
                    <code>{generatedCode}</code>
                  </pre>
                </div>

                <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-4">
                  <p className="text-xs font-semibold text-amber-300">
                    Integration template
                  </p>
                  <p className="mt-2 text-xs leading-5 text-zinc-400">
                    Replace the API endpoint, API key and model ID with
                    values supplied by your chosen provider. This playground
                    generates sample code; it does not execute live model requests.
                  </p>
                </div>
              </div>
            </section>

          </div>
        )}

        <footer className="mt-12 border-t border-white/[0.07] py-6 text-xs text-zinc-500">
          © 2026 OneAtlas. AI intelligence, unified.
        </footer>
      </div>
    </main>
  );
}
