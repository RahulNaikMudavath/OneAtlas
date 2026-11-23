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
  Zap,
  BrainCircuit,
  Eye,
  Menu,
  X,
  Network,
  Code2,
  Sparkles,
  SlidersHorizontal,
  Layers,
  Activity,
  Check,
  ExternalLink,
} from "lucide-react";

const companyColors: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  OpenAI: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
    border: "border-emerald-500/20",
  },
  Anthropic: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
    border: "border-amber-500/20",
  },
  Google: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    dot: "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]",
    border: "border-cyan-500/20",
  },
  DeepSeek: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    dot: "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]",
    border: "border-blue-500/20",
  },
  Meta: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    dot: "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]",
    border: "border-indigo-500/20",
  },
  Mistral: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    dot: "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)]",
    border: "border-orange-500/20",
  },
  Qwen: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    dot: "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]",
    border: "border-purple-500/20",
  },
  Cohere: {
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    dot: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]",
    border: "border-rose-500/20",
  },
};

function getCompanyStyle(name: string) {
  return (
    companyColors[name] || {
      bg: "bg-violet-500/10",
      text: "text-violet-400",
      dot: "bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]",
      border: "border-violet-500/20",
    }
  );
}

const categories = [
  { name: "All Models", icon: Sparkles },
  { name: "Reasoning", icon: BrainCircuit },
  { name: "Multimodal", icon: Eye },
  { name: "Chat", icon: Zap },
  { name: "Tool Use", icon: Code2 },
];

type APIModel = {
  id: string;
  slug: string;
  name: string;
  category: string;
  contextWindow: string;
  inputPrice: number;
  outputPrice: number;
  modalities: string[];
  capabilities: string[];
  releaseDate?: string | null;
  sourceCreatedAt?: string | null;
  company: {
    name: string;
  };
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Models");
  const [selected, setSelected] = useState<string[]>([]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [providerFilter, setProviderFilter] = useState("All");
  const [modalityFilter, setModalityFilter] = useState("All");
  const [capabilityFilter, setCapabilityFilter] = useState("All");
  const [contextFilter, setContextFilter] = useState("All");
  const [maxInputPrice, setMaxInputPrice] = useState("");
  const [maxOutputPrice, setMaxOutputPrice] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);

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
    const contextValue = (value: string) => {
      const number = parseFloat(value);
      return value.toUpperCase().includes("M")
        ? number * 1000
        : number;
    };

    const filtered = models.filter((model) => {
      const matchesSearch =
        model.name.toLowerCase().includes(search.toLowerCase()) ||
        model.company.name.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All Models" || model.category === category;

      const matchesProvider =
        providerFilter === "All" ||
        model.company.name === providerFilter;

      const matchesModality =
        modalityFilter === "All" ||
        model.modalities?.includes(modalityFilter);

      const matchesCapability =
        capabilityFilter === "All" ||
        model.capabilities?.some((cap) =>
          cap.toLowerCase().includes(capabilityFilter.toLowerCase())
        );

      const matchesContext =
        contextFilter === "All" ||
        contextValue(model.contextWindow) >= contextValue(contextFilter);

      const matchesInputPrice =
        maxInputPrice === "" ||
        model.inputPrice <= Number(maxInputPrice);

      const matchesOutputPrice =
        maxOutputPrice === "" ||
        model.outputPrice <= Number(maxOutputPrice);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesProvider &&
        matchesModality &&
        matchesCapability &&
        matchesContext &&
        matchesInputPrice &&
        matchesOutputPrice
      );
    });

    return filtered.sort((a, b) => {
      if (sortBy === "inputPrice") return a.inputPrice - b.inputPrice;
      if (sortBy === "outputPrice") return a.outputPrice - b.outputPrice;
      if (sortBy === "context") {
        return contextValue(b.contextWindow) - contextValue(a.contextWindow);
      }
      if (sortBy === "releaseDate") {
        const timeA = a.releaseDate
          ? new Date(a.releaseDate).getTime()
          : null;

        const timeB = b.releaseDate
          ? new Date(b.releaseDate).getTime()
          : null;

        if (timeA === null && timeB === null) return 0;
        if (timeA === null) return 1;
        if (timeB === null) return -1;

        return timeB - timeA;
      }
      return a.name.localeCompare(b.name);
    });
  }, [
    models,
    search,
    category,
    providerFilter,
    modalityFilter,
    capabilityFilter,
    contextFilter,
    maxInputPrice,
    maxOutputPrice,
    sortBy,
  ]);

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

  const activeFilterCount = [
    providerFilter !== "All",
    modalityFilter !== "All",
    capabilityFilter !== "All",
    contextFilter !== "All",
    maxInputPrice !== "",
    maxOutputPrice !== "",
  ].filter(Boolean).length;

  return (
    <main className="relative min-h-screen bg-[#07080f] text-slate-100 overflow-x-hidden">
      {/* Dynamic Ambient Background Lights */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[250px] left-1/2 h-[550px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-violet-600/20 via-fuchsia-600/10 to-transparent blur-[140px]" />
        <div className="absolute top-[350px] -left-[150px] h-[500px] w-[500px] rounded-full bg-cyan-600/10 blur-[130px]" />
        <div className="absolute top-[850px] -right-[150px] h-[550px] w-[550px] rounded-full bg-fuchsia-600/10 blur-[140px]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-white/[0.08] bg-[#090b14]/90 p-6 backdrop-blur-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${
            mobileMenu ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Logo & Brand */}
          <div className="mb-10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-500 shadow-[0_0_24px_rgba(139,92,246,0.45)] transition-transform duration-300 group-hover:scale-105">
                <BrainCircuit size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white flex items-center">
                  OneAtlas
                  <span className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400 shadow-[0_0_8px_rgba(167,139,250,1)]" />
                </h1>
                <p className="text-[10px] font-semibold tracking-[0.25em] text-violet-400/90 uppercase">
                  AI Intelligence
                </p>
              </div>
            </Link>

            <button
              onClick={() => setMobileMenu(false)}
              className="rounded-xl border border-white/10 p-2 text-zinc-400 hover:bg-white/5 hover:text-white lg:hidden"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="mb-4 flex items-center justify-between px-1">
            <p className="text-[10px] font-bold tracking-[0.22em] text-zinc-500 uppercase">
              Platform Modules
            </p>
            <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-300 border border-violet-500/20">
              v1.0
            </span>
          </div>

          <nav className="space-y-1.5">
            {[
              { name: "Overview", icon: LayoutDashboard, href: "/", active: true },
              { name: "Discover Models", icon: Compass, action: "scroll" },
              { name: "Side-by-Side Compare", icon: GitCompareArrows, href: "/compare" },
              { name: "Leaderboards & Rankings", icon: Trophy, href: "/rankings" },
              { name: "AI Research Labs", icon: Building2, href: "/companies" },
              { name: "Provider Intelligence", icon: Network, href: "/providers" },
              { name: "Smart Model Finder", icon: Sparkles, href: "/finder", badge: "Smart" },
              { name: "Developer Playground", icon: Code2, href: "/playground" },
            ].map((item) => {
              const isActive = item.active;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    if (item.action === "scroll") {
                      document.getElementById("models")?.scrollIntoView({
                        behavior: "smooth",
                      });
                    } else if (item.href) {
                      window.location.href = item.href;
                    }
                    setMobileMenu(false);
                  }}
                  className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-violet-600/25 via-violet-600/15 to-transparent text-white border-l-[3px] border-violet-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
                      : "text-zinc-400 hover:bg-white/[0.04] hover:text-slate-100 hover:translate-x-0.5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      size={18}
                      className={
                        isActive
                          ? "text-violet-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.6)]"
                          : "text-zinc-500 group-hover:text-violet-300 transition-colors"
                      }
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className="rounded-full bg-gradient-to-r from-fuchsia-500/20 to-violet-500/20 border border-fuchsia-500/30 px-2 py-0.5 text-[10px] font-semibold text-fuchsia-300 shadow-[0_0_10px_rgba(217,70,239,0.2)]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Banner Card */}
          <div className="mt-8 rounded-2xl border border-violet-500/20 bg-gradient-to-b from-violet-950/30 via-violet-900/10 to-transparent p-4.5 shadow-[0_4px_25px_rgba(139,92,246,0.08)]">
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-violet-600/30 text-violet-300 border border-violet-500/30">
              <Zap size={16} />
            </div>
            <p className="text-xs font-bold text-white">480+ Models Indexed</p>
            <p className="mt-1 text-[11px] leading-4 text-zinc-400">
              Live pricing, latency benchmarks, and verified provider specs updated daily.
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="min-w-0 flex-1">
          {/* Top Bar Header */}
          <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-white/[0.08] bg-[#07080f]/80 px-5 sm:px-8 backdrop-blur-xl">
            <div className="flex items-center gap-3.5">
              <button
                onClick={() => setMobileMenu(true)}
                className="rounded-xl border border-white/10 p-2 text-zinc-400 hover:bg-white/5 hover:text-white lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={19} />
              </button>

              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="text-zinc-500">Atlas</span>
                <span>/</span>
                <span className="font-semibold text-violet-300">Overview</span>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              {/* Pulse status beacon */}
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span>82 Providers Online</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-8 w-[1px] bg-white/[0.08] hidden sm:block" />
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-fuchsia-500 text-xs font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]">
                    OA
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-white leading-tight">OneAtlas Dev</p>
                    <p className="text-[10px] text-zinc-500">Free Tier</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] space-y-8 p-4 sm:p-6">
            {/* HERO BANNER */}
            <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-violet-950/20 via-[#0d0f1b]/90 to-[#080912] p-6 sm:p-9 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
              {/* Radial backdrop inside hero */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-500/15 blur-3xl" />
              <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-gradient-to-tr from-cyan-600/20 to-blue-500/10 blur-3xl" />

              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1 text-xs font-semibold text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.2)] backdrop-blur-md">
                  <Sparkles size={13} className="text-violet-300" />
                  <span>THE UNIFIED AI MODEL DIRECTORY & BENCHMARK ATLAS</span>
                </div>

                <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl text-white leading-[1.1]">
                  Discover Every Model.{" "}
                  <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(192,132,252,0.3)]">
                    Across Every Provider.
                  </span>
                </h1>

                <p className="text-sm sm:text-base leading-relaxed text-zinc-300/90 max-w-2xl">
                  Compare real-time pricing per 1M tokens, latency benchmarks, context windows,
                  and multimodal capabilities across 480+ frontier and open-weights models.
                </p>

                {/* Quick Action Badges */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/compare"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] transition hover:brightness-110 hover:shadow-[0_0_25px_rgba(139,92,246,0.6)]"
                  >
                    <GitCompareArrows size={14} />
                    Compare Models
                  </Link>

                  <Link
                    href="/rankings"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-xs font-bold text-slate-200 backdrop-blur-md transition hover:bg-white/[0.08] hover:text-white hover:border-violet-500/40"
                  >
                    <Trophy size={14} className="text-amber-400" />
                    Benchmark Rankings
                  </Link>

                  <Link
                    href="/finder"
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-2.5 text-xs font-bold text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] transition hover:bg-cyan-500/20"
                  >
                    <Sparkles size={14} />
                    Smart Model Finder
                  </Link>
                </div>
              </div>
            </section>

            {/* THREE HIGH-TECH STATS CARDS */}
            <section className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {[
                {
                  label: "Indexed AI Models",
                  value: models.length.toString(),
                  subtext: "Frontier, reasoning & open-weight models",
                  badge: "Live Database",
                  gradient: "from-violet-500/15 via-[#0e101b] to-[#080912]",
                  border: "border-violet-500/25 hover:border-violet-400/50",
                  icon: BrainCircuit,
                  iconColor: "text-violet-400",
                  iconBg: "bg-violet-500/10 border-violet-500/20",
                },
                {
                  label: "AI Research Labs",
                  value: new Set(models.map((m) => m.company.name)).size.toString(),
                  subtext: "Global AI creators and model publishers",
                  badge: "Publishers",
                  gradient: "from-cyan-500/15 via-[#0e101b] to-[#080912]",
                  border: "border-cyan-500/25 hover:border-cyan-400/50",
                  icon: Building2,
                  iconColor: "text-cyan-400",
                  iconBg: "bg-cyan-500/10 border-cyan-500/20",
                },
                {
                  label: "Active Categories",
                  value: new Set(models.map((m) => m.category)).size.toString(),
                  subtext: "Reasoning, Multimodal, Tool Use & Chat",
                  badge: "Architectures",
                  gradient: "from-fuchsia-500/15 via-[#0e101b] to-[#080912]",
                  border: "border-fuchsia-500/25 hover:border-fuchsia-400/50",
                  icon: Zap,
                  iconColor: "text-fuchsia-400",
                  iconBg: "bg-fuchsia-500/10 border-fuchsia-500/20",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`group relative overflow-hidden rounded-2xl border ${stat.border} bg-gradient-to-b ${stat.gradient} p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-400">
                      {stat.badge}
                    </span>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${stat.iconBg} ${stat.iconColor} transition-transform group-hover:scale-110`}>
                      <stat.icon size={20} />
                    </div>
                  </div>

                  <p className="text-xs font-medium text-zinc-400">{stat.label}</p>
                  <h3 className="mt-1 text-4xl font-black text-white tracking-tight">
                    {loading ? "..." : stat.value}
                  </h3>
                  <p className="mt-2 text-xs text-zinc-400/80">{stat.subtext}</p>
                </div>
              ))}
            </section>

            {/* MODEL EXPLORATION & FILTERING ENGINE */}
            <section id="models" className="scroll-mt-24 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-violet-400 uppercase tracking-widest mb-1.5">
                    <Compass size={15} />
                    Model Directory & Pricing
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Explore All AI Models
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                    Filter by publisher, capability, pricing limits, and modality.
                  </p>
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition ${
                    showFilters || activeFilterCount > 0
                      ? "border-violet-500/50 bg-violet-500/15 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                      : "border-white/10 bg-[#0e101a] text-zinc-300 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <SlidersHorizontal size={14} />
                  <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}</span>
                </button>
              </div>

              {/* SEARCH BAR & CATEGORY CHIPS */}
              <div className="space-y-4">
                <div className="relative group">
                  <Search
                    size={20}
                    className="absolute left-4.5 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-violet-400"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search over 480+ models (e.g. GPT-5.5, Claude Sonnet, Gemini Flash, DeepSeek)..."
                    className="w-full rounded-2xl border border-white/[0.1] bg-[#0c0e18]/80 py-4 pl-13 pr-5 text-sm text-white placeholder-zinc-500 outline-none backdrop-blur-xl transition focus:border-violet-500/80 focus:shadow-[0_0_25px_rgba(139,92,246,0.25)]"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-1 text-xs text-zinc-400 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* CATEGORIES BUTTONS */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {categories.map((item) => {
                    const isSelected = category === item.name;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.name}
                        onClick={() => setCategory(item.name)}
                        className={`group inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                          isSelected
                            ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 text-white shadow-[0_0_18px_rgba(139,92,246,0.35)]"
                            : "border border-white/[0.08] bg-[#0c0e18] text-zinc-400 hover:border-violet-500/30 hover:text-white"
                        }`}
                      >
                        <Icon size={14} className={isSelected ? "text-white" : "text-zinc-500 group-hover:text-violet-400"} />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* EXPANDABLE FILTER DRAWER */}
              {(showFilters || activeFilterCount > 0) && (
                <section className="rounded-2xl border border-white/[0.09] bg-[#0c0e18]/90 p-6 backdrop-blur-xl space-y-5 animate-in fade-in duration-200">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] pb-4">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal size={15} className="text-violet-400" />
                      <h3 className="text-sm font-bold text-white">Fine-Grain Facets</h3>
                    </div>

                    <button
                      onClick={() => {
                        setProviderFilter("All");
                        setModalityFilter("All");
                        setCapabilityFilter("All");
                        setContextFilter("All");
                        setMaxInputPrice("");
                        setMaxOutputPrice("");
                        setSortBy("name");
                      }}
                      className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition"
                    >
                      Reset All Filters
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-zinc-400">AI Publisher</label>
                      <select
                        value={providerFilter}
                        onChange={(e) => setProviderFilter(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#07080f] p-3 text-xs text-white outline-none focus:border-violet-500"
                      >
                        <option value="All">All Publishers</option>
                        {[...new Set(models.map((m) => m.company.name))].sort().map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-zinc-400">Supported Modality</label>
                      <select
                        value={modalityFilter}
                        onChange={(e) => setModalityFilter(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#07080f] p-3 text-xs text-white outline-none focus:border-violet-500"
                      >
                        <option value="All">All Modalities</option>
                        {[...new Set(models.flatMap((m) => m.modalities || []))].sort().map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-zinc-400">Capability</label>
                      <select
                        value={capabilityFilter}
                        onChange={(e) => setCapabilityFilter(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#07080f] p-3 text-xs text-white outline-none focus:border-violet-500"
                      >
                        <option value="All">All Capabilities</option>
                        {[...new Set(models.flatMap((m) => m.capabilities || []))].sort().map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-zinc-400">Context Window</label>
                      <select
                        value={contextFilter}
                        onChange={(e) => setContextFilter(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#07080f] p-3 text-xs text-white outline-none focus:border-violet-500"
                      >
                        <option value="All">Any Context Length</option>
                        <option value="128K">128K+ tokens</option>
                        <option value="200K">200K+ tokens</option>
                        <option value="400K">400K+ tokens</option>
                        <option value="1M">1M+ tokens</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-zinc-400">
                        Max Input Price ($ / 1M)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={maxInputPrice}
                        onChange={(e) => setMaxInputPrice(e.target.value)}
                        placeholder="No limit"
                        className="w-full rounded-xl border border-white/10 bg-[#07080f] p-3 text-xs text-white outline-none focus:border-violet-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-zinc-400">
                        Max Output Price ($ / 1M)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={maxOutputPrice}
                        onChange={(e) => setMaxOutputPrice(e.target.value)}
                        placeholder="No limit"
                        className="w-full rounded-xl border border-white/10 bg-[#07080f] p-3 text-xs text-white outline-none focus:border-violet-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-xs font-semibold text-zinc-400">Sort Model Catalog</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#07080f] p-3 text-xs text-white outline-none focus:border-violet-500"
                      >
                        <option value="name">Model Name (A–Z)</option>
                        <option value="releaseDate">Newest Release Date (when available)</option>
                        <option value="inputPrice">Lowest Input Price ($ / 1M tokens)</option>
                        <option value="outputPrice">Lowest Output Price ($ / 1M tokens)</option>
                        <option value="context">Largest Context Window</option>
                      </select>
                    </div>
                  </div>
                </section>
              )}

              {/* MODEL TABLE LISTING */}
              <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0b0d17]/85 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.45)]">
                <div className="flex flex-wrap items-center justify-between border-b border-white/[0.08] p-5 sm:p-6 bg-white/[0.015]">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      Available AI Models
                      <span className="rounded-full bg-violet-500/10 border border-violet-500/30 px-2.5 py-0.5 text-xs font-semibold text-violet-300">
                        {filteredModels.length}
                      </span>
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400">
                      Showing real specs from OpenRouter & verified labs.
                    </p>
                  </div>

                  {selected.length > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400">
                        {selected.length}/3 selected for compare
                      </span>
                      <Link
                        href="/compare"
                        className="rounded-xl bg-violet-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-violet-500 transition shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                      >
                        Open Comparison
                      </Link>
                    </div>
                  )}
                </div>

                <div className="overflow-x-auto">
                  {loading && (
                    <div className="p-16 text-center">
                      <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                      <p className="text-sm text-zinc-400">Loading live model catalogue...</p>
                    </div>
                  )}

                  {error && (
                    <p className="p-12 text-center text-sm text-red-400">
                      {error}
                    </p>
                  )}

                  {!loading && !error && (
                    <table className="w-full min-w-[750px] text-left">
                      <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        <tr>
                          <th className="px-6 py-4">Model & Publisher</th>
                          <th className="px-6 py-4">Architecture</th>
                          <th className="px-6 py-4">Context Length</th>
                          <th className="px-6 py-4">Input / 1M</th>
                          <th className="px-6 py-4">Output / 1M</th>
                          <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.05] text-xs">
                        {filteredModels.map((model) => {
                          const style = getCompanyStyle(model.company.name);
                          const isComparing = selected.includes(model.name);

                          return (
                            <tr
                              key={model.id || model.slug}
                              className="group transition-colors duration-150 hover:bg-white/[0.035]"
                            >
                              {/* Model Name & Company */}
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className={`h-2.5 w-2.5 rounded-full ${style.dot} shrink-0`} />
                                  <div>
                                    <Link
                                      href={`/models/${model.slug}`}
                                      className="font-bold text-slate-100 group-hover:text-violet-300 transition text-sm flex items-center gap-1.5"
                                    >
                                      <span>{model.name}</span>
                                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 text-violet-400 transition" />
                                    </Link>
                                    <div className="mt-1 flex items-center gap-2">
                                      <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold border ${style.bg} ${style.text} ${style.border}`}>
                                        {model.company.name}
                                      </span>
                                      {model.releaseDate && (
                                        <span className="text-[10px] text-zinc-500">
                                          {model.releaseDate.split("T")[0]}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Category & Modalities */}
                              <td className="px-6 py-4">
                                <span className="inline-block rounded-lg bg-white/[0.05] px-2.5 py-1 text-[11px] font-medium text-zinc-300 border border-white/[0.07]">
                                  {model.category}
                                </span>
                                {model.modalities && model.modalities.length > 0 && (
                                  <p className="mt-1 text-[10px] text-zinc-500">
                                    {model.modalities.slice(0, 3).join(", ")}
                                  </p>
                                )}
                              </td>

                              {/* Context Window */}
                              <td className="px-6 py-4 font-mono font-medium text-slate-200">
                                {model.contextWindow}
                              </td>

                              {/* Pricing Input */}
                              <td className="px-6 py-4">
                                <span className="font-mono font-semibold text-emerald-400">
                                  ${model.inputPrice.toFixed(2)}
                                </span>
                              </td>

                              {/* Pricing Output */}
                              <td className="px-6 py-4">
                                <span className="font-mono font-semibold text-violet-300">
                                  ${model.outputPrice.toFixed(2)}
                                </span>
                              </td>

                              {/* Compare Button */}
                              <td className="px-6 py-4 text-center">
                                <button
                                  onClick={() => toggleCompare(model.name)}
                                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                                    isComparing
                                      ? "bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-violet-400"
                                      : "border border-white/10 text-zinc-400 hover:border-violet-500/40 hover:text-white hover:bg-white/[0.04]"
                                  }`}
                                >
                                  {isComparing ? (
                                    <span className="flex items-center gap-1.5">
                                      <Check size={12} />
                                      Selected
                                    </span>
                                  ) : (
                                    "Compare"
                                  )}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}

                  {!loading && !error && filteredModels.length === 0 && (
                    <div className="p-16 text-center space-y-2">
                      <p className="text-sm font-semibold text-white">No models match your current filters</p>
                      <p className="text-xs text-zinc-500">Try broadening your search term or resetting price/context filters.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* FLOATING COMPARISON BAR (WHEN 1+ SELECTED) */}
              {selected.length > 0 && (
                <div className="sticky bottom-6 z-40 rounded-2xl border border-violet-500/40 bg-[#0e101b]/95 p-4 shadow-[0_8px_30px_rgba(139,92,246,0.35)] backdrop-blur-2xl flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-bottom duration-300">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
                      <GitCompareArrows size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {selected.length} / 3 Models Queued for Comparison
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        {selected.join("  vs  ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setSelected([])}
                      className="rounded-xl border border-white/10 px-3.5 py-1.5 text-xs font-semibold text-zinc-400 hover:bg-white/5 hover:text-white transition"
                    >
                      Clear
                    </button>
                    <Link
                      href="/compare"
                      className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:brightness-110 transition"
                    >
                      View Side-by-Side Comparison →
                    </Link>
                  </div>
                </div>
              )}
            </section>

            {/* PLATFORM FOOTER */}
            <footer className="border-t border-white/[0.08] py-8 text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-zinc-300">OneAtlas</span>
                <span>—</span>
                <span>The Unified AI Intelligence & Model Atlas</span>
              </div>
              <p>© 2026 OneAtlas. Built for AI developers & researchers.</p>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
