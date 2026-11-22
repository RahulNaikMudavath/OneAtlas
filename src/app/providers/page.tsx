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
  Sparkles,
  Server,
  Layers,
  Zap,
} from "lucide-react";

type ProviderModel = {
  id: string;
  inputPricePerMillion?: number | null;
  outputPricePerMillion?: number | null;
  latencyMs?: number | null;
  uptimePercent?: number | null;
  uptimeLast30m?: number | null;
  endpointStatus?: number | null;
  isAvailable?: boolean;
  lastCheckedAt?: string | null;
  model: {
    id: string;
    slug: string;
    name: string;
    category: string;
    contextWindow: string;
    inputPrice?: number | null;
    outputPrice?: number | null;
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
    (v): v is number => typeof v === "number" && !isNaN(v) && Number.isFinite(v)
  );
  if (valid.length === 0) return null;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function formatPrice(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "N/A";
  }
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return "N/A";
  }
  return `$${num.toFixed(2)}`;
}

function formatPercent(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "N/A";
  }
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return "N/A";
  }
  return `${num.toFixed(1)}%`;
}

function formatLatency(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "N/A";
  }
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return "N/A";
  }
  return `${Math.round(num)} ms`;
}

function formatEndpointStatus(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "Unknown";
  }

  return `Code ${value}`;
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
    (total, provider) => total + (provider.models?.length || 0),
    0
  );

  const allListings = providers.flatMap((provider) => provider.models || []);

  const endpointsWithStatus = allListings.filter(
    (listing) => typeof listing.endpointStatus === "number"
  ).length;

  const averageLatency = average(
    allListings.map((listing) => listing.latencyMs)
  );

  const averageUptime = average(
    allListings.map((listing) => listing.uptimeLast30m)
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07080f] px-5 py-8 text-white sm:px-10">
      {/* Ambient Aurora Glow Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute -right-48 top-1/4 h-[600px] w-[600px] rounded-full bg-cyan-600/10 blur-[150px]" />
        <div className="absolute bottom-10 left-1/3 h-[500px] w-[500px] rounded-full bg-emerald-600/08 blur-[160px]" />
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

        {/* Page Hero Header */}
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-violet-300 backdrop-blur-md">
            <Server size={14} className="text-violet-400" />
            Infrastructure & Routing Telemetry
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            AI Model{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              Providers
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Inference endpoints, latency metrics, uptime data, and pricing across global providers.
          </p>
        </div>

        {/* Overview Stats Cards */}
        <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Providers */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Hosting Providers
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
                <Building2 size={18} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-white">
              {loading ? "..." : providers.length}
            </p>
            <p className="mt-1 text-xs text-slate-400">Registered providers</p>
          </div>

          {/* Card 2: Total Listings */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Model Deployments
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
                <BrainCircuit size={18} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-white">
              {loading ? "..." : totalModels}
            </p>
            <p className="mt-1 text-xs text-slate-400">Catalog inference routes</p>
          </div>

          {/* Card 3: Average Uptime */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Fleet Uptime (30m)
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                <Activity size={18} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-emerald-400">
              {loading ? "..." : formatPercent(averageUptime)}
            </p>
            <p className="mt-1 text-xs text-slate-400">Average reported uptime (30m)</p>
          </div>

          {/* Card 4: Average Latency */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6 backdrop-blur-xl transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Average Latency
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                <Gauge size={18} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-amber-300">
              {loading ? "..." : formatLatency(averageLatency)}
            </p>
            <p className="mt-1 text-xs text-slate-400">Time to first token index</p>
          </div>
        </div>

        {/* Endpoint Telemetry Coverage */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-slate-900/40 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
              <Activity size={22} />
            </div>

            <div>
              <p className="text-sm font-bold text-white">
                Endpoint Telemetry
              </p>
              <p className="text-xs text-slate-400">
                OpenRouter-reported endpoint status information
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            {loading
              ? "Checking..."
              : `${endpointsWithStatus} of ${totalModels} Endpoints With Status Data`}
          </span>
        </div>

        {/* Search Bar Section */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Explore Host Providers
            </h2>
            <p className="text-xs text-slate-400">
              Inspect model pricing, endpoint availability, and technical latency.
            </p>
          </div>

          <div className="relative w-full max-w-md">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search providers by name..."
              className="w-full rounded-xl border border-white/[0.09] bg-slate-900/60 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 backdrop-blur-xl outline-none transition-all duration-200 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-slate-900/40 p-16 text-center backdrop-blur-xl">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
            <p className="mt-4 text-sm font-medium text-slate-300">
              Gathering provider fleet intelligence...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-300 backdrop-blur-xl">
            <AlertCircle size={28} className="mx-auto mb-2 text-red-400" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Provider Cards Grid */}
        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredProviders.map((provider) => {
              const latency = average(
                provider.models?.map((item) => item.latencyMs) || []
              );
              const uptime = average(
                provider.models?.map((item) => item.uptimeLast30m) || []
              );

              const statusCount = (provider.models || []).filter(
                (item) => typeof item.endpointStatus === "number"
              ).length;

              const modelCount = provider.models?.length || 0;

              return (
                <article
                  key={provider.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/45 p-6 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/40 hover:shadow-[0_0_35px_rgba(139,92,246,0.12)]"
                >
                  <div>
                    {/* Header: Avatar, Name & Model Count Badge */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-violet-300 shadow-inner">
                          <Building2 size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white transition-colors group-hover:text-violet-300">
                            {provider.name}
                          </h3>
                          {provider.website ? (
                            <a
                              href={provider.website}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-violet-400 transition-colors hover:text-cyan-300"
                            >
                              Official Endpoint
                              <ExternalLink size={11} />
                            </a>
                          ) : (
                            <span className="text-xs text-slate-500">API Host</span>
                          )}
                        </div>
                      </div>

                      <span className="inline-flex items-center rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
                        {modelCount} {modelCount === 1 ? "model" : "models"}
                      </span>
                    </div>

                    {/* Performance Metrics Quick Bar */}
                    <div className="mt-5 grid grid-cols-3 gap-2.5">
                      {/* Latency */}
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Gauge size={13} className="text-amber-400" />
                          Latency
                        </div>
                        <p className="mt-1 text-sm font-bold text-slate-200">
                          {formatLatency(latency)}
                        </p>
                      </div>

                      {/* Uptime */}
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Activity size={13} className="text-emerald-400" />
                          Uptime
                        </div>
                        <p className="mt-1 text-sm font-bold text-emerald-400">
                          {formatPercent(uptime)}
                        </p>
                      </div>

                      {/* Endpoint Status Coverage */}
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Activity size={13} className="text-cyan-400" />
                          Status Data
                        </div>

                        <p className="mt-1 text-sm font-bold text-cyan-300">
                          {statusCount}/{modelCount}
                        </p>
                      </div>
                    </div>

                    {/* Supported Models List Preview */}
                    <div className="mt-6 border-t border-white/[0.08] pt-5">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Deployed Models & Pricing (Per 1M Tokens)
                      </p>

                      <div className="max-h-64 space-y-2.5 overflow-y-auto pr-1">
                        {provider.models?.map((listing) => {
                          const { model } = listing;
                          if (!model) return null;

                          const inputPriceDisplay = formatPrice(
                            listing.inputPricePerMillion ?? model.inputPrice
                          );
                          const outputPriceDisplay = formatPrice(
                            listing.outputPricePerMillion ?? model.outputPrice
                          );

                          return (
                            <div
                              key={listing.id}
                              className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5 transition-all duration-200 hover:border-violet-500/30 hover:bg-white/[0.04]"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <Link
                                    href={`/models/${model.slug}`}
                                    className="text-sm font-bold text-slate-200 hover:text-violet-400"
                                  >
                                    {model.name}
                                  </Link>
                                  <p className="mt-0.5 text-xs text-slate-400">
                                    {model.category || "General"} · {model.contextWindow || "Standard"}
                                  </p>
                                </div>

                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                                  <Activity size={10} />
                                  {formatEndpointStatus(listing.endpointStatus)}
                                </span>
                              </div>

                              <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-emerald-400">
                                    In: {inputPriceDisplay}
                                  </span>
                                  <span className="text-slate-600">•</span>
                                  <span className="font-mono text-violet-300">
                                    Out: {outputPriceDisplay}
                                  </span>
                                </div>

                                <Link
                                  href={`/models/${model.slug}`}
                                  className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300"
                                >
                                  Specs
                                  <ExternalLink size={10} />
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredProviders.length === 0 && (
          <div className="rounded-2xl border border-white/[0.08] bg-slate-900/40 p-12 text-center backdrop-blur-xl">
            <Building2 className="mx-auto mb-3 text-slate-500" size={36} />
            <p className="text-base font-bold text-white">No providers found</p>
            <p className="mt-1 text-xs text-slate-400">
              No host matched your search query &quot;{search}&quot;.
            </p>
            <button
              onClick={() => setSearch("")}
              className="mt-4 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-300 transition-all hover:bg-violet-500/20"
            >
              Clear Search Query
            </button>
          </div>
        )}

        {/* Footer & Telemetry Disclaimer */}
        <div className="mt-12 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs text-slate-400">
          <p>
            <span className="font-bold text-slate-300">
              Data Source Note:
            </span>{" "}
            Provider pricing, endpoint status, 30-minute uptime, and latency
            are displayed from OpenRouter data where available. Missing
            telemetry is shown as unavailable. Status codes are displayed
            without assigning unverified meanings.
          </p>
        </div>

        <footer className="mt-8 border-t border-white/[0.08] py-6 text-center text-xs text-slate-500">
          © 2026 OneAtlas. High-performance AI model intelligence and provider routing.
        </footer>
      </div>
    </main>
  );
}
