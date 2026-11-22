"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Search,
  BrainCircuit,
  ExternalLink,
} from "lucide-react";

type Provider = {
  id: string;
  name: string;
  website: string | null;
  models: {
    id: string;
    model: {
      id: string;
      slug: string;
      name: string;
      category: string;
      contextWindow: string;
      inputPrice: number;
      outputPrice: number;
    };
  }[];
};

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProviders() {
      try {
        const response = await fetch("/api/providers");

        if (!response.ok) {
          throw new Error("Unable to load providers");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Provider request failed");
        }

        setProviders(result.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    loadProviders();
  }, []);

  const filteredProviders = useMemo(() => {
    return providers.filter((provider) =>
      provider.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [providers, search]);

  const totalModels = providers.reduce(
    (total, provider) => total + provider.models.length,
    0
  );

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
          <div className="mb-3 flex items-center gap-2 text-xs tracking-widest text-violet-400">
            <Building2 size={17} />
            PROVIDER ECOSYSTEM
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            AI Model <span className="text-violet-400">Providers</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Explore providers, discover their supported models and
            compare the model catalogue.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-5">
            <Building2 className="mb-4 text-violet-400" size={23} />
            <p className="text-sm text-zinc-400">Providers listed</p>
            <h2 className="mt-2 text-3xl font-bold">
              {loading ? "..." : providers.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-5">
            <BrainCircuit className="mb-4 text-violet-400" size={23} />
            <p className="text-sm text-zinc-400">Provider model listings</p>
            <h2 className="mt-2 text-3xl font-bold">
              {loading ? "..." : totalModels}
            </h2>
          </div>
        </div>

        <div className="mb-5">
          <h2 className="text-xl font-bold">Explore Providers</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Browse the providers available in OneAtlas.
          </p>
        </div>

        <div className="relative mb-7">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search providers..."
            className="w-full rounded-xl border border-white/[0.09] bg-[#101117] py-4 pl-12 pr-4 text-sm outline-none focus:border-violet-500"
          />
        </div>

        {loading && (
          <p className="rounded-xl border border-white/10 p-8 text-center text-sm text-zinc-400">
            Loading providers...
          </p>
        )}

        {error && (
          <p className="rounded-xl border border-red-500/20 p-8 text-center text-sm text-red-400">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredProviders.map((provider) => (
              <article
                key={provider.id}
                className="rounded-2xl border border-white/[0.08] bg-[#101117] p-6 transition hover:border-violet-500/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <Building2 size={24} />
                  </div>

                  <span className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-400">
                    {provider.models.length} models
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  {provider.name}
                </h3>

                {provider.website && (
                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-2 text-xs text-violet-400"
                  >
                    Official website
                    <ExternalLink size={12} />
                  </a>
                )}

                <div className="mt-5 border-t border-white/[0.07] pt-5">
                  <p className="mb-3 text-xs text-zinc-500">
                    Supported models
                  </p>

                  <div className="space-y-3">
                    {provider.models.map(({ model }) => (
                      <Link
                        key={model.id}
                        href={`/models/${model.slug}`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 hover:border-violet-500/40"
                      >
                        <div>
                          <p className="text-sm font-semibold">
                            {model.name}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {model.category} · {model.contextWindow}
                          </p>
                        </div>
                        <ExternalLink
                          size={14}
                          className="shrink-0 text-violet-400"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && !error && filteredProviders.length === 0 && (
          <p className="rounded-xl border border-white/10 p-8 text-center text-sm text-zinc-500">
            No providers found.
          </p>
        )}

        <footer className="mt-12 border-t border-white/[0.07] py-6 text-xs text-zinc-500">
          © 2026 OneAtlas. AI intelligence, unified.
        </footer>
      </div>
    </main>
  );
}
