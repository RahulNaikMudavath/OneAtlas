"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Search,
  BrainCircuit,
  ExternalLink,
  ChevronRight,
  Layers3,
  Sparkles,
} from "lucide-react";

type APIModel = {
  id: string;
  slug: string;
  name: string;
  company: {
    id: string;
    name: string;
    description: string | null;
    type: string | null;
  };
};

type Company = {
  id: string;
  name: string;
  description: string;
  type: string;
  models: APIModel[];
};

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [models, setModels] = useState<APIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch("/api/models");

        if (!response.ok) {
          throw new Error("Unable to fetch company data");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Unable to load companies");
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

  const allCompanies = useMemo(() => {
    const grouped = new Map<string, Company>();

    models.forEach((model) => {
      const company = model.company;
      if (!company) return;

      if (!grouped.has(company.id)) {
        grouped.set(company.id, {
          id: company.id,
          name: company.name,
          description:
            company.description ||
            `${company.name} AI research lab and model publisher.`,
          type: company.type || "AI Publisher",
          models: [],
        });
      }

      grouped.get(company.id)!.models.push(model);
    });

    return Array.from(grouped.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [models]);

  const companyTypes = useMemo(() => {
    return Array.from(new Set(allCompanies.map((company) => company.type))).filter(Boolean);
  }, [allCompanies]);

  const companies = useMemo(() => {
    return allCompanies.filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(search.toLowerCase()) ||
        company.description.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || company.type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [allCompanies, search, filter]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07080f] px-5 py-8 text-white sm:px-10">
      {/* Ambient Aurora Glow Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute -right-48 top-1/4 h-[600px] w-[600px] rounded-full bg-cyan-600/10 blur-[150px]" />
        <div className="absolute bottom-10 left-1/3 h-[500px] w-[500px] rounded-full bg-fuchsia-600/08 blur-[160px]" />
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
            <Building2 size={14} className="text-violet-400" />
            AI Ecosystem Directory
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            AI Labs &{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              Publishers
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Discover pioneering frontier research laboratories, foundation model creators, and open-weights publishers across the AI landscape.
          </p>
        </div>

        {/* Stats Row */}
        <div className="mb-10 grid gap-5 sm:grid-cols-3">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Organizations
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
                <Building2 size={18} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-white">
              {loading ? "..." : allCompanies.length}
            </p>
            <p className="mt-1 text-xs text-slate-400">Indexed labs and providers</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Models
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
                <BrainCircuit size={18} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-white">
              {loading ? "..." : models.length}
            </p>
            <p className="mt-1 text-xs text-slate-400">Foundation architectures</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6 backdrop-blur-xl transition-all duration-300 hover:border-fuchsia-500/40 hover:shadow-[0_0_30px_rgba(217,70,239,0.15)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Publisher Categories
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-fuchsia-500/15 text-fuchsia-400">
                <Layers3 size={18} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-white">
              {loading ? "..." : companyTypes.length}
            </p>
            <p className="mt-1 text-xs text-slate-400">Classifications across industry</p>
          </div>
        </div>

        {/* Directory Controls */}
        <section className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Explore Organizations
              </h2>
              <p className="text-xs text-slate-400">
                Filter by research focus or search by company name.
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
                placeholder="Search AI companies..."
                className="w-full rounded-xl border border-white/[0.09] bg-slate-900/60 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 backdrop-blur-xl outline-none transition-all duration-200 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {["All", ...companyTypes].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                  filter === item
                    ? "border border-violet-500/50 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                    : "border border-white/[0.08] bg-slate-900/50 text-slate-400 hover:border-white/[0.15] hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-slate-900/40 p-16 text-center backdrop-blur-xl">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
              <p className="mt-4 text-sm font-medium text-slate-300">
                Loading organizations from database...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-300 backdrop-blur-xl">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Companies Grid */}
          {!loading && !error && (
            <div className="grid gap-6 md:grid-cols-2">
              {companies.map((company) => (
                <article
                  key={company.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/45 p-6 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/40 hover:shadow-[0_0_35px_rgba(139,92,246,0.12)]"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-violet-300 shadow-inner">
                        <Building2 size={24} />
                      </div>

                      <span className="inline-flex items-center rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold text-violet-300">
                        {company.type}
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-bold text-white transition-colors group-hover:text-violet-300">
                      {company.name}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {company.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-white/[0.08] pt-5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-400">
                        Deployed Catalog Models ({company.models.length})
                      </span>
                      <span className="flex items-center gap-1 font-medium text-violet-400">
                        View Models <ChevronRight size={14} />
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {company.models.map((model) => (
                        <Link
                          key={model.slug}
                          href={`/models/${model.slug}`}
                          className="group/tag inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 transition-all duration-200 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white"
                        >
                          {model.name}
                          <ExternalLink size={10} className="text-slate-500 transition-colors group-hover/tag:text-violet-300" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && companies.length === 0 && (
            <div className="rounded-2xl border border-white/[0.08] bg-slate-900/40 p-12 text-center backdrop-blur-xl">
              <Building2 className="mx-auto mb-3 text-slate-500" size={36} />
              <p className="text-base font-bold text-white">No companies found</p>
              <p className="mt-1 text-xs text-slate-400">
                No organization matched your search &quot;{search}&quot;.
              </p>
            </div>
          )}
        </section>

        <footer className="mt-12 border-t border-white/[0.08] py-6 text-center text-xs text-slate-500">
          © 2026 OneAtlas. AI Labs, Foundations & Unified Ecosystem.
        </footer>
      </div>
    </main>
  );
}
