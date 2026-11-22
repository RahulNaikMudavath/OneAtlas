
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
} from "lucide-react";

type APIModel = {
  id: string;
  slug: string;
  name: string;
  category: string;
  contextWindow: string;
  inputPrice: number;
  outputPrice: number;
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
      <main className="flex min-h-screen items-center justify-center bg-[#08090d] text-white">
        <p className="text-sm text-zinc-400">
          Loading model intelligence...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08090d] px-5 text-white">
        <div className="text-center">
          <p className="text-sm text-red-400">{error}</p>
          <Link href="/" className="mt-5 inline-block text-sm text-violet-400">
            Return to OneAtlas
          </Link>
        </div>
      </main>
    );
  }

  if (!model) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08090d] px-5 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Model not found</h1>
          <p className="mt-2 text-sm text-zinc-400">
            This model does not exist in the OneAtlas catalogue.
          </p>
          <Link href="/" className="mt-5 inline-block text-sm text-violet-400">
            Return to OneAtlas
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08090d] px-5 py-10 text-white sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to OneAtlas
        </Link>

        {/* Model overview */}
        <section className="rounded-3xl border border-white/[0.08] bg-[#101117] p-7 sm:p-10">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/20 text-violet-400">
            <BrainCircuit size={32} />
          </div>

          <p className="mb-3 text-sm font-medium text-violet-400">
            {model.company.name} / AI MODEL
          </p>

          <h1 className="text-3xl font-bold sm:text-5xl">
            {model.name}
          </h1>

          <p className="mt-5 max-w-2xl leading-7 text-zinc-400">
            {model.description || "No model description is available yet."}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {model.capabilities.map((capability) => (
              <span
                key={capability}
                className="rounded-lg border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs text-violet-300"
              >
                {capability}
              </span>
            ))}
          </div>
        </section>

        {/* Specifications */}
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Company", value: model.company.name, icon: Building2 },
            { label: "Category", value: model.category, icon: Zap },
            { label: "Context Window", value: model.contextWindow, icon: Code2 },
            { label: "Modalities", value: model.modalities.join(", "), icon: ImageIcon },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/[0.08] bg-[#101117] p-5"
            >
              <item.icon className="mb-5 text-violet-400" size={22} />
              <p className="text-xs text-zinc-500">{item.label}</p>
              <p className="mt-2 text-lg font-semibold">{item.value}</p>
            </div>
          ))}
        </section>

        {/* Pricing */}
        <section className="mt-8 rounded-2xl border border-white/[0.08] bg-[#101117] p-7">
          <h2 className="text-xl font-bold">Pricing Information</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Demonstration pricing per one million tokens.
          </p>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl bg-white/[0.03] p-5">
              <p className="text-sm text-zinc-400">Input Price</p>
              <p className="mt-3 text-3xl font-bold">
                ${model.inputPrice.toFixed(2)}
              </p>
              <p className="mt-2 text-xs text-zinc-500">Per 1M tokens</p>
            </div>

            <div className="rounded-xl bg-white/[0.03] p-5">
              <p className="text-sm text-zinc-400">Output Price</p>
              <p className="mt-3 text-3xl font-bold">
                ${model.outputPrice.toFixed(2)}
              </p>
              <p className="mt-2 text-xs text-zinc-500">Per 1M tokens</p>
            </div>
          </div>
        </section>

        {/* Provider ecosystem */}
        <section className="mt-8 rounded-2xl border border-white/[0.08] bg-[#101117] p-7">
          <div className="mb-5 flex items-center gap-3">
            <Globe className="text-violet-400" size={22} />
            <h2 className="text-xl font-bold">Available Providers</h2>
          </div>

          {model.providers.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {model.providers.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                >
                  <p className="font-semibold">{item.provider.name}</p>
                  {item.provider.website && (
                    <a
                      href={item.provider.website}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-xs text-violet-400 hover:text-violet-300"
                    >
                      Visit provider website
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">
              No provider information has been added yet.
            </p>
          )}
        </section>

        {/* Benchmarks */}
        <section className="mt-8 rounded-2xl border border-white/[0.08] bg-[#101117] p-7">
          <div className="mb-5 flex items-center gap-3">
            <BarChart3 className="text-violet-400" size={22} />
            <h2 className="text-xl font-bold">Benchmark Performance</h2>
          </div>

          {model.benchmarks.length > 0 ? (
            <div className="space-y-5">
              {model.benchmarks.map((benchmark) => (
                <div key={benchmark.id}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">
                        {benchmark.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {benchmark.category}
                      </p>
                    </div>
                    <span className="font-semibold text-violet-300">
                      {benchmark.score}/100
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{
                        width: `${Math.min(Math.max(benchmark.score, 0), 100)}%`,
                      }}
                    />
                  </div>

                  {benchmark.source && (
                    <p className="mt-1 text-[11px] text-zinc-500">
                      Source: {benchmark.source}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">
              No benchmark records are available for this model.
            </p>
          )}

          <p className="mt-6 text-xs leading-5 text-zinc-500">
            Benchmark scores are illustrative demonstration values, not
            independently verified performance results.
          </p>
        </section>

        {/* Capabilities */}
        <section className="mt-8 rounded-2xl border border-white/[0.08] bg-[#101117] p-7">
          <h2 className="mb-5 text-xl font-bold">
            Model Capabilities
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {model.capabilities.map((capability) => (
              <div key={capability} className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <span className="text-sm text-zinc-300">
                  {capability}
                </span>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-12 border-t border-white/[0.07] py-6 text-xs text-zinc-500">
          © 2026 OneAtlas. AI intelligence, unified.
        </footer>
      </div>
    </main>
  );
}

export default function ModelDetails() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#08090d] text-white">
          <p className="text-sm text-zinc-400">
            Loading model intelligence...
          </p>
        </main>
      }
    >
      <ModelDetailsContent />
    </Suspense>
  );
}
