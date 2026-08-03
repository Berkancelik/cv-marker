"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Languages,
  Eye,
  ArrowRight,
  ShieldCheck,
  LayoutTemplate,
  PenLine,
  Share2,
} from "lucide-react";
import { useCV } from "@/lib/store";
import { TEMPLATES, CATEGORIES } from "@/lib/templates";
import { t } from "@/lib/i18n";
import { sampleData } from "@/lib/sampleData";
import { LangToggle, useMounted } from "@/components/ui";
import { LogoFull } from "@/components/Logo";
import PoweredBy from "@/components/PoweredBy";
import VisitorCounter from "@/components/VisitorCounter";
import TemplateThumb from "@/components/TemplateThumb";

export default function Home() {
  const router = useRouter();
  const mounted = useMounted();
  const uiLang = useCV((s) => s.uiLang);
  const setUiLang = useCV((s) => s.setUiLang);
  const cvLang = useCV((s) => s.cvLang);
  const setTemplate = useCV((s) => s.setTemplate);
  const tr = t(uiLang);

  const [previewLang] = useState<typeof cvLang>(cvLang);
  const demo = useMemo(() => sampleData(previewLang), [previewLang]);

  // One representative (flagship) template per style category.
  const showcase = useMemo(
    () =>
      CATEGORIES.map((cat) => TEMPLATES.find((tpl) => tpl.category === cat)).filter(
        (tpl): tpl is (typeof TEMPLATES)[number] => Boolean(tpl)
      ),
    []
  );

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

  const steps = [
    { icon: <LayoutTemplate size={22} />, title: tr.step1Title, desc: tr.step1Desc },
    { icon: <PenLine size={22} />, title: tr.step2Title, desc: tr.step2Desc },
    { icon: <Share2 size={22} />, title: tr.step3Title, desc: tr.step3Desc },
  ];

  return (
    <main className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-cream-200 bg-cream-50/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link href="/" aria-label="CV Dock" className="rounded-lg transition hover:opacity-80">
            <LogoFull size={34} />
          </Link>
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
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">{tr.templatesSubtitle}</p>
          <div className="mt-7 flex items-center justify-center gap-3">
            <button
              onClick={() => router.push("/editor")}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
            >
              {tr.heroCta} <ArrowRight size={16} />
            </button>
            <Link
              href="/templates"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {tr.chooseTemplate}
            </Link>
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

      {/* How it works */}
      <section className="border-y border-cream-200 bg-cream-50/60">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">{tr.howTitle}</h2>
            <p className="mt-2 text-sm text-slate-500">{tr.howSubtitle}</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div
                key={i}
                className="rounded-2xl border border-cream-200 bg-white p-6 text-center shadow-soft"
              >
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 text-white">
                  {s.icon}
                </div>
                <div className="mt-2 text-[11px] font-bold text-brand-600">{i + 1}</div>
                <h3 className="mt-0.5 text-sm font-semibold text-slate-800">{s.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Template showcase — one per style */}
      <section id="templates" className="mx-auto max-w-6xl px-5 pt-16">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">{tr.showcaseTitle}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">{tr.showcaseSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {showcase.map((tpl) => (
            <div
              key={tpl.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-page"
            >
              <div className="relative border-b border-slate-100 bg-slate-50">
                <TemplateThumb tpl={tpl} data={demo} lang={previewLang} />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700 shadow-sm ring-1 ring-brand-100">
                  {tpl.category}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-2">
                  <span
                    className="h-4 w-4 rounded-full ring-2 ring-white shadow"
                    style={{ background: tpl.accent }}
                  />
                  <span className="text-sm font-semibold text-slate-800">{tpl.name}</span>
                </div>
                <button
                  onClick={() => choose(tpl.id)}
                  className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700"
                >
                  {tr.useThisStyle}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 rounded-xl border border-brand-300 bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-soft transition hover:bg-brand-50"
          >
            {tr.allTemplates} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="overflow-hidden rounded-3xl bg-brand-600 px-6 py-12 text-center shadow-page">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{tr.finalCtaTitle}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-brand-50">{tr.finalCtaDesc}</p>
          <button
            onClick={() => router.push("/editor")}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-soft transition hover:bg-cream-50"
          >
            {tr.startEditing} <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <footer className="border-t border-cream-200 bg-cream-50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 px-5 py-7">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <VisitorCounter />
            <PoweredBy />
          </div>
          <span className="text-xs text-ink-400">© {new Date().getFullYear()} CV Dock</span>
        </div>
      </footer>
    </main>
  );
}
