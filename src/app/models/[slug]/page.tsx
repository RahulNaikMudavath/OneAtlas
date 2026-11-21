import Link from "next/link";
import { notFound } from "next/navigation";
import { models } from "@/data/models";
import {
  ArrowLeft,
  BrainCircuit,
  Zap,
  Code2,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";

export function generateStaticParams() {
  return models.map((model) => ({
    slug: model.slug,
  }));
}

export default async function ModelDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = models.find((item) => item.slug === slug);

  if (!model) {
    notFound();
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

        <section className="rounded-3xl border border-white/[0.08] bg-[#101117] p-7 sm:p-10">

          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/20 text-violet-400">
            <BrainCircuit size={32} />
          </div>

          <p className="mb-3 text-sm font-medium text-violet-400">
            {model.company} / AI MODEL
          </p>

          <h1 className="text-3xl font-bold sm:text-5xl">
            {model.name}
          </h1>

          <p className="mt-5 max-w-2xl leading-7 text-zinc-400">
            {model.description}
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

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Provider", value: model.company, icon: BrainCircuit },
            { label: "Category", value: model.category, icon: Zap },
            { label: "Context Window", value: model.context, icon: Code2 },
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

        <section className="mt-8 rounded-2xl border border-white/[0.08] bg-[#101117] p-7">
          <h2 className="text-xl font-bold">Pricing Information</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Demonstration pricing per one million tokens.
          </p>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl bg-white/[0.03] p-5">
              <p className="text-sm text-zinc-400">Input Price</p>
              <p className="mt-3 text-3xl font-bold">{model.input}</p>
              <p className="mt-2 text-xs text-zinc-500">Per 1M tokens</p>
            </div>

            <div className="rounded-xl bg-white/[0.03] p-5">
              <p className="text-sm text-zinc-400">Output Price</p>
              <p className="mt-3 text-3xl font-bold">{model.output}</p>
              <p className="mt-2 text-xs text-zinc-500">Per 1M tokens</p>
            </div>
          </div>
        </section>

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

      </div>
    </main>
  );
}
