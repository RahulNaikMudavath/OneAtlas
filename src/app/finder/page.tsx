
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Search, RotateCcw } from "lucide-react";

type Model = {
  id: string;
  slug: string;
  name: string;
  category: string;
  contextWindow: string;
  inputPrice: number;
  outputPrice: number;
  capabilities: string[];
  modalities: string[];
  company: { name: string };
};

function contextToNumber(value: string) {
  const match = value.trim().match(/^([\d.]+)\s*([KM])?$/i);
  if (!match) return 0;

  const number = Number(match[1]);
  const unit = (match[2] || "").toUpperCase();

  return unit === "M" ? number * 1000 : number;
}

export default function ModelFinderPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [task, setTask] = useState("All");
  const [provider, setProvider] = useState("All");
  const [modality, setModality] = useState("All");
  const [minContext, setMinContext] = useState("0");
  const [maxInput, setMaxInput] = useState("");
  const [maxOutput, setMaxOutput] = useState("");
  const [sort, setSort] = useState("input");
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

  const providers = useMemo(
    () => [...new Set(models.map((model) => model.company.name))].sort(),
    [models]
  );

  const results = useMemo(() => {
    const filtered = models.filter((model) => {
      const matchesTask =
        task === "All" ||
        model.capabilities.some((item) =>
          item.toLowerCase().includes(task.toLowerCase())
        );

      const matchesProvider =
        provider === "All" || model.company.name === provider;

      const matchesModality =
        modality === "All" ||
        model.modalities.some((item) =>
          item.toLowerCase() === modality.toLowerCase()
        );

      const matchesContext =
        contextToNumber(model.contextWindow) >= Number(minContext);

      const matchesInput =
        maxInput === "" || model.inputPrice <= Number(maxInput);

      const matchesOutput =
        maxOutput === "" || model.outputPrice <= Number(maxOutput);

      return (
        matchesTask &&
        matchesProvider &&
        matchesModality &&
        matchesContext &&
        matchesInput &&
        matchesOutput
      );
    });

    return filtered.sort((a, b) => {
      if (sort === "input") return a.inputPrice - b.inputPrice;
      if (sort === "output") return a.outputPrice - b.outputPrice;
      if (sort === "context")
        return contextToNumber(b.contextWindow) - contextToNumber(a.contextWindow);
      return a.name.localeCompare(b.name);
    });
  }, [
    models,
    task,
    provider,
    modality,
    minContext,
    maxInput,
    maxOutput,
    sort,
  ]);

  function resetFilters() {
    setTask("All");
    setProvider("All");
    setModality("All");
    setMinContext("0");
    setMaxInput("");
    setMaxOutput("");
    setSort("input");
  }

  const selectClass =
    "w-full rounded-lg border border-white/10 bg-[#08090d] p-3 text-sm text-white outline-none focus:border-violet-500";

  const labelClass = "mb-2 block text-xs text-zinc-400";

  return (
    <main className="min-h-screen bg-[#08090d] px-5 py-10 text-white sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft size={17} /> Back to OneAtlas
        </Link>

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-xs tracking-widest text-violet-400">
            <Sparkles size={17} /> ADVANCED MODEL DISCOVERY
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Find Your <span className="text-violet-400">AI Model</span>
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Compare AI models by task, provider, context and pricing.
          </p>
        </div>

        <section className="rounded-2xl border border-white/10 bg-[#101117] p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold">Advanced Filters</h2>
              <p className="mt-1 text-xs text-zinc-500">
                Refine your model search.
              </p>
            </div>

            <button
              onClick={resetFilters}
              className="flex items-center gap-2 text-xs text-violet-400 hover:text-white"
            >
              <RotateCcw size={14} /> Reset filters
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={labelClass}>Task / Capability</label>
              <select
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className={selectClass}
              >
                <option value="All">All tasks</option>
                <option value="Coding">Coding</option>
                <option value="Reasoning">Reasoning</option>
                <option value="Chat">Chat</option>
                <option value="Writing">Writing</option>
                <option value="Analysis">Analysis</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className={selectClass}
              >
                <option value="All">All providers</option>
                {providers.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Modality</label>
              <select
                value={modality}
                onChange={(e) => setModality(e.target.value)}
                className={selectClass}
              >
                <option value="All">All modalities</option>
                <option value="Text">Text</option>
                <option value="Image">Image</option>
                <option value="Audio">Audio</option>
                <option value="Video">Video</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Minimum Context Window</label>
              <select
                value={minContext}
                onChange={(e) => setMinContext(e.target.value)}
                className={selectClass}
              >
                <option value="0">Any context</option>
                <option value="128">128K+</option>
                <option value="200">200K+</option>
                <option value="400">400K+</option>
                <option value="1000">1M+</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Maximum Input Price ($ / 1M tokens)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="No limit"
                value={maxInput}
                onChange={(e) => setMaxInput(e.target.value)}
                className={selectClass}
              />
            </div>

            <div>
              <label className={labelClass}>Maximum Output Price ($ / 1M tokens)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="No limit"
                value={maxOutput}
                onChange={(e) => setMaxOutput(e.target.value)}
                className={selectClass}
              />
            </div>

            <div>
              <label className={labelClass}>Sort Models</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className={selectClass}
              >
                <option value="input">Lowest input price</option>
                <option value="output">Lowest output price</option>
                <option value="context">Largest context window</option>
                <option value="name">Model name</option>
              </select>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">Matching Models</h2>
              <p className="mt-1 text-xs text-zinc-500">
                {results.length} models found
              </p>
            </div>
            <span className="text-xs text-zinc-500">
              Sorted by {sort === "input" ? "input price" : sort === "output" ? "output price" : sort === "context" ? "context window" : "model name"}
            </span>
          </div>

          {loading && (
            <p className="rounded-xl border border-white/10 p-8 text-center text-sm text-zinc-400">
              Loading models...
            </p>
          )}

          {error && (
            <p className="rounded-xl border border-red-500/20 p-8 text-center text-sm text-red-400">
              {error}
            </p>
          )}

          {!loading && !error && results.length === 0 && (
            <p className="rounded-xl border border-white/10 p-8 text-center text-sm text-zinc-400">
              No matching models found. Try changing your filters.
            </p>
          )}

          <div className="space-y-3">
            {!loading && results.map((model) => (
              <article
                key={model.id}
                className="rounded-xl border border-white/10 bg-[#101117] p-5 transition hover:border-violet-500/40"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{model.name}</h3>
                    <p className="mt-1 text-xs text-zinc-500">
                      {model.company.name} · {model.category}
                    </p>
                  </div>

                  <div className="text-right text-xs">
                    <p className="text-violet-400">
                      Input: ${model.inputPrice.toFixed(2)}
                    </p>
                    <p className="mt-1 text-zinc-400">
                      Output: ${model.outputPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-white/[0.03] p-3">
                    <p className="text-xs text-zinc-500">Context window</p>
                    <p className="mt-1 text-sm font-semibold">{model.contextWindow}</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] p-3">
                    <p className="text-xs text-zinc-500">Input / 1M tokens</p>
                    <p className="mt-1 text-sm font-semibold">${model.inputPrice.toFixed(2)}</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] p-3">
                    <p className="text-xs text-zinc-500">Output / 1M tokens</p>
                    <p className="mt-1 text-sm font-semibold">${model.outputPrice.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {model.modalities.map((item) => (
                    <span key={item} className="rounded-md bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
                      {item}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/models/${model.slug}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300"
                >
                  View model details →
                </Link>
              </article>
            ))}
          </div>
        </section>

        <p className="mt-8 text-xs text-zinc-500">
          Pricing and specifications are demonstration data stored in the OneAtlas database, not independently verified current provider quotes.
        </p>
      </div>
    </main>
  );
}
