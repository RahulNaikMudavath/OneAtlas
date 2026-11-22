"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  GitCompareArrows,
  Sparkles,
  CheckCircle2,
  X,
  Layers,
  CircleDollarSign,
  Award,
  Zap,
  Cpu,
} from "lucide-react";

type Benchmark = {
  id: string;
  name: string;
  category: string;
  score: number;
  source: string | null;
};

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
  providers: {
    provider: { name: string };
  }[];
  benchmarks: Benchmark[];
};

function formatPrice(value?: number | null): string {
  if (value === null || value === undefined) return "N/A";
  const num = Number(value);
  if (!Number.isFinite(num)) return "N/A";
  return `$${num.toFixed(2)}`;
}

export default function ComparePage() {
  const [models, setModels] = useState<Model[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/models")
      .then((res) => {
        if (!res.ok) throw new Error("Unable to load models");
        return res.json();
      })
      .then((result) => {
        if (!result.success) throw new Error("Unable to load models");
        setModels(result.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const selectedModels = useMemo(
    () =>
      selected
        .map((id) => models.find((model) => model.id === id))
        .filter((model): model is Model => Boolean(model)),
    [selected, models]
  );

  function addModel(id: string) {
    if (!id || selected.includes(id) || selected.length >= 3) return;
    setSelected((current) => [...current, id]);
  }

  function removeModel(id: string) {
    setSelected((current) => current.filter((item) => item !== id));
  }

  const rows = [
    {
      label: "Organization / Publisher",
      value: (model: Model) => model.company?.name || "Independent",
      badgeColor: "text-violet-300",
    },
    {
      label: "Core Architecture Category",
      value: (model: Model) => model.category || "General",
      badgeColor: "text-cyan-300",
    },
    {
      label: "Context Length Window",
      value: (model: Model) => model.contextWindow || "Standard",
      badgeColor: "text-amber-300",
    },
    {
      label: "Input Price / 1M tokens",
      value: (model: Model) => formatPrice(model.inputPrice),
      badgeColor: "text-emerald-400 font-mono font-bold",
    },
    {
      label: "Output Price / 1M tokens",
      value: (model: Model) => formatPrice(model.outputPrice),
      badgeColor: "text-violet-300 font-mono font-bold",
    },
    {
      label: "Input / Output Modalities",
      value: (model: Model) => (model.modalities || []).join(", ") || "Text",
      badgeColor: "text-slate-200",
    },
    {
      label: "Supported Capabilities",
      value: (model: Model) =>
        (model.capabilities || []).join(", ") || "General Inference",
      badgeColor: "text-slate-200",
    },
    {
      label: "Connected Host Providers",
      value: (model: Model) =>
        (model.providers || [])
          .map((item) => item.provider?.name)
          .filter(Boolean)
          .join(", ") || "OpenRouter Default",
      badgeColor: "text-slate-300",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07080f] px-5 py-8 text-white sm:px-10">
      {/* Ambient Aurora Glow Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute -right-48 top-1/4 h-[600px] w-[600px] rounded-full bg-fuchsia-600/10 blur-[150px]" />
        <div className="absolute bottom-10 left-1/3 h-[500px] w-[500px] rounded-full bg-cyan-600/08 blur-[160px]" />
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
            <GitCompareArrows size={14} className="text-violet-400" />
            Direct Specification Matrix
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Compare AI{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              Models
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Side-by-side technical evaluation across context depth, pricing efficiency, benchmark performance scores, and architectural features.
          </p>
        </div>

        {/* Model Selection Console */}
        <section className="rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white">
                Select Models to Compare
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Choose up to 3 models simultaneously ({selected.length}/3 selected).
              </p>
            </div>

            {selected.length > 0 && (
              <button
                onClick={() => setSelected([])}
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/20"
              >
                Clear all selections
              </button>
            )}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Add Model Selector Slot */}
            {selected.length < 3 && (
              <div className="relative">
                <select
                  key={selected.length}
                  defaultValue=""
                  onChange={(e) => {
                    addModel(e.target.value);
                    e.target.value = "";
                  }}
                  className="w-full appearance-none rounded-xl border border-dashed border-violet-500/40 bg-violet-500/5 p-4 text-sm font-semibold text-violet-300 outline-none transition-all duration-200 hover:border-violet-400 hover:bg-violet-500/10 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
                >
                  <option value="" disabled className="bg-slate-900 text-slate-400">
                    + Choose a model from {models.length} options...
                  </option>
                  {models
                    .filter((model) => !selected.includes(model.id))
                    .map((model) => (
                      <option
                        key={model.id}
                        value={model.id}
                        className="bg-slate-900 text-white"
                      >
                        {model.name} — {model.company?.name || "AI"} ({model.category})
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Selected Model Chips */}
            {selectedModels.map((model) => (
              <div
                key={model.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 backdrop-blur-md"
              >
                <div>
                  <p className="text-sm font-bold text-white">{model.name}</p>
                  <p className="mt-0.5 text-xs text-violet-300">
                    {model.company?.name} · {model.category}
                  </p>
                </div>
                <button
                  onClick={() => removeModel(model.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
                  aria-label="Remove model"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Loading Indicator */}
        {loading && (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-slate-900/40 p-16 text-center backdrop-blur-xl">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
            <p className="mt-4 text-sm font-medium text-slate-300">
              Loading model specifications...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-300 backdrop-blur-xl">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Empty State Prompt */}
        {!loading && !error && selectedModels.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-white/15 bg-slate-900/30 p-16 text-center backdrop-blur-xl">
            <GitCompareArrows className="mx-auto mb-4 text-violet-400" size={40} />
            <h3 className="text-lg font-bold text-white">Select Models to Begin Comparison</h3>
            <p className="mt-2 text-sm text-slate-400">
              Pick 2 or 3 models from the dropdown selector above to see real-time specifications, pricing, and benchmark scores side-by-side.
            </p>
          </div>
        )}

        {/* Comparison Tables Section */}
        {selectedModels.length > 0 && (
          <section className="mt-10 overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/50 backdrop-blur-xl">
            {/* Table Header Banner */}
            <div className="border-b border-white/[0.08] bg-slate-900/80 p-6">
              <h3 className="text-lg font-bold text-white">
                Detailed Technical Specifications
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Data extracted directly from active OneAtlas PostgreSQL intelligence records.
              </p>
            </div>

            {/* Spec Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                    <th className="p-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Metric / Property
                    </th>
                    {selectedModels.map((model) => (
                      <th key={model.id} className="p-5 font-bold">
                        <Link
                          href={`/models/${model.slug}`}
                          className="text-base text-violet-300 transition-colors hover:text-white"
                        >
                          {model.name}
                        </Link>
                        <p className="mt-1 text-xs font-normal text-slate-400">
                          {model.company?.name}
                        </p>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.06]">
                  {rows.map((row) => (
                    <tr
                      key={row.label}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="p-5 text-xs font-medium text-slate-400">
                        {row.label}
                      </td>
                      {selectedModels.map((model) => (
                        <td
                          key={model.id}
                          className={`p-5 text-sm ${row.badgeColor}`}
                        >
                          {row.value(model)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Benchmark Scores Comparison */}
            <div className="border-t border-white/[0.08] bg-slate-900/80 p-6">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-amber-400" />
                <h4 className="text-base font-bold text-white">
                  Artificial Analysis Benchmarks
                </h4>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Standardized benchmark index comparison where reported.
              </p>

              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {selectedModels.map((model) => (
                  <div
                    key={model.id}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5"
                  >
                    <p className="text-sm font-bold text-violet-300">{model.name}</p>
                    <p className="text-xs text-slate-400">{model.company?.name}</p>

                    <div className="mt-4 space-y-3">
                      {(model.benchmarks || []).length === 0 ? (
                        <p className="text-xs text-slate-500 italic">
                          No Artificial Analysis benchmarks recorded yet.
                        </p>
                      ) : (
                        model.benchmarks.map((bm) => (
                          <div key={bm.id} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-300">{bm.name}</span>
                              <span className="font-mono font-bold text-amber-300">
                                {bm.score}
                              </span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-violet-500"
                                style={{
                                  width: `${Math.min(Math.max(bm.score, 0), 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <footer className="mt-12 border-t border-white/[0.08] py-6 text-center text-xs text-slate-500">
          © 2026 OneAtlas. AI Model Discovery & Comparative Analysis.
        </footer>
      </div>
    </main>
  );
}
