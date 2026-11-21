"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Search,
  BrainCircuit,
  ExternalLink,
  ChevronRight,
  Layers3,
} from "lucide-react";
import { models } from "@/data/models";

const companyInfo: Record<string, { description: string; type: string }> = {
  OpenAI: {
    description: "AI research and deployment company developing advanced AI models and tools.",
    type: "AI Research Lab",
  },
  Anthropic: {
    description: "AI safety and research company developing reliable and capable AI systems.",
    type: "AI Research Lab",
  },
  Google: {
    description: "Technology company developing AI models, research and multimodal systems.",
    type: "Technology Company",
  },
  DeepSeek: {
    description: "AI research company focused on language models and technical capabilities.",
    type: "AI Research Lab",
  },
  Meta: {
    description: "Technology company developing open-weight AI models and research.",
    type: "Technology Company",
  },
};

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const companies = useMemo(() => {
    const grouped = Object.keys(companyInfo).map((name) => ({
      name,
      ...companyInfo[name],
      models: models.filter((model) => model.company === name),
    }));

    return grouped.filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(search.toLowerCase()) ||
        company.description.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || company.type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

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
            AI ECOSYSTEM DIRECTORY
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            AI Labs & <span className="text-violet-400">Providers</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Discover leading AI companies, explore their research
            and find the models they develop.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-5">
            <Building2 className="mb-4 text-violet-400" size={23} />
            <p className="text-sm text-zinc-400">Companies listed</p>
            <h2 className="mt-2 text-3xl font-bold">{companies.length}</h2>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-5">
            <BrainCircuit className="mb-4 text-violet-400" size={23} />
            <p className="text-sm text-zinc-400">Models in catalogue</p>
            <h2 className="mt-2 text-3xl font-bold">{models.length}</h2>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-5">
            <Layers3 className="mb-4 text-violet-400" size={23} />
            <p className="text-sm text-zinc-400">Company categories</p>
            <h2 className="mt-2 text-3xl font-bold">02</h2>
          </div>
        </div>

        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-bold">Explore Companies</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Browse AI research labs and technology providers.
            </p>
          </div>

          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search AI companies..."
              className="w-full rounded-xl border border-white/[0.09] bg-[#101117] py-4 pl-12 pr-4 text-sm outline-none focus:border-violet-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["All", "AI Research Lab", "Technology Company"].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-lg px-4 py-2 text-xs transition ${
                  filter === item
                    ? "bg-violet-600 text-white"
                    : "border border-white/10 bg-[#101117] text-zinc-400 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {companies.map((company) => (
              <article
                key={company.name}
                className="rounded-2xl border border-white/[0.08] bg-[#101117] p-6 transition hover:border-violet-500/40"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <Building2 size={24} />
                  </div>
                  <span className="rounded-lg border border-white/10 px-3 py-1.5 text-[10px] text-zinc-400">
                    {company.type}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  {company.name}
                </h3>

                <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-400">
                  {company.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-5">
                  <div>
                    <p className="text-xs text-zinc-500">Listed models</p>
                    <p className="mt-1 font-semibold">
                      {company.models.length}
                    </p>
                  </div>

                  <span className="flex items-center gap-1 text-xs text-violet-400">
                    Model catalogue
                    <ChevronRight size={15} />
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {company.models.map((model) => (
                    <Link
                      key={model.slug}
                      href={`/models/${model.slug}`}
                      className="rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-xs text-zinc-300 hover:border-violet-500 hover:text-violet-300"
                    >
                      {model.name}
                      <ExternalLink size={11} className="ml-2 inline" />
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {companies.length === 0 && (
            <p className="rounded-xl border border-white/10 p-8 text-center text-sm text-zinc-500">
              No companies found.
            </p>
          )}
        </section>

        <footer className="mt-12 border-t border-white/[0.07] py-6 text-xs text-zinc-500">
          © 2026 OneAtlas. AI intelligence, unified.
        </footer>
      </div>
    </main>
  );
}
