"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  LayoutDashboard,
  Compass,
  Trophy,
  Building2,
  GitCompareArrows,
  Settings,
  Bell,
  ChevronDown,
  ArrowUpRight,
  Zap,
  BrainCircuit,
  Eye,
  Menu,
  X,
} from "lucide-react";

const companyColors: Record<string, string> = {
  OpenAI: "bg-emerald-500",
  Anthropic: "bg-orange-400",
  Google: "bg-blue-500",
  DeepSeek: "bg-cyan-500",
  Meta: "bg-indigo-500",
};

const categories = ["All Models", "Reasoning", "Chat", "Multimodal"];

type APIModel = {
  id: string;
  slug: string;
  name: string;
  category: string;
  contextWindow: string;
  inputPrice: number;
  outputPrice: number;
  company: {
    name: string;
  };
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Models");
  const [selected, setSelected] = useState<string[]>([]);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [models, setModels] = useState<APIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch("/api/models");

        if (!response.ok) {
          throw new Error("Failed to fetch models");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Unable to load models");
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

  const filteredModels = useMemo(() => {
    return models.filter((model) => {
      const matchesSearch =
        model.name.toLowerCase().includes(search.toLowerCase()) ||
        model.company.name.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All Models" || model.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [models, search, category]);

  const selectedModels = models.filter((model) =>
    selected.includes(model.name)
  );

  function toggleCompare(name: string) {
    setSelected((previous) =>
      previous.includes(name)
        ? previous.filter((item) => item !== name)
        : previous.length < 3
          ? [...previous, name]
          : previous
    );
  }

  return (
    <main className="min-h-screen bg-[#08090d] text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-white/[0.07] bg-[#0c0d12] p-6 transition-transform lg:static lg:translate-x-0 ${
            mobileMenu ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
                <BrainCircuit size={23} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  OneAtlas<span className="text-violet-400">.</span>
                </h1>
                <p className="text-[10px] tracking-[0.2em] text-zinc-500">
                  AI INTELLIGENCE
                </p>
              </div>
            </div>
            <button
              onClick={() => setMobileMenu(false)}
              className="lg:hidden"
              aria-label="Close menu"
            >
              <X />
            </button>
          </div>

          <p className="mb-4 text-[10px] font-semibold tracking-[0.2em] text-zinc-500">
            WORKSPACE
          </p>

          <nav className="space-y-2">
            {[
              { name: "Overview", icon: LayoutDashboard, active: true },
              { name: "Discover Models", icon: Compass },
              { name: "Compare Models", icon: GitCompareArrows },
              { name: "Rankings", icon: Trophy },
              { name: "AI Companies", icon: Building2 },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  if (item.name === "Discover Models") {
                    document.getElementById("models")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }

                  if (item.name === "Rankings") {
                    window.location.href = "/rankings";
                  }

                  if (item.name === "AI Companies") {
                    window.location.href = "/companies";
                  }

                  setMobileMenu(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  item.active
                    ? "bg-violet-600/15 text-violet-300"
                    : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </button>
            ))}
          </nav>

          <div className="mt-12">
            <p className="mb-4 text-[10px] font-semibold tracking-[0.2em] text-zinc-500">
              PREFERENCES
            </p>
            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 hover:bg-white/[0.05]">
              <Settings size={18} />
              Settings
            </button>
          </div>

          <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-violet-500/20 bg-violet-500/[0.07] p-4">
            <Zap size={20} className="mb-3 text-violet-400" />
            <p className="text-sm font-semibold">Explore AI models</p>
            <p className="mt-1 text-xs leading-5 text-zinc-400">
              Discover the right intelligence for your next project.
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <section className="min-w-0 flex-1">
          {/* Header */}
          <header className="flex h-[76px] items-center justify-between border-b border-white/[0.07] px-5 sm:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenu(true)}
                className="lg:hidden"
                aria-label="Open menu"
              >
                <Menu />
              </button>
              <span className="text-sm text-zinc-500">
                Workspace <span className="mx-2">/</span>
                <span className="text-white">Overview</span>
              </span>
            </div>

            <div className="flex items-center gap-5">
              <button
                aria-label="Notifications"
                className="text-zinc-400 hover:text-white"
              >
                <Bell size={19} />
              </button>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600 text-sm font-bold">
                  O
                </div>
                <span className="hidden text-sm sm:block">Developer</span>
                <ChevronDown size={15} className="text-zinc-500" />
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] space-y-9 p-5 sm:p-8">
            {/* Welcome */}
            <section>
              <div className="mb-3 flex items-center gap-2 text-xs text-violet-300">
                <span className="h-2 w-2 rounded-full bg-violet-400" />
                YOUR AI INTELLIGENCE HUB
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Discover the future of{" "}
                <span className="text-violet-400">AI.</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
                Explore, compare and evaluate the world&apos;s leading AI
                models. Find the perfect intelligence for your next big idea.
              </p>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  label: "AI Models",
                  value: models.length.toString(),
                  change: "Across multiple providers",
                  icon: BrainCircuit,
                },
                {
                  label: "AI Companies",
                  value: new Set(models.map((m) => m.company.name)).size.toString(),
                  change: "Leading research labs",
                  icon: Building2,
                },
                {
                  label: "Model Categories",
                  value: new Set(models.map((m) => m.category)).size.toString(),
                  change: "Explore different capabilities",
                  icon: Zap,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/[0.07] bg-[#101117] p-5"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <p className="text-sm text-zinc-400">{stat.label}</p>
                    <stat.icon size={19} className="text-violet-400" />
                  </div>
                  <h3 className="text-3xl font-bold">{stat.value}</h3>
                  <p className="mt-2 text-xs text-zinc-500">{stat.change}</p>
                </div>
              ))}
            </section>

            {/* Discovery */}
            <section id="models" className="scroll-mt-8 space-y-5">
              <div>
                <h2 className="text-xl font-bold">Explore AI Models</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Discover models from leading AI providers.
                </p>
              </div>

              {/* Search */}
              <div className="relative">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search models or companies..."
                  className="w-full rounded-xl border border-white/[0.09] bg-[#101117] py-4 pl-12 pr-4 text-sm outline-none transition focus:border-violet-500"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`rounded-lg px-4 py-2 text-xs font-medium transition ${
                      category === item
                        ? "bg-violet-600 text-white"
                        : "border border-white/[0.08] bg-[#101117] text-zinc-400 hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Model Table */}
              <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101117]">
                <div className="flex items-center justify-between border-b border-white/[0.07] p-5">
                  <div>
                    <h3 className="font-semibold">Available Models</h3>
                    <p className="mt-1 text-xs text-zinc-500">
                      {filteredModels.length} models found
                    </p>
                  </div>
                  <button className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-400">
                    <Eye size={15} />
                    Specifications
                  </button>
                </div>

                <div className="overflow-x-auto">
                  {loading && (
                    <p className="p-8 text-center text-sm text-zinc-400">
                      Loading AI models from database...
                    </p>
                  )}

                  {error && (
                    <p className="p-8 text-center text-sm text-red-400">
                      {error}
                    </p>
                  )}

                  {!loading && !error && (
                    <table className="w-full min-w-[650px] text-left">
                      <thead className="bg-white/[0.02] text-[11px] uppercase tracking-wider text-zinc-500">
                        <tr>
                          <th className="px-5 py-4 font-medium">Model</th>
                          <th className="px-5 py-4 font-medium">Category</th>
                          <th className="px-5 py-4 font-medium">Context</th>
                          <th className="px-5 py-4 font-medium">Input / 1M</th>
                          <th className="px-5 py-4 font-medium">Output / 1M</th>
                          <th className="px-5 py-4 font-medium">Compare</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.06]">
                        {filteredModels.map((model) => (
                          <tr
                            key={model.name}
                            className="transition hover:bg-white/[0.025]"
                          >
                            <td className="px-5 py-5">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`h-2.5 w-2.5 rounded-full ${companyColors[model.company.name] || "bg-violet-500"}`}
                                />
                                <div>
                                  <Link
                                    href={`/models/${model.slug}`}
                                    className="text-sm font-semibold hover:text-violet-400 transition"
                                  >
                                    {model.name}
                                  </Link>
                                  <p className="mt-1 text-xs text-zinc-500">
                                    {model.company.name}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-5 text-xs text-zinc-400">
                              {model.category}
                            </td>
                            <td className="px-5 py-5 text-xs text-zinc-300">
                              {model.contextWindow}
                            </td>
                            <td className="px-5 py-5 text-xs text-zinc-300">
                              ${model.inputPrice.toFixed(2)}
                            </td>
                            <td className="px-5 py-5 text-xs text-zinc-300">
                              ${model.outputPrice.toFixed(2)}
                            </td>
                            <td className="px-5 py-5">
                              <button
                                onClick={() => toggleCompare(model.name)}
                                className={`rounded-lg px-3 py-2 text-xs transition ${
                                  selected.includes(model.name)
                                    ? "bg-violet-600 text-white"
                                    : "border border-white/10 text-zinc-400 hover:border-violet-500 hover:text-white"
                                }`}
                              >
                                {selected.includes(model.name)
                                  ? "Selected"
                                  : "Compare"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {filteredModels.length === 0 && (
                    <p className="p-10 text-center text-sm text-zinc-500">
                      No models found. Try another search.
                    </p>
                  )}
                </div>
              </div>

              {/* Compare selection */}
              {selected.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-violet-500/30 bg-violet-500/[0.08] p-4">
                  <div>
                    <p className="text-sm font-semibold">
                      {selected.length} models selected
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {selected.join(" • ")}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelected([])}
                    className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold hover:bg-violet-500"
                  >
                    Clear selection
                  </button>
                </div>
              )}

              {/* Model Comparison */}
              {selectedModels.length >= 2 && (
                <section className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold">
                      Model Comparison
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                      Compare selected AI models side by side.
                    </p>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#101117]">
                    <table className="w-full min-w-[600px] text-left">
                      <thead>
                        <tr className="border-b border-white/[0.08]">
                          <th className="p-5 text-xs text-zinc-500">
                            SPECIFICATIONS
                          </th>
                          {selectedModels.map((model) => (
                            <th key={model.name} className="p-5">
                              <p className="text-sm font-semibold">
                                {model.name}
                              </p>
                              <p className="mt-1 text-xs text-zinc-500">
                                {model.company.name}
                              </p>
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-white/[0.06]">
                        {[
                          {
                            label: "Category",
                            value: (m: APIModel) => m.category,
                          },
                          {
                            label: "Context Window",
                            value: (m: APIModel) => m.contextWindow,
                          },
                          {
                            label: "Input Price / 1M tokens",
                            value: (m: APIModel) => `$${m.inputPrice.toFixed(2)}`,
                          },
                          {
                            label: "Output Price / 1M tokens",
                            value: (m: APIModel) => `$${m.outputPrice.toFixed(2)}`,
                          },
                        ].map((spec) => (
                          <tr key={spec.label}>
                            <td className="p-5 text-xs text-zinc-400">
                              {spec.label}
                            </td>
                            {selectedModels.map((model) => (
                              <td
                                key={model.name}
                                className="p-5 text-sm font-medium text-white"
                              >
                                {spec.value(model)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            </section>

            {/* Footer */}
            <footer className="flex flex-col justify-between gap-3 border-t border-white/[0.07] py-6 text-xs text-zinc-500 sm:flex-row">
              <p>© 2026 OneAtlas. AI intelligence, unified.</p>
              <p>Built for developers, by developers.</p>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
