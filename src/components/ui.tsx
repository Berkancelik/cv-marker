"use client";

import React, { useEffect, useRef, useState } from "react";
import { Lang } from "@/lib/types";

/** True only after the component has mounted on the client. Avoids
 *  hydration mismatches when reading persisted (localStorage) state. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function LangToggle({
  value,
  onChange,
  size = "md",
}: {
  value: Lang;
  onChange: (l: Lang) => void;
  size?: "sm" | "md";
}) {
  const pad = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs";
  return (
    <div className="inline-flex rounded-lg bg-slate-100 p-0.5 ring-1 ring-slate-200">
      {(["tr", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={`${pad} rounded-md font-semibold uppercase transition ${
            value === l ? "bg-white text-brand-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-medium text-slate-500 mb-1">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 placeholder:text-slate-300"
      />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  hint,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-medium text-slate-500 mb-1">{label}</span>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 placeholder:text-slate-300"
      />
      {hint && <span className="mt-1 block text-[10.5px] text-slate-400">{hint}</span>}
    </label>
  );
}

/**
 * Scales an A4 (794px wide) page to fit the available width.
 * Resets to natural size during print so the PDF is full size.
 */
export function PreviewStage({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.7);
  const PAGE_W = 794; // 210mm @ 96dpi

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const compute = () => {
      const w = el.clientWidth;
      setScale(Math.min(1, w / PAGE_W));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="preview-wrap w-full">
      <div
        className="preview-scaler mx-auto"
        style={{
          width: PAGE_W * scale,
          height: `calc(1123px * ${scale})`,
        }}
      >
        <div
          className="origin-top-left shadow-page"
          style={{ transform: `scale(${scale})`, width: PAGE_W }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
