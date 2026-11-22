"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Search } from "lucide-react";

type Model = {
  id: string;
  slug: string;
  name: string;
  category: string;
  contextWindow: string;
  inputPrice: number;
  outputPrice: number;
  capabilities: string[];
  company: { name: string };
};

export default function ModelFinderPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [task, setTask] = useState("Coding");
  const [budget, setBudget] = useState("5");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/models")
      .then((res) => {
        if (!res.ok) throw new Error("Could not load models");
        return res.json();
      })
      .then((result) => {
        if (!result.success) throw new Error("Could not load models");
        setModels(result.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const recommendations = useMemo(() => {
    return models
      .filter((model) => {
        const supportsTask = model.capabilities.some(
          (capability) =>
            capability.toLowerCase().includes(task.toLowerCase())
        );

        return supportsTask && model.inputPrice <= Number(budget);
      })
      .sort((a, b) => a.inputPrice - b.inputPrice);
  }, [models, task, budget]);

  return (
    <main className="min-h-screen bg-[#08090d] px-5 py-10 text-white sm:px-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
          <ArrowLeft size={17} /> Back to OneAtlas
        </Link>

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-xs tracking-widest text-violet-400">
            <Sparkles size={17} /> SMART MODEL DISCOVERY
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Find Your <span className="text-violet-400">AI Model</span>
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Discover models that match your task and budget.
          </p>
        </div>

        <section className="space-y-5 rounded-2xl border border-white/10 bg-[#101117] p-6">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              What do you want to do?
            </label>
            <select
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#08090d] p-3 text-sm"
            >
              <option value="Coding">Coding</option>
              <option value="Reasoning">Reasoning</option>
              <option value="Chat">Chat</option>
              <option value="Writing">Writing</option>
              <option value="Analysis">Analysis</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Maximum input price per 1M tokens (USD)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#08090d] p-3 text-sm"
            />
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-xl font-bold">
            Recommended Models ({recommendations.length})
          </h2>

          {loading && <p className="text-sm text-zinc-400">Loading models...</p>}
          {error && <p className="text-sm text-red-400">{error}</p>}

          {!loading && !error && recommendations.length === 0 && (
            <p className="rounded-xl border border-white/10 p-8 text-center text-sm text-zinc-400">
              No matching models. Try increasing your budget or changing your task.
            </p>
          )}

          <div className="space-y-3">
            {recommendations.map((model) => (
              <article key={model.id} className="rounded-xl border border-white/10 bg-[#101117] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{model.name}</h3>
                    <p className="mt-1 text-xs text-zinc-500">
                      {model.company.name} · {model.category}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-violet-400">
                    ${model.inputPrice.toFixed(2)} / 1M input tokens
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {model.capabilities.map((capability) => (
                    <span key={capability} className="rounded-md bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
                      {capability}
                    </span>
                  ))}
                </div>

                <Link href={`/models/${model.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300">
                  View model details <Search size={14} />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <p className="mt-8 text-xs text-zinc-500">
          Recommendations use model capabilities and demonstration pricing stored in the OneAtlas database. They are not independent performance evaluations.
        </p>
      </div>
    </main>
  );
}
