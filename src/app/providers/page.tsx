
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Search,
  BrainCircuit,
  ExternalLink,
  Gauge,
  Activity,
  CircleDollarSign,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";

type ProviderModel = {
  id: string;
  inputPricePerMillion?: number | null;
  outputPricePerMillion?: number | null;
  latencyMs?: number | null;
  uptimePercent?: number | null;
  isAvailable?: boolean;
  lastCheckedAt?: string | null;
  model: {
    id: string;
    slug: string;
    name: string;
    category: string;
    contextWindow: string;
    inputPrice: number;
    outputPrice: number;
  };
};

type Provider = {
  id: string;
  name: string;
  website: string | null;
  models: ProviderModel[];
};

function average(values: (number | null | undefined)[]) {
  const valid = values.filter(
    (v): v is number => typeof v === "number" && !isNaN(v)
  );
  if (valid.length === 0) return null;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function formatPrice(value: number | null | undefined) {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return "N/A";
  }
  return `$${Number(value).toFixed(2)}`;
}

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

  const allListings = providers.flatMap((provider) => provider.models || []);

  const availableListings = allListings.filter(
    (listing) => listing.isAvailable
  ).length;

  const averageLatency = average(
    allListings.map((listing) => listing.latencyMs)
  );

  const averageUptime = average(
    allListings.map((listing) => listing.uptimePercent)
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
            PROVIDER INTELLIGENCE
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            AI Model <span className="text-violet-400">Providers</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Explore AI providers, compare model pricing, monitor
            performance indicators and discover supported models.
          </p>
        </div>

        {/* OVERVIEW STATISTICS */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-5">
            <Building2 className="mb-4 text-violet-400" size={23} />
            <p className="text-sm text-zinc-400">Providers listed</p>
            <h2 className="mt-2 text-3xl font-bold">
              {loading ? "..." : providers.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-5">
            <BrainCircuit className="mb-4 text-violet-400" size={23} />
            <p className="text-sm text-zinc-400">Model listings</p>
            <h2 className="mt-2 text-3xl font-bold">
              {loading ? "..." : totalModels}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-5">
            <Activity className="mb-4 text-emerald-400" size={23} />
            <p className="text-sm text-zinc-400">Average uptime</p>
            <h2 className="mt-2 text-3xl font-bold">
              {loading
                ? "..."
                : averageUptime === null || averageUptime === undefined || isNaN(averageUptime)
                  ? "N/A"
                  : `${averageUptime.toFixed(2)}%`}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-5">
            <Gauge className="mb-4 text-cyan-400" size={23} />
            <p className="text-sm text-zinc-400">Average latency</p>
            <h2 className="mt-2 text-3xl font-bold">
              {loading
                ? "..."
                : averageLatency === null || averageLatency === undefined || isNaN(averageLatency)
                  ? "N/A"
                  : `${Math.round(averageLatency)} ms`}
            </h2>
          </div>

        </div>

        {/* AVAILABILITY SUMMARY */}

        <div className="mb-9 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#101117] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <p className="text-sm font-semibold">Provider availability</p>
              <p className="mt-1 text-xs text-zinc-500">
                Available model-provider listings
              </p>
            </div>
          </div>

          <p className="text-2xl font-bold">
            {loading ? "..." : `${availableListings}/${totalModels}`}
            <span className="ml-2 text-sm font-normal text-zinc-500">
              available
            </span>
          </p>
        </div>

        {/* PROVIDER LIST */}

        <div className="mb-5">
          <h2 className="text-xl font-bold">Explore Providers</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Compare pricing and performance across AI providers.
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

            {filteredProviders.map((provider) => {
              const latency = average(
                provider.models.map((item) => item.latencyMs)
              );

              const uptime = average(
                provider.models.map((item) => item.uptimePercent)
              );

              const availableCount = provider.models.filter(
                (item) => item.isAvailable
              ).length;

              return (
                <article
                  key={provider.id}
                  className="rounded-2xl border border-white/[0.08] bg-[#101117] p-6 transition hover:border-violet-500/40"
                >

                  {/* PROVIDER HEADER */}

                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                      <Building2 size={24} />
                    </div>

                    <span className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-400">
                      {provider.models.length}{" "}
                      {provider.models.length === 1 ? "model" : "models"}
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

                  {/* PROVIDER PERFORMANCE */}

                  <div className="mt-5 grid grid-cols-3 gap-3">

                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                      <Gauge size={17} className="mb-2 text-cyan-400" />
                      <p className="text-xs text-zinc-500">Latency</p>
                      <p className="mt-1 text-sm font-bold">
                        {latency === null || latency === undefined
                          ? "N/A"
                          : `${Math.round(latency)} ms`}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                      <Activity size={17} className="mb-2 text-emerald-400" />
                      <p className="text-xs text-zinc-500">Uptime</p>
                      <p className="mt-1 text-sm font-bold">
                        {uptime === null || uptime === undefined
                          ? "N/A"
                          : `${uptime.toFixed(2)}%`}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                      <CheckCircle2 size={17} className="mb-2 text-violet-400" />
                      <p className="text-xs text-zinc-500">Available</p>
                      <p className="mt-1 text-sm font-bold">
                        {availableCount}/{provider.models.length}
                      </p>
                    </div>

                  </div>

                  {/* SUPPORTED MODELS */}

                  <div className="mt-6 border-t border-white/[0.07] pt-5">

                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Supported models & pricing
                    </p>

                    <div className="space-y-3">

                      {provider.models.map((listing) => {
                        const { model } = listing;

                        return (
                          <div
                            key={listing.id}
                            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                          >

                            <div className="flex items-start justify-between gap-3">

                              <div>
                                <Link
                                  href={`/models/${model.slug}`}
                                  className="text-sm font-semibold hover:text-violet-400"
                                >
                                  {model.name}
                                </Link>

                                <p className="mt-1 text-xs text-zinc-500">
                                  {model.category} · {model.contextWindow}
                                </p>
                              </div>

                              <span
                                className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                                  listing.isAvailable
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-red-500/10 text-red-400"
                                }`}
                              >
                                {listing.isAvailable ? (
                                  <CheckCircle2 size={11} />
                                ) : (
                                  <AlertCircle size={11} />
                                )}

                                {listing.isAvailable ? "Available" : "Unavailable"}
                              </span>

                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">

                              <div>
                                <div className="mb-1 flex items-center gap-1.5 text-xs text-zinc-500">
                                  <CircleDollarSign size={13} />
                                  Input / 1M tokens
                                </div>

                                <p className="text-sm font-semibold text-white">
                                  {formatPrice(
                                    listing.inputPricePerMillion ?? listing.model?.inputPrice
                                  )}
                                </p>
                              </div>

                              <div>
                                <div className="mb-1 flex items-center gap-1.5 text-xs text-zinc-500">
                                  <CircleDollarSign size={13} />
                                  Output / 1M tokens
                                </div>

                                <p className="text-sm font-semibold text-white">
                                  {formatPrice(
                                    listing.outputPricePerMillion ?? listing.model?.outputPrice
                                  )}
                                </p>
                              </div>

                            </div>

                            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-3">

                              <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                                <Clock size={12} />
                                {listing.latencyMs === null || listing.latencyMs === undefined
                                  ? "Latency N/A"
                                  : `${listing.latencyMs} ms latency`}
                              </p>

                              <Link
                                href={`/models/${model.slug}`}
                                className="inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300"
                              >
                                Model details
                                <ExternalLink size={12} />
                              </Link>

                            </div>

                          </div>
                        );
                      })}

                    </div>
                  </div>

                </article>
              );
            })}

          </div>
        )}

        {!loading && !error && filteredProviders.length === 0 && (
          <p className="rounded-xl border border-white/10 p-8 text-center text-sm text-zinc-500">
            No providers found.
          </p>
        )}

        <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4">
          <p className="text-xs leading-5 text-amber-300/80">
            Demo data notice: Provider pricing and performance metrics are
            illustrative values for demonstration purposes. They are not
            live measurements or verified provider service-level guarantees.
          </p>
        </div>

        <footer className="mt-12 border-t border-white/[0.07] py-6 text-xs text-zinc-500">
          © 2026 OneAtlas. AI intelligence, unified.
        </footer>

      </div>
    </main>
  );
}
