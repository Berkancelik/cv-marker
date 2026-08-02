"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Eraser, Palette, LayoutGrid } from "lucide-react";
import { useCV } from "@/lib/store";
import { t } from "@/lib/i18n";
import { TEMPLATES, CATEGORIES, getTemplate } from "@/lib/templates";
import { LangToggle, PreviewStage, useMounted } from "@/components/ui";
import { LogoMark } from "@/components/Logo";
import PoweredBy from "@/components/PoweredBy";
import EditorForm from "@/components/editor/EditorForm";
import CVRenderer from "@/components/cv/CVRenderer";
import CVAnalysis from "@/components/editor/CVAnalysis";
import ExportMenu from "@/components/editor/ExportMenu";

const ACCENTS = [
  "#63722f", // CV Dock sage
  "#2e2e2e", // ink
  "#0d9488",
  "#15803d",
  "#e11d48",
  "#ea580c",
  "#7c3aed",
  "#0891b2",
  "#b45309",
  "#1d4ed8",
];

export default function EditorPage() {
  const mounted = useMounted();
  const s = useCV();
  const tr = t(s.uiLang);
  const tpl = getTemplate(s.templateId);
  const accent = s.accentOverride ?? tpl.accent;

  if (!mounted) {
    return (
      <div className="grid min-h-screen place-items-center text-ink-300">
        <div className="animate-pulse text-sm">CV Dock…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Toolbar */}
      <header className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-3 px-4 py-2.5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-ink-600 transition hover:bg-brand-50"
          >
            <ArrowLeft size={16} className="shrink-0" />
            <LogoMark size={22} className="shrink-0" />
            <span className="hidden sm:inline">{tr.backToTemplates}</span>
          </Link>

          <div className="mx-1 hidden h-5 w-px bg-slate-200 sm:block" />

          {/* Template select */}
          <label className="inline-flex items-center gap-2 text-xs text-slate-500">
            <LayoutGrid size={15} />
            <span className="hidden sm:inline">{tr.template}</span>
            <select
              value={s.templateId}
              onChange={(e) => s.setTemplate(e.target.value)}
              className="max-w-[180px] rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            >
              {CATEGORIES.map((cat) => (
                <optgroup key={cat} label={cat}>
                  {TEMPLATES.filter((tt) => tt.category === cat).map((tt) => (
                    <option key={tt.id} value={tt.id}>
                      {tt.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>

          {/* Accent */}
          <div className="inline-flex items-center gap-1.5">
            <Palette size={15} className="text-slate-400" />
            <div className="flex items-center gap-1">
              {ACCENTS.map((hex) => (
                <button
                  key={hex}
                  onClick={() => s.setAccent(hex)}
                  className={`h-5 w-5 rounded-full ring-2 transition ${
                    accent.toLowerCase() === hex.toLowerCase()
                      ? "ring-slate-400 scale-110"
                      : "ring-white hover:scale-110"
                  }`}
                  style={{ background: hex }}
                  aria-label={hex}
                />
              ))}
              <label className="relative ml-1 h-5 w-5 cursor-pointer overflow-hidden rounded-full ring-2 ring-white">
                <span className="absolute inset-0 bg-[conic-gradient(red,orange,yellow,lime,aqua,blue,magenta,red)]" />
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => s.setAccent(e.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>
            </div>
          </div>

          <div className="ml-auto flex flex-wrap items-center justify-end gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="hidden text-[11px] text-slate-400 sm:inline">{tr.cvLanguage}</span>
              <LangToggle value={s.cvLang} onChange={s.setCvLang} size="sm" />
            </div>
            <div className="hidden h-5 w-px bg-slate-200 sm:block" />
            <div className="flex items-center gap-1.5">
              <span className="hidden text-[11px] text-slate-400 sm:inline">UI</span>
              <LangToggle value={s.uiLang} onChange={s.setUiLang} size="sm" />
            </div>

            <CVAnalysis />

            <button
              onClick={() => {
                if (confirm(tr.clearConfirm)) s.clearData();
              }}
              title={tr.reset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              <Eraser size={14} /> <span className="hidden lg:inline">{tr.reset}</span>
            </button>

            <button
              onClick={() => {
                if (confirm(tr.resetConfirm)) s.loadSample();
              }}
              title={tr.loadSample}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <RotateCcw size={14} /> <span className="hidden lg:inline">{tr.loadSample}</span>
            </button>

            <ExportMenu />
          </div>
        </div>
      </header>

      {/* Body: form + preview */}
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[minmax(0,440px)_1fr]">
        {/* Form */}
        <div className="no-print">
          <EditorForm />
        </div>

        {/* Preview */}
        <div className="print-area lg:sticky lg:top-[60px] lg:h-[calc(100vh-72px)] lg:overflow-auto">
          <div className="rounded-2xl bg-slate-100/70 p-4 lg:p-6">
            <PreviewStage>
              <CVRenderer data={s.data} tpl={tpl} accent={accent} lang={s.cvLang} />
            </PreviewStage>
          </div>
          <p className="no-print mt-3 text-center text-[11px] text-slate-400">{tr.uiNote}</p>
        </div>
      </div>

      <footer className="no-print border-t border-cream-200 py-4 text-center">
        <PoweredBy />
      </footer>
    </div>
  );
}
