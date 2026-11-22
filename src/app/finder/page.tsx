"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  CircleDollarSign,
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
  capabilities: string[];
  modalities: string[];
  company: { name: string };
};

function contextToNumber(value?: string) {
  if (!value) return 0;
  const match = value.trim().match(/^([\d.]+)\s*([KM])?$/i);
  if (!match) return 0;

  const number = Number(match[1]);
  const unit = (match[2] || "").toUpperCase();

  return unit === "M" ? number * 1000 : number;
}

function formatPrice(value?: number | null): string {
  if (value === null || value === undefined) return "N/A";
  const num = Number(value);
  if (!Number.isFinite(num)) return "N/A";
  return `$${num.toFixed(2)}`;
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
    () =>
      [
        ...new Set(
          models
            .map((model) => model.company?.name)
            .filter((name): name is string => Boolean(name))
        ),
      ].sort(),
    [models]
  );

  const results = useMemo(() => {
    const filtered = models.filter((model) => {
      const capabilities = model.capabilities || [];
      const matchesTask =
        task === "All" ||
        capabilities.some((item) =>
          item.toLowerCase().includes(task.toLowerCase())
        );

      const matchesProvider =
        provider === "All" || model.company?.name === provider;

      const modalities = model.modalities || [];
      const matchesModality =
        modality === "All" ||
        modalities.some(
          (item) => item.toLowerCase() === modality.toLowerCase()
        );

      const matchesContext =
        contextToNumber(model.contextWindow) >= Number(minContext);

      const inPrice = model.inputPrice ?? 0;
      const outPrice = model.outputPrice ?? 0;

      const matchesInput =
        maxInput === "" || inPrice <= Number(maxInput);

      const matchesOutput =
        maxOutput === "" || outPrice <= Number(maxOutput);

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
      const aIn = a.inputPrice ?? 0;
      const bIn = b.inputPrice ?? 0;
      const aOut = a.outputPrice ?? 0;
      const bOut = b.outputPrice ?? 0;

      if (sort === "input") return aIn - bIn;
      if (sort === "output") return aOut - bOut;
      if (sort === "context")
        return (
          contextToNumber(b.contextWindow) - contextToNumber(a.contextWindow)
        );
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
    "w-full rounded-xl border border-white/[0.09] bg-slate-900/60 p-3 text-sm text-white placeholder-slate-500 backdrop-blur-xl outline-none transition-all duration-200 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20";

  const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07080f] px-5 py-8 text-white sm:px-10">
      {/* Ambient Aurora Glow Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute -right-48 top-1/4 h-[600px] w-[600px] rounded-full bg-cyan-600/10 blur-[150px]" />
        <div className="absolute bottom-10 left-1/3 h-[500px] w-[500px] rounded-full bg-fuchsia-600/08 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
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
            <SlidersHorizontal size={14} className="text-violet-400" />
            Precision Recommendation Engine
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Find Your{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              AI Model
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Narrow down frontier and open-weights models according to your exact budget constraints, required task capabilities, context sizes, and modality support.
          </p>
        </div>

        {/* Filters Matrix */}
        <section className="rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6 backdrop-blur-xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white">Target Specifications</h2>
              <p className="mt-1 text-xs text-slate-400">
                Filter across 480+ models by technical parameters.
              </p>
            </div>

            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white"
            >
              <RotateCcw size={13} /> Reset criteria
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
                <option value="All">All capabilities</option>
                <option value="Reasoning">Reasoning / Chain-of-Thought</option>
                <option value="Tool Calling">Tool Calling & Function Execution</option>
                <option value="Structured Output">Structured JSON Output</option>
                <option value="Temperature Control">Temperature Control</option>
                <option value="Seed Control">Seed Control</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Publisher / Organization</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className={selectClass}
              >
                <option value="All">All organizations</option>
                {providers.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Primary Modality</label>
              <select
                value={modality}
                onChange={(e) => setModality(e.target.value)}
                className={selectClass}
              >
                <option value="All">All modalities</option>
                <option value="text">Text only</option>
                <option value="image">Image / Vision</option>
                <option value="audio">Audio</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Minimum Context Depth</label>
              <select
                value={minContext}
                onChange={(e) => setMinContext(e.target.value)}
                className={selectClass}
              >
                <option value="0">Any context window</option>
                <option value="32">32K+ tokens</option>
                <option value="128">128K+ tokens</option>
                <option value="200">200K+ tokens</option>
                <option value="1000">1M+ tokens</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Max Input Price ($ / 1M tokens)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="No upper limit"
                value={maxInput}
                onChange={(e) => setMaxInput(e.target.value)}
                className={selectClass}
              />
            </div>

            <div>
              <label className={labelClass}>Max Output Price ($ / 1M tokens)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="No upper limit"
                value={maxOutput}
                onChange={(e) => setMaxOutput(e.target.value)}
                className={selectClass}
              />
            </div>
          </div>
        </section>

        {/* Results Stream */}
        <section className="mt-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Matching Models</h2>
              <p className="mt-1 text-xs text-slate-400">
                {results.length} models matched your specifications
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Sort results:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-xl border border-white/[0.09] bg-slate-900/60 px-3.5 py-1.5 text-xs font-semibold text-white outline-none focus:border-violet-500/50"
              >
                <option value="input">Lowest Input Price</option>
                <option value="output">Lowest Output Price</option>
                <option value="context">Largest Context Window</option>
                <option value="name">Alphabetical Name</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-slate-900/40 p-16 text-center backdrop-blur-xl">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
              <p className="mt-4 text-sm font-medium text-slate-300">
                Finding matching models...
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-300 backdrop-blur-xl">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {!loading && !error && results.length === 0 && (
            <div className="rounded-2xl border border-white/[0.08] bg-slate-900/40 p-12 text-center backdrop-blur-xl">
              <Sparkles className="mx-auto mb-3 text-slate-500" size={36} />
              <p className="text-base font-bold text-white">No models matched</p>
              <p className="mt-1 text-xs text-slate-400">
                Try relaxing your price filters or context requirements.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-300 transition-colors hover:bg-violet-500/20"
              >
                Reset All Filters
              </button>
            </div>
          )}

          <div className="space-y-4">
            {!loading &&
              results.map((model) => (
                <article
                  key={model.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/45 p-6 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/40 hover:shadow-[0_0_35px_rgba(139,92,246,0.12)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/models/${model.slug}`}
                          className="text-lg font-bold text-white transition-colors group-hover:text-violet-300"
                        >
                          {model.name}
                        </Link>
                        <span className="rounded-md border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold text-violet-300">
                          {model.category}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        Published by {model.company?.name || "Independent"}
                      </p>
                    </div>

                    <div className="text-right text-xs">
                      <p className="font-mono font-semibold text-emerald-400">
                        Input: {formatPrice(model.inputPrice)}
                      </p>
                      <p className="mt-1 font-mono font-semibold text-violet-300">
                        Output: {formatPrice(model.outputPrice)}
                      </p>
                    </div>
                  </div>

                  {/* Context & Capabilities */}
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                      <p className="text-[11px] text-slate-500">Context Depth</p>
                      <p className="mt-0.5 font-mono text-sm font-bold text-slate-200">
                        {model.contextWindow}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                      <p className="text-[11px] text-slate-500">Input / 1M tokens</p>
                      <p className="mt-0.5 font-mono text-sm font-bold text-emerald-400">
                        {formatPrice(model.inputPrice)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                      <p className="text-[11px] text-slate-500">Output / 1M tokens</p>
                      <p className="mt-0.5 font-mono text-sm font-bold text-violet-300">
                        {formatPrice(model.outputPrice)}
                      </p>
                    </div>
                  </div>

                  {/* Modalities & View Details */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
                    <div className="flex flex-wrap gap-1.5">
                      {(model.modalities || []).map((item) => (
                        <span
                          key={item}
                          className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/models/${model.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 transition-colors hover:text-cyan-300"
                    >
                      Detailed Specifications
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </article>
              ))}
          </div>
        </section>

        <footer className="mt-12 border-t border-white/[0.08] py-6 text-center text-xs text-slate-500">
          © 2026 OneAtlas. AI Model Recommendation & Discovery Engine.
        </footer>
      </div>
    </main>
  );
}
