"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Languages, Eye, ArrowRight, Check, ShieldCheck, Search } from "lucide-react";
import { useCV } from "@/lib/store";
import { TEMPLATES, CATEGORIES } from "@/lib/templates";
import { t } from "@/lib/i18n";
import { sampleData } from "@/lib/sampleData";
import { LangToggle, useMounted } from "@/components/ui";
import { LogoFull } from "@/components/Logo";
import TemplateThumb from "@/components/TemplateThumb";

export default function Home() {
  const router = useRouter();
  const mounted = useMounted();
  const uiLang = useCV((s) => s.uiLang);
  const setUiLang = useCV((s) => s.setUiLang);
  const cvLang = useCV((s) => s.cvLang);
  const setTemplate = useCV((s) => s.setTemplate);
  const selected = useCV((s) => s.templateId);
  const tr = t(uiLang);

  const [previewLang] = useState<typeof cvLang>(cvLang);
  const demo = useMemo(() => sampleData(previewLang), [previewLang]);

  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEMPLATES.filter(
      (tpl) =>
        (category === "all" || tpl.category === category) &&
        (q === "" || tpl.name.toLowerCase().includes(q) || tpl.category.toLowerCase().includes(q))
    );
  }, [category, query]);

  const choose = (id: string) => {
    setTemplate(id);
    router.push("/editor");
  };

  if (!mounted) {
    return (
      <div className="grid min-h-screen place-items-center text-ink-300">
        <div className="animate-pulse text-sm">CV Dock…</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-cream-200 bg-cream-50/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <LogoFull size={34} />
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-ink-400 sm:inline">{tr.language}</span>
            <LangToggle value={uiLang} onChange={setUiLang} />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-brand-200/50 blur-3xl" />
          <div className="absolute right-10 top-10 h-64 w-64 rounded-full bg-cream-300/50 blur-3xl" />
        </div>
        <div className="mx-auto max-w-6xl px-5 py-16 text-center sm:py-20">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            <ShieldCheck size={14} /> {tr.yourData}
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            {tr.tagline}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">
            {tr.templatesSubtitle}
          </p>
          <div className="mt-7 flex items-center justify-center gap-3">
            <a
              href="#templates"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
            >
              {tr.heroCta} <ArrowRight size={16} />
            </a>
            <button
              onClick={() => router.push("/editor")}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {tr.startEditing}
            </button>
          </div>

          {/* Feature row */}
          <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              { icon: <FileText size={20} />, title: tr.feature1Title, desc: tr.feature1Desc },
              { icon: <Languages size={20} />, title: tr.feature2Title, desc: tr.feature2Desc },
              { icon: <Eye size={20} />, title: tr.feature3Title, desc: tr.feature3Desc },
            ].map((f, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-soft"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  {f.icon}
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-800">{f.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="mx-auto max-w-6xl px-5 pb-24">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            {TEMPLATES.length} {tr.templatesTitle}
          </h2>
          <p className="mt-2 text-sm text-slate-500">{tr.templatesSubtitle}</p>
        </div>

        {/* Filter bar */}
        <div className="mb-7 flex flex-col gap-3">
          <div className="relative mx-auto w-full max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tr.searchTemplate}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setCategory("all")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                category === "all"
                  ? "bg-brand-600 text-white shadow-soft"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tr.allCategories}
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  category === cat
                    ? "bg-brand-600 text-white shadow-soft"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400">
            {filtered.length} {tr.templateCount}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tpl) => {
            const isSel = selected === tpl.id;
            return (
              <div
                key={tpl.id}
                className={`group overflow-hidden rounded-2xl border bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-page ${
                  isSel ? "border-brand-400 ring-2 ring-brand-200" : "border-slate-200"
                }`}
              >
                <div className="relative border-b border-slate-100 bg-slate-50">
                  <TemplateThumb tpl={tpl} data={demo} lang={previewLang} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/0 to-transparent opacity-0 transition group-hover:opacity-100" />
                </div>
                <div className="flex items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-4 w-4 rounded-full ring-2 ring-white shadow"
                      style={{ background: tpl.accent }}
                    />
                    <span className="text-sm font-semibold text-slate-800">{tpl.name}</span>
                    {isSel && <Check size={15} className="text-brand-600" />}
                  </div>
                  <button
                    onClick={() => choose(tpl.id)}
                    className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700"
                  >
                    {tr.useTemplate}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-cream-200 bg-cream-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 text-xs text-ink-400">
          <span>© {new Date().getFullYear()} CV Dock</span>
          <span>{tr.builtWith}</span>
        </div>
      </footer>
    </main>
  );
}
