"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, Camera, Check } from "lucide-react";
import { useCV } from "@/lib/store";
import { TEMPLATES, CATEGORIES } from "@/lib/templates";
import { t } from "@/lib/i18n";
import { sampleData } from "@/lib/sampleData";
import { LangToggle, useMounted } from "@/components/ui";
import { LogoFull } from "@/components/Logo";
import TemplateThumb from "@/components/TemplateThumb";

export default function TemplatesPage() {
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
  const [photoOnly, setPhotoOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEMPLATES.filter(
      (tpl) =>
        (category === "all" || tpl.category === category) &&
        (!photoOnly || tpl.showPhoto) &&
        (q === "" ||
          tpl.name.toLowerCase().includes(q) ||
          tpl.category.toLowerCase().includes(q))
    );
  }, [category, query, photoOnly]);

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
          <div className="flex items-center gap-3">
            <Link
              href="/"
              aria-label="Ana sayfa"
              className="grid h-8 w-8 place-items-center rounded-lg text-ink-500 transition hover:bg-brand-50 hover:text-brand-700"
            >
              <ArrowLeft size={18} />
            </Link>
            <Link href="/" aria-label="CV Dock" className="transition hover:opacity-80">
              <LogoFull size={30} />
            </Link>
          </div>
          <LangToggle value={uiLang} onChange={setUiLang} />
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-24 pt-10">
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {TEMPLATES.length} {tr.templatesTitle}
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
            {tr.chooseTemplateSubtitle}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-7 flex flex-col gap-4">
          {/* photo toggle + search */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => setPhotoOnly((v) => !v)}
              aria-pressed={photoOnly}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                photoOnly
                  ? "border-brand-500 bg-brand-600 text-white shadow-soft"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span
                className={`grid h-5 w-5 place-items-center rounded-md ${
                  photoOnly ? "bg-white/25" : "bg-brand-50 text-brand-600"
                }`}
              >
                {photoOnly ? <Check size={13} /> : <Camera size={13} />}
              </span>
              {tr.photoOnly}
            </button>

            <div className="relative w-full max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={tr.searchTemplate}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>

          {/* category chips */}
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
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700 shadow-sm ring-1 ring-brand-100">
                    {tpl.category}
                  </span>
                  {tpl.showPhoto && (
                    <span
                      title={tr.photoOnly}
                      className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-brand-600 shadow-sm ring-1 ring-brand-100"
                    >
                      <Camera size={12} />
                    </span>
                  )}
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
    </main>
  );
}
