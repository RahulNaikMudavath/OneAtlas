"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BrainCircuit,
  Zap,
  Code2,
  Image as ImageIcon,
  CheckCircle2,
  Building2,
  BarChart3,
  Globe,
  Sparkles,
  ExternalLink,
  Layers,
  CircleDollarSign,
  Calendar,
} from "lucide-react";

type APIModel = {
  id: string;
  slug: string;
  name: string;
  category: string;
  contextWindow: string;
  inputPrice?: number | null;
  outputPrice?: number | null;
  releaseDate?: string | null;
  description: string | null;
  capabilities: string[];
  modalities: string[];
  company: {
    id: string;
    name: string;
    description: string | null;
    type: string | null;
  };
  providers: {
    id: string;
    provider: {
      id: string;
      name: string;
      website: string | null;
    };
  }[];
  benchmarks: {
    id: string;
    name: string;
    category: string;
    score: number;
    source: string | null;
  }[];
};

function formatPrice(value?: number | null): string {
  if (value === null || value === undefined) return "N/A";
  const num = Number(value);
  if (!Number.isFinite(num)) return "N/A";
  return `$${num.toFixed(2)}`;
}

function ModelDetailsContent() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [model, setModel] = useState<APIModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchModel() {
      try {
        const response = await fetch("/api/models");

        if (!response.ok) {
          throw new Error("Unable to fetch model details");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Unable to load model");
        }

        const foundModel = result.data.find(
          (item: APIModel) => item.slug === slug
        );

        setModel(foundModel || null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchModel();
    }
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07080f] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          <p className="text-sm font-medium text-slate-400">
            Loading model intelligence...
          </p>
        </div>
      </main>
    );
  }

  if (error || !model) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#07080f] px-5 text-center text-white">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 backdrop-blur-xl">
          <p className="text-base font-bold text-red-300">
            {error || "Model not found in intelligence database."}
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
          >
            <ArrowLeft size={14} /> Back to Catalog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07080f] px-5 py-8 text-white sm:px-10">
      {/* Ambient Aurora Glow Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute -right-48 top-1/4 h-[600px] w-[600px] rounded-full bg-cyan-600/10 blur-[150px]" />
        <div className="absolute bottom-10 left-1/3 h-[500px] w-[500px] rounded-full bg-fuchsia-600/08 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Back Link */}
        <Link
          href="/"
          className="group mb-8 inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur-md transition-all duration-200 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Back to Explorer
        </Link>

        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-900/50 p-8 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-violet-300">
              <BrainCircuit size={14} className="text-violet-400" />
              {model.category} Architecture
            </div>

            {model.releaseDate && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-slate-400">
                <Calendar size={12} className="text-violet-400" />
                Released {new Date(model.releaseDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            {model.name}
          </h1>

          <p className="mt-2 text-sm font-medium text-violet-300">
            Engineered by {model.company?.name || "Independent"}
          </p>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
            {model.description ||
              `${model.name} is a high-performance foundation model engineered by ${model.company?.name || "the developer"}, supporting diverse tasks including reasoning, analysis, and API orchestration.`}
          </p>
        </div>

        {/* Technical Specs 4-Grid */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/[0.08] bg-slate-900/50 p-5 backdrop-blur-xl">
            <Building2 className="mb-4 text-violet-400" size={20} />
            <p className="text-xs uppercase tracking-wider text-slate-400">Publisher</p>
            <p className="mt-1 text-lg font-bold text-white">{model.company?.name || "Independent"}</p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-slate-900/50 p-5 backdrop-blur-xl">
            <Zap className="mb-4 text-cyan-400" size={20} />
            <p className="text-xs uppercase tracking-wider text-slate-400">Category</p>
            <p className="mt-1 text-lg font-bold text-white">{model.category}</p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-slate-900/50 p-5 backdrop-blur-xl">
            <Code2 className="mb-4 text-amber-400" size={20} />
            <p className="text-xs uppercase tracking-wider text-slate-400">Context Window</p>
            <p className="mt-1 font-mono text-lg font-bold text-white">{model.contextWindow}</p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-slate-900/50 p-5 backdrop-blur-xl">
            <ImageIcon className="mb-4 text-emerald-400" size={20} />
            <p className="text-xs uppercase tracking-wider text-slate-400">Modalities</p>
            <p className="mt-1 text-lg font-bold text-white">{(model.modalities || []).join(", ") || "Text"}</p>
          </div>
        </section>

        {/* Pricing Matrix */}
        <section className="mt-8 rounded-2xl border border-white/[0.08] bg-slate-900/50 p-7 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <CircleDollarSign className="text-emerald-400" size={20} />
            <h2 className="text-xl font-bold text-white">Pricing Structure</h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Standard pricing per one million tokens across default inference routes.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <span className="text-xs uppercase tracking-wider text-slate-400">Prompt / Input Price</span>
              <p className="mt-2 font-mono text-3xl font-extrabold text-emerald-400">
                {formatPrice(model.inputPrice)}
              </p>
              <p className="mt-1 text-xs text-slate-500">Per 1,000,000 input tokens</p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <span className="text-xs uppercase tracking-wider text-slate-400">Completion / Output Price</span>
              <p className="mt-2 font-mono text-3xl font-extrabold text-violet-300">
                {formatPrice(model.outputPrice)}
              </p>
              <p className="mt-1 text-xs text-slate-500">Per 1,000,000 output tokens</p>
            </div>
          </div>
        </section>

        {/* Provider Ecosystem */}
        <section className="mt-8 rounded-2xl border border-white/[0.08] bg-slate-900/50 p-7 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <Globe className="text-violet-400" size={20} />
            <h2 className="text-xl font-bold text-white">Available Host Providers</h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Inference endpoints supporting deployment of {model.name}.
          </p>

          {(model.providers || []).length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {model.providers.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-violet-500/40"
                >
                  <p className="font-bold text-white">{item.provider.name}</p>
                  {item.provider.website && (
                    <a
                      href={item.provider.website}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-cyan-300"
                    >
                      Visit provider site <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-xs italic text-slate-500">
              Provider routing available through OpenRouter unified proxy.
            </p>
          )}
        </section>

        {/* Benchmarks Section */}
        <section className="mt-8 rounded-2xl border border-white/[0.08] bg-slate-900/50 p-7 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <BarChart3 className="text-amber-400" size={20} />
            <h2 className="text-xl font-bold text-white">Artificial Analysis Benchmark Indices</h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Empirical quality and performance evaluation scores.
          </p>

          {(model.benchmarks || []).length > 0 ? (
            <div className="mt-6 space-y-4">
              {model.benchmarks.map((benchmark) => (
                <div key={benchmark.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">{benchmark.name}</span>
                    <span className="font-mono font-bold text-amber-300">{benchmark.score} / 100</span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-violet-500"
                      style={{
                        width: `${Math.min(Math.max(benchmark.score, 0), 100)}%`,
                      }}
                    />
                  </div>

                  {benchmark.source && (
                    <p className="text-[10px] text-slate-500">
                      Source: {benchmark.source}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-xs italic text-slate-500">
              No Artificial Analysis benchmark indices recorded for this specific model variant yet.
            </p>
          )}
        </section>

        {/* Capabilities Section */}
        <section className="mt-8 rounded-2xl border border-white/[0.08] bg-slate-900/50 p-7 backdrop-blur-xl">
          <h2 className="text-xl font-bold text-white">Supported Capabilities</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {(model.capabilities || []).map((capability) => (
              <div
                key={capability}
                className="flex items-center gap-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 text-sm text-slate-200"
              >
                <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                <span>{capability}</span>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-12 border-t border-white/[0.08] py-6 text-center text-xs text-slate-500">
          © 2026 OneAtlas. AI Model Intelligence & Architectural Specs.
        </footer>
      </div>
    </main>
  );
}

export default function ModelDetails() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#07080f] text-white">
          <p className="text-sm text-slate-400">Loading model intelligence...</p>
        </main>
      }
    >
      <ModelDetailsContent />
    </Suspense>
  );
}
