
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Trophy,
  Medal,
  TrendingUp,
  BarChart3,
} from "lucide-react";

type APIBenchmark = {
  id: string;
  name: string;
  category: string;
  score: number;
  source: string | null;
};

type APIModel = {
  id: string;
  slug: string;
  name: string;
  company: {
    name: string;
  };
  benchmarks: APIBenchmark[];
};

type RankedModel = APIModel & {
  benchmark: APIBenchmark;
};

const BENCHMARK_SOURCE = "OpenRouter: Artificial Analysis";

function formatBenchmarkName(name: string) {
  return name
    .replace(/_index$/i, "")
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function RankingsPage() {
  const [selectedBenchmark, setSelectedBenchmark] =
    useState("intelligence_index");

  const [search, setSearch] = useState("");
  const [models, setModels] = useState<APIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch("/api/models");

        if (!response.ok) {
          throw new Error("Unable to fetch model data");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Unable to load rankings");
        }

        setModels(result.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchModels();
  }, []);

  // Only use imported Artificial Analysis benchmark records.
  // Illustrative demonstration records are deliberately excluded.
  const benchmarkCategories = useMemo(() => {
    const categories = models.flatMap((model) =>
      model.benchmarks
        .filter(
          (benchmark) =>
            benchmark.source === BENCHMARK_SOURCE &&
            Number.isFinite(benchmark.score)
        )
        .map((benchmark) => benchmark.name)
    );

    return Array.from(new Set(categories)).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [models]);

  const activeBenchmark = benchmarkCategories.includes(selectedBenchmark)
    ? selectedBenchmark
    : benchmarkCategories[0] || "";

  const rankedModels = useMemo(() => {
    return models
      .map((model): RankedModel | null => {
        const benchmark = model.benchmarks.find(
          (item) =>
            item.source === BENCHMARK_SOURCE &&
            item.name === activeBenchmark &&
            Number.isFinite(item.score)
        );

        if (!benchmark) return null;

        return {
          ...model,
          benchmark,
        };
      })
      .filter((model): model is RankedModel => model !== null)
      .filter(
        (model) =>
          model.name.toLowerCase().includes(search.toLowerCase()) ||
          model.company.name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => b.benchmark.score - a.benchmark.score);
  }, [models, activeBenchmark, search]);

  const topModel = rankedModels[0];

  const evaluatedModelCount = useMemo(() => {
    return models.filter((model) =>
      model.benchmarks.some(
        (benchmark) =>
          benchmark.source === BENCHMARK_SOURCE &&
          Number.isFinite(benchmark.score)
      )
    ).length;
  }, [models]);

  const maximumScore = Math.max(
    ...rankedModels.map((model) => model.benchmark.score),
    0
  );

  function formatScore(score: number) {
    return score.toLocaleString(undefined, {
      maximumFractionDigits: 3,
    });
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
          <div className="mb-3 flex items-center gap-2 text-xs font-medium tracking-widest text-violet-400">
            <Trophy size={16} />
            AI INTELLIGENCE LEADERBOARD
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Rankings &{" "}
            <span className="text-violet-400">Benchmarks</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Explore AI model performance using imported Artificial
            Analysis benchmark data.
          </p>
        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.08] p-6 md:col-span-2">
            <div className="flex items-center gap-2 text-sm text-violet-300">
              <Medal size={19} />
              Top performer
            </div>

            {loading ? (
              <p className="mt-5 text-sm text-zinc-400">
                Loading leaderboard...
              </p>
            ) : topModel ? (
              <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    {topModel.name}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    {topModel.company.name}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-4xl font-bold text-violet-300">
                    {formatScore(topModel.benchmark.score)}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {formatBenchmarkName(activeBenchmark)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-5 text-sm text-zinc-400">
                No benchmark data available for this category.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-6">
            <TrendingUp className="mb-5 text-emerald-400" size={23} />
            <p className="text-sm text-zinc-400">
              Models evaluated
            </p>
            <h2 className="mt-2 text-4xl font-bold">
              {loading ? "..." : evaluatedModelCount}
            </h2>
            <p className="mt-2 text-xs text-zinc-500">
              Models with imported benchmark records
            </p>
          </div>
        </div>

        <section className="mb-8 rounded-2xl border border-white/[0.08] bg-[#101117] p-5">
          <div className="mb-5 flex items-center gap-2">
            <BarChart3 size={19} className="text-violet-400" />
            <h2 className="font-semibold">
              Available benchmark categories
            </h2>
          </div>

          {loading ? (
            <p className="text-sm text-zinc-400">
              Loading benchmark categories...
            </p>
          ) : benchmarkCategories.length === 0 ? (
            <p className="text-sm text-zinc-400">
              No imported benchmark categories available.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {benchmarkCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedBenchmark(category)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                    activeBenchmark === category
                      ? "border-violet-500 bg-violet-600 text-white"
                      : "border-white/10 bg-white/[0.02] text-zinc-400 hover:text-white"
                  }`}
                >
                  {formatBenchmarkName(category)}
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-bold">
              Model Leaderboard
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Rankings based on the selected benchmark.
            </p>
          </div>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search model or company..."
            className="w-full rounded-xl border border-white/[0.09] bg-[#101117] px-4 py-4 text-sm outline-none focus:border-violet-500"
          />

          {loading && (
            <p className="p-8 text-center text-sm text-zinc-400">
              Loading rankings from database...
            </p>
          )}

          {error && (
            <p className="p-8 text-center text-sm text-red-400">
              {error}
            </p>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#101117]">
              <table className="w-full min-w-[650px] text-left">
                <thead className="bg-white/[0.025] text-[11px] uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="px-5 py-4">Rank</th>
                    <th className="px-5 py-4">Model</th>
                    <th className="px-5 py-4">Company</th>
                    <th className="px-5 py-4">
                      {formatBenchmarkName(activeBenchmark)}
                    </th>
                    <th className="px-5 py-4">Source</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.06]">
                  {rankedModels.map((model, index) => (
                    <tr
                      key={model.id}
                      className="hover:bg-white/[0.025]"
                    >
                      <td className="px-5 py-5">
                        <span
                          className={`font-bold ${
                            index === 0
                              ? "text-amber-400"
                              : "text-zinc-400"
                          }`}
                        >
                          #{index + 1}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <Link
                          href={`/models/${model.slug}`}
                          className="text-sm font-semibold hover:text-violet-400"
                        >
                          {model.name}
                        </Link>
                      </td>

                      <td className="px-5 py-5 text-sm text-zinc-400">
                        {model.company.name}
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-violet-300">
                            {formatScore(model.benchmark.score)}
                          </span>

                          <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-white/10 sm:block">
                            <div
                              className="h-full rounded-full bg-violet-500"
                              style={{
                                width: `${
                                  maximumScore > 0
                                    ? Math.max(
                                        0,
                                        (model.benchmark.score /
                                          maximumScore) *
                                          100
                                      )
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5 text-xs text-zinc-500">
                        {model.benchmark.source}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {rankedModels.length === 0 && (
                <p className="p-10 text-center text-sm text-zinc-500">
                  No evaluated models match this benchmark and search.
                </p>
              )}
            </div>
          )}
        </section>

        <p className="mt-6 text-xs leading-5 text-zinc-500">
          Benchmark scores are displayed in their original source
          values. Only OpenRouter: Artificial Analysis records are
          included. Scores from different benchmark categories may
          use different scales and should not be compared directly.
          Models without a score for the selected benchmark are
          excluded from its leaderboard.
        </p>

        <footer className="mt-12 border-t border-white/[0.07] py-6 text-xs text-zinc-500">
          © 2026 OneAtlas. AI intelligence, unified.
        </footer>
      </div>
    </main>
  );
}
