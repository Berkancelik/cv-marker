"use client";

import React, { useEffect, useRef, useState } from "react";
import CVRenderer from "./cv/CVRenderer";
import { TemplateDef, CVData, Lang } from "@/lib/types";

const PAGE_W = 794;
const PAGE_H = 1123;

export default function TemplateThumb({
  tpl,
  data,
  lang,
}: {
  tpl: TemplateDef;
  data: CVData;
  lang: Lang;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const compute = () => setScale(el.clientWidth / PAGE_W);
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);

    // Only mount the (relatively heavy) CV render once scrolled near the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);

    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height: PAGE_H * scale }}>
      {visible ? (
        <div
          className="origin-top-left pointer-events-none select-none"
          style={{ transform: `scale(${scale})`, width: PAGE_W }}
          aria-hidden
        >
          <CVRenderer data={data} tpl={tpl} accent={tpl.accent} lang={lang} />
        </div>
      ) : (
        <div className="absolute inset-0 animate-pulse bg-slate-100" />
      )}
    </div>
  );
}
