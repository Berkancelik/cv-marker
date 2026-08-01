"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Gauge, X, Lightbulb, Sparkles, Check, RefreshCw, ListChecks } from "lucide-react";
import { useCV } from "@/lib/store";
import { t } from "@/lib/i18n";
import { analyzeCV, suggestSummary } from "@/lib/analyze";

const GRADE_COLOR: Record<string, string> = {
  excellent: "#15803d",
  good: "#0d9488",
  fair: "#ea580c",
  weak: "#e11d48",
};

export default function CVAnalysis() {
  const s = useCV();
  const tr = t(s.uiLang);
  const [open, setOpen] = useState(false);
  const [applied, setApplied] = useState(false);
  const [seed, setSeed] = useState(0); // regenerate trigger (kept for parity / future variation)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Lock body scroll while the modal is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const analysis = useMemo(
    () => (open ? analyzeCV(s.data, s.uiLang) : null),
    [open, s.data, s.uiLang]
  );
  const suggested = useMemo(
    () => (open ? suggestSummary(s.data, s.uiLang) : ""),
    [open, s.data, s.uiLang, seed]
  );

  const gradeLabel = analysis
    ? {
        excellent: tr.gradeExcellent,
        good: tr.gradeGood,
        fair: tr.gradeFair,
        weak: tr.gradeWeak,
      }[analysis.grade]
    : "";
  const color = analysis ? GRADE_COLOR[analysis.grade] : "#64748b";

  const applySummary = () => {
    if (!suggested) return;
    s.setSummary(suggested);
    setApplied(true);
    setTimeout(() => setApplied(false), 1800);
  };

  // SVG ring geometry
  const R = 34;
  const C = 2 * Math.PI * R;
  const pct = analysis ? analysis.score / 100 : 0;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title={tr.analyze}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-500 transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600"
      >
        <Gauge size={14} />
        <span className="hidden md:inline">{tr.analyze}</span>
      </button>

      {open &&
        analysis &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <div className="flex min-h-full items-center justify-center p-4">
              <div
              className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header */}
            <div className="flex items-start gap-3 border-b border-slate-100 p-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                <Gauge size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-slate-800">{tr.analyzeTitle}</h2>
                <p className="mt-0.5 text-xs text-slate-500">{tr.analyzeDesc}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-5 overflow-y-auto p-5">
              {/* Score ring */}
              <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="relative grid h-[88px] w-[88px] shrink-0 place-items-center">
                  <svg width="88" height="88" className="-rotate-90">
                    <circle cx="44" cy="44" r={R} fill="none" stroke="#e2e8f0" strokeWidth="8" />
                    <circle
                      cx="44"
                      cy="44"
                      r={R}
                      fill="none"
                      stroke={color}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={C}
                      strokeDashoffset={C * (1 - pct)}
                      style={{ transition: "stroke-dashoffset .6s ease" }}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-bold leading-none" style={{ color }}>
                      {analysis.score}
                    </span>
                    <span className="text-[9px] text-slate-400">/ 100</span>
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">{tr.scoreLabel}</div>
                  <div className="text-lg font-semibold" style={{ color }}>
                    {gradeLabel}
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div>
                <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  <ListChecks size={13} /> {tr.breakdownTitle}
                </div>
                <div className="space-y-2">
                  {analysis.parts.map((p) => {
                    const ratio = p.score / p.max;
                    const bar = ratio >= 0.85 ? "#15803d" : ratio >= 0.5 ? "#ea580c" : "#e11d48";
                    return (
                      <div key={p.key} className="flex items-center gap-2.5">
                        <span className="w-36 shrink-0 text-xs text-slate-600">{p.label}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${ratio * 100}%`, background: bar }}
                          />
                        </div>
                        <span className="w-10 shrink-0 text-right text-[11px] tabular-nums text-slate-400">
                          {p.score}/{p.max}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Suggestions */}
              <div>
                <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  <Lightbulb size={13} /> {tr.suggestionsTitle}
                </div>
                {analysis.suggestions.length ? (
                  <ul className="space-y-1.5">
                    {analysis.suggestions.map((sug, i) => (
                      <li key={i} className="flex gap-2 text-xs leading-relaxed text-slate-600">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{tr.allGood}</p>
                )}
              </div>

              {/* Suggested summary */}
              <div className="rounded-xl border border-brand-100 bg-brand-50/40 p-3">
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-brand-600">
                  <Sparkles size={13} /> {tr.suggestSummaryTitle}
                </div>
                {suggested ? (
                  <>
                    <p className="rounded-lg bg-white p-2.5 text-xs leading-relaxed text-slate-700 ring-1 ring-slate-100">
                      {suggested}
                    </p>
                    <p className="mt-1.5 text-[10.5px] text-slate-400">{tr.suggestSummaryHint}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={applySummary}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white shadow-soft transition hover:bg-brand-700"
                      >
                        <Check size={13} /> {applied ? "✓" : tr.applySummary}
                      </button>
                      <button
                        onClick={() => setSeed((n) => n + 1)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-50"
                      >
                        <RefreshCw size={13} /> {tr.regenerate}
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-slate-400">{tr.noTitleForSummary}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 bg-slate-50/50 px-5 py-3">
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100"
              >
                {tr.close}
              </button>
            </div>
            </div>
          </div>
        </div>,
          document.body
        )}
    </>
  );
}
