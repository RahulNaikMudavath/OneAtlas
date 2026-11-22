"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, GitCompareArrows } from "lucide-react";

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
  inputPrice: number;
  outputPrice: number;
  capabilities: string[];
  modalities: string[];
  company: { name: string };
  providers: {
    provider: { name: string };
  }[];
  benchmarks: Benchmark[];
};

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
    () => selected.map((id) => models.find((model) => model.id === id))
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
      label: "Company",
      value: (model: Model) => model.company.name,
    },
    {
      label: "Category",
      value: (model: Model) => model.category,
    },
    {
      label: "Context Window",
      value: (model: Model) => model.contextWindow,
    },
    {
      label: "Input Price / 1M tokens",
      value: (model: Model) => `$${model.inputPrice.toFixed(2)}`,
    },
    {
      label: "Output Price / 1M tokens",
      value: (model: Model) => `$${model.outputPrice.toFixed(2)}`,
    },
    {
      label: "Modalities",
      value: (model: Model) => model.modalities.join(", "),
    },
    {
      label: "Capabilities",
      value: (model: Model) => model.capabilities.join(", "),
    },
    {
      label: "Available Providers",
      value: (model: Model) =>
        model.providers.map((item) => item.provider.name).join(", ") || "Not listed",
    },
  ];

  return (
    <main className="min-h-screen bg-[#08090d] px-5 py-10 text-white sm:px-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft size={17} /> Back to OneAtlas
        </Link>

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-xs tracking-widest text-violet-400">
            <GitCompareArrows size={17} /> MODEL INTELLIGENCE
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Compare AI <span className="text-violet-400">Models</span>
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Compare specifications, pricing, capabilities and benchmarks side by side.
          </p>
        </div>

        <section className="rounded-2xl border border-white/10 bg-[#101117] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold">Select Models</h2>
              <p className="mt-1 text-xs text-zinc-500">
                Choose up to 3 models ({selected.length}/3 selected).
              </p>
            </div>
            <button
              onClick={() => setSelected([])}
              className="text-xs text-violet-400 hover:text-white"
            >
              Clear selection
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {selected.length < 3 && (
              <select
                key={selected.length}
                defaultValue=""
                onChange={(e) => {
                  addModel(e.target.value);
                  e.target.value = "";
                }}
                className="rounded-lg border border-white/10 bg-[#08090d] p-3 text-sm outline-none focus:border-violet-500"
              >
                <option value="">+ Add a model</option>
                {models
                  .filter((model) => !selected.includes(model.id))
                  .map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} — {model.company.name}
                    </option>
                  ))}
              </select>
            )}

            {selectedModels.map((model) => (
              <div
                key={model.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-violet-500/30 bg-violet-500/5 p-3"
              >
                <div>
                  <p className="text-sm font-semibold">{model.name}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {model.company.name}
                  </p>
                </div>
                <button
                  onClick={() => removeModel(model.id)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        {loading && (
          <p className="mt-8 text-sm text-zinc-400">Loading model catalogue...</p>
        )}

        {error && (
          <p className="mt-8 text-sm text-red-400">{error}</p>
        )}

        {!loading && !error && selectedModels.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-white/15 p-12 text-center">
            <GitCompareArrows className="mx-auto mb-4 text-violet-400" size={32} />
            <h2 className="font-semibold">Start comparing models</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Select at least one model above to see its specifications.
            </p>
          </div>
        )}

        {selectedModels.length > 0 && (
          <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#101117]">
            <div className="border-b border-white/10 p-5">
              <h2 className="font-bold">Specification Comparison</h2>
              <p className="mt-1 text-xs text-zinc-500">
                Information loaded from the OneAtlas database.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead>
                  <tr className="bg-white/[0.035]">
                    <th className="p-4 text-xs text-zinc-500">Specification</th>
                    {selectedModels.map((model) => (
                      <th key={model.id} className="p-4 font-semibold">
                        <Link
                          href={`/models/${model.slug}`}
                          className="text-violet-400 hover:text-violet-300"
                        >
                          {model.name}
                        </Link>
                        <p className="mt-1 text-xs font-normal text-zinc-500">
                          {model.company.name}
                        </p>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row) => (
                    <tr key={row.label} className="border-t border-white/[0.07]">
                      <td className="p-4 text-xs text-zinc-400">{row.label}</td>
                      {selectedModels.map((model) => (
                        <td key={model.id} className="p-4 text-xs text-zinc-200">
                          {row.value(model)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-white/10 p-5">
              <h3 className="font-bold">Benchmark Comparison</h3>
              <p className="mt-1 text-xs text-zinc-500">
                Scores stored in the database. Demonstration values are not verified results.
              </p>

              <div className="mt-5 space-y-5">
                {selectedModels.map((model) => (
                  <div key={model.id}>
                    <h4 className="mb-3 text-sm font-semibold">{model.name}</h4>
                    {model.benchmarks.length === 0 ? (
                      <p className="text-xs text-zinc-500">No benchmark records available.</p>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {model.benchmarks.map((benchmark) => (
                          <div
                            key={benchmark.id}
                            className="rounded-lg bg-white/[0.035] p-3"
                          >
                            <div className="flex justify-between gap-3">
                              <span className="text-xs text-zinc-400">
                                {benchmark.name}
                              </span>
                              <span className="text-sm font-semibold text-violet-400">
                                {benchmark.score}/100
                              </span>
                            </div>
                            <p className="mt-1 text-[10px] text-zinc-600">
                              {benchmark.source || "Source not specified"}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <p className="mt-8 text-xs text-zinc-500">
          Pricing, specifications and benchmark records are demonstration data unless independently verified.
        </p>
      </div>
    </main>
  );
}
