"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Trophy,
  Medal,
  TrendingUp,
  BarChart3,
  Search,
  Sparkles,
  ExternalLink,
  Flame,
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
    <main className="relative min-h-screen bg-[#07080f] px-5 py-8 text-slate-100 sm:px-10 overflow-x-hidden">
      {/* Ambient Radial Lights */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[200px] left-1/3 h-[500px] w-[800px] rounded-full bg-amber-500/10 blur-[150px]" />
        <div className="absolute top-[400px] -right-[150px] h-[550px] w-[550px] rounded-full bg-violet-600/15 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-semibold text-zinc-400 backdrop-blur-md transition hover:border-violet-500/40 hover:bg-white/[0.06] hover:text-white"
        >
          <ArrowLeft size={15} />
          Back to Atlas Overview
        </Link>

        {/* HERO TITLE */}
        <div className="mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Trophy size={14} className="text-amber-400" />
            <span>ARTIFICIAL ANALYSIS BENCHMARKS</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl text-white">
            AI Model{" "}
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-violet-400 bg-clip-text text-transparent">
              Leaderboards & Rankings
            </span>
          </h1>

          <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-zinc-400">
            Compare quantitative performance indices across frontier architectures using verified
            evaluations from Artificial Analysis and OpenRouter telemetry.
          </p>
        </div>

        {/* TOP PERFORMER PODIUM CARDS */}
        <div className="mb-10 grid gap-5 md:grid-cols-3">
          {/* Card 1: Gold Top Performer */}
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-[#0e101b] to-[#080912] p-7 shadow-[0_8px_32px_rgba(245,158,11,0.12)] md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                <Medal size={15} />
                <span>#1 Ranked in {formatBenchmarkName(activeBenchmark)}</span>
              </div>
              <Flame size={20} className="text-amber-400" />
            </div>

            {loading ? (
              <p className="mt-5 text-sm text-zinc-400">Loading leaderboard...</p>
            ) : topModel ? (
              <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    {topModel.name}
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-amber-300/80">
                    Publisher: {topModel.company.name}
                  </p>
                  <Link
                    href={`/models/${topModel.slug}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition"
                  >
                    View model specs & providers
                    <ExternalLink size={12} />
                  </Link>
                </div>

                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-right backdrop-blur-md">
                  <p className="text-4xl sm:text-5xl font-black text-amber-300 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                    {formatScore(topModel.benchmark.score)}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold tracking-wider uppercase text-amber-200/70">
                    Index Score
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-5 text-sm text-zinc-400">
                No benchmark data available for this category.
              </p>
            )}
          </div>

          {/* Card 2: Models Evaluated Stat */}
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-violet-500/10 via-[#0e101b] to-[#080912] p-7 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between mb-4">
              <span className="rounded-full bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-bold text-violet-300 border border-violet-500/20">
                Coverage
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                <TrendingUp size={20} />
              </div>
            </div>

            <p className="text-xs font-semibold text-zinc-400">Models Evaluated</p>
            <h2 className="mt-1 text-4xl sm:text-5xl font-black text-white">
              {loading ? "..." : evaluatedModelCount}
            </h2>
            <p className="mt-2 text-xs text-zinc-500">
              Models with verified Artificial Analysis metrics.
            </p>
          </div>
        </div>

        {/* BENCHMARK CATEGORY SELECTOR */}
        <section className="mb-8 rounded-3xl border border-white/[0.08] bg-[#0c0e18]/80 p-6 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-violet-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Evaluation Dimensions
            </h2>
          </div>

          {loading ? (
            <p className="text-xs text-zinc-400">Loading benchmark categories...</p>
          ) : benchmarkCategories.length === 0 ? (
            <p className="text-xs text-zinc-400">No imported benchmark categories available.</p>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {benchmarkCategories.map((category) => {
                const isActive = activeBenchmark === category;

                return (
                  <button
                    key={category}
                    onClick={() => setSelectedBenchmark(category)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_18px_rgba(139,92,246,0.4)] border border-violet-400"
                        : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:border-violet-500/30 hover:text-white"
                    }`}
                  >
                    {formatBenchmarkName(category)}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* LEADERBOARD TABLE */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-white">
                {formatBenchmarkName(activeBenchmark)} Rankings
              </h2>
              <p className="mt-0.5 text-xs text-zinc-400">
                Sorted from highest score to lowest.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search ranked models..."
                className="w-full rounded-xl border border-white/10 bg-[#0c0e18] py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {loading && (
            <div className="p-16 text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
              <p className="text-sm text-zinc-400">Loading rankings from database...</p>
            </div>
          )}

          {error && (
            <p className="p-8 text-center text-sm text-red-400">
              {error}
            </p>
          )}

          {!loading && !error && (
            <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c0e18]/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left">
                  <thead className="border-b border-white/[0.07] bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    <tr>
                      <th className="px-6 py-4">Rank</th>
                      <th className="px-6 py-4">AI Model</th>
                      <th className="px-6 py-4">Publisher</th>
                      <th className="px-6 py-4">Benchmark Metric</th>
                      <th className="px-6 py-4">Source</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/[0.05] text-xs">
                    {rankedModels.map((model, index) => {
                      const isTop3 = index < 3;
                      const rankColors = [
                        "text-amber-300 bg-amber-500/20 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]",
                        "text-slate-200 bg-slate-500/20 border-slate-400/40 shadow-[0_0_10px_rgba(148,163,184,0.3)]",
                        "text-amber-600 bg-amber-700/20 border-amber-700/40",
                      ];

                      return (
                        <tr
                          key={model.id}
                          className="group transition-colors duration-150 hover:bg-white/[0.035]"
                        >
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black border ${
                                isTop3
                                  ? rankColors[index]
                                  : "border-white/10 bg-white/5 text-zinc-400"
                              }`}
                            >
                              {index + 1}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <Link
                              href={`/models/${model.slug}`}
                              className="font-bold text-slate-100 group-hover:text-violet-300 transition text-sm flex items-center gap-1.5"
                            >
                              <span>{model.name}</span>
                              <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 text-violet-400 transition" />
                            </Link>
                          </td>

                          <td className="px-6 py-4 text-xs font-semibold text-zinc-400">
                            {model.company.name}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm font-bold text-violet-300">
                                {formatScore(model.benchmark.score)}
                              </span>

                              <div className="hidden h-2 w-28 overflow-hidden rounded-full bg-white/10 sm:block">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 shadow-[0_0_8px_rgba(167,139,250,0.6)]"
                                  style={{
                                    width: `${
                                      maximumScore > 0
                                        ? Math.max(
                                            5,
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

                          <td className="px-6 py-4 text-[11px] text-zinc-500">
                            {model.benchmark.source}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {rankedModels.length === 0 && (
                <div className="p-16 text-center space-y-1">
                  <p className="text-sm font-bold text-white">No evaluated models match this benchmark</p>
                  <p className="text-xs text-zinc-500">Try selecting another dimension or clearing your search.</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* FOOTER NOTICE */}
        <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-xs leading-relaxed text-zinc-400">
          <p>
            All displayed benchmark scores are verified source values provided by OpenRouter and Artificial Analysis.
            Different metrics measure specialized capabilities (coding, finance, reasoning) and are not directly comparable across categories.
          </p>
        </div>

        <footer className="mt-12 border-t border-white/[0.08] py-6 text-xs text-zinc-500">
          © 2026 OneAtlas. AI intelligence, unified.
        </footer>
      </div>
    </main>
  );
}
