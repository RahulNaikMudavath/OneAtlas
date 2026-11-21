"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Trophy,
  Search,
  Medal,
  Code2,
  BrainCircuit,
  Zap,
  TrendingUp,
} from "lucide-react";
import { models } from "@/data/models";

const benchmarkData = [
  { slug: "gpt-5-1", overall: 96, reasoning: 95, coding: 97, knowledge: 94 },
  { slug: "claude-sonnet-4-5", overall: 94, reasoning: 96, coding: 98, knowledge: 91 },
  { slug: "gemini-2-5-pro", overall: 92, reasoning: 94, coding: 91, knowledge: 96 },
  { slug: "deepseek-v3", overall: 89, reasoning: 91, coding: 93, knowledge: 86 },
  { slug: "llama-4-maverick", overall: 86, reasoning: 85, coding: 87, knowledge: 88 },
];

type Metric = "overall" | "reasoning" | "coding" | "knowledge";

const metrics: { label: string; value: Metric }[] = [
  { label: "Overall Score", value: "overall" },
  { label: "Reasoning", value: "reasoning" },
  { label: "Coding", value: "coding" },
  { label: "Knowledge", value: "knowledge" },
];

export default function RankingsPage() {
  const [metric, setMetric] = useState<Metric>("overall");
  const [search, setSearch] = useState("");

  const rankedModels = useMemo(() => {
    return benchmarkData
      .map((benchmark) => {
        const model = models.find((item) => item.slug === benchmark.slug);
        return model ? { ...model, ...benchmark } : null;
      })
      .filter((item) => item !== null)
      .filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.company.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => b[metric] - a[metric]);
  }, [metric, search]);

  const topModel = rankedModels[0];

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
            Rankings & <span className="text-violet-400">Benchmarks</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Explore AI model performance across reasoning, coding and
            knowledge benchmarks.
          </p>
        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.08] p-6 md:col-span-2">
            <div className="flex items-center gap-2 text-sm text-violet-300">
              <Medal size={19} />
              Current top performer
            </div>
            {topModel && (
              <>
                <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">{topModel.name}</h2>
                    <p className="mt-1 text-sm text-zinc-400">
                      {topModel.company}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-violet-300">
                      {topModel[metric]}
                      <span className="text-lg">/100</span>
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {metrics.find((item) => item.value === metric)?.label}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-6">
            <TrendingUp className="mb-5 text-emerald-400" size={23} />
            <p className="text-sm text-zinc-400">Models evaluated</p>
            <h2 className="mt-2 text-4xl font-bold">05</h2>
            <p className="mt-2 text-xs text-zinc-500">
              Initial demonstration leaderboard
            </p>
          </div>
        </div>

        <section className="mb-8 rounded-2xl border border-white/[0.08] bg-[#101117] p-5">
          <h2 className="mb-5 font-semibold">Performance categories</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Reasoning", icon: BrainCircuit, description: "Logical thinking and problem solving" },
              { label: "Coding", icon: Code2, description: "Programming and code generation" },
              { label: "Knowledge", icon: Zap, description: "Knowledge and information tasks" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
              >
                <item.icon size={22} className="mb-4 text-violet-400" />
                <p className="font-medium">{item.label}</p>
                <p className="mt-1 text-xs text-zinc-500">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-bold">Model Leaderboard</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Compare model performance and rankings.
            </p>
          </div>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search model or provider..."
            className="w-full rounded-xl border border-white/[0.09] bg-[#101117] px-4 py-4 text-sm outline-none focus:border-violet-500"
          />

          <div className="flex flex-wrap gap-2">
            {metrics.map((item) => (
              <button
                key={item.value}
                onClick={() => setMetric(item.value)}
                className={`rounded-lg px-4 py-2 text-xs font-medium transition ${
                  metric === item.value
                    ? "bg-violet-600 text-white"
                    : "border border-white/10 bg-[#101117] text-zinc-400 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#101117]">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-white/[0.025] text-[11px] uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-5 py-4">Rank</th>
                  <th className="px-5 py-4">Model</th>
                  <th className="px-5 py-4">Overall</th>
                  <th className="px-5 py-4">Reasoning</th>
                  <th className="px-5 py-4">Coding</th>
                  <th className="px-5 py-4">Knowledge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {rankedModels.map((model, index) => (
                  <tr key={model.slug} className="hover:bg-white/[0.025]">
                    <td className="px-5 py-5">
                      <span className={`font-bold ${
                        index === 0 ? "text-amber-400" : "text-zinc-400"
                      }`}>
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
                      <p className="mt-1 text-xs text-zinc-500">
                        {model.company}
                      </p>
                    </td>
                    {(["overall", "reasoning", "coding", "knowledge"] as const).map(
                      (key) => (
                        <td key={key} className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <span className={`text-sm font-semibold ${
                              key === metric ? "text-violet-300" : "text-zinc-300"
                            }`}>
                              {model[key]}
                            </span>
                            <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-white/10 sm:block">
                              <div
                                className="h-full rounded-full bg-violet-500"
                                style={{ width: `${model[key]}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {rankedModels.length === 0 && (
              <p className="p-10 text-center text-sm text-zinc-500">
                No matching models found.
              </p>
            )}
          </div>
        </section>

        <p className="mt-6 text-xs leading-5 text-zinc-500">
          Note: Scores on this page are illustrative demonstration values,
          not verified benchmark results. They must not be interpreted as
          actual model performance rankings.
        </p>

        <footer className="mt-12 border-t border-white/[0.07] py-6 text-xs text-zinc-500">
          © 2026 OneAtlas. AI intelligence, unified.
        </footer>
      </div>
    </main>
  );
}
