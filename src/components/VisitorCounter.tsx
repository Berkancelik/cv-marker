"use client";

import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";

/**
 * Live visitor counter backed by /api/visits (Upstash Redis).
 * Counts each browser session once (POST on first load, GET afterwards) so the
 * number reflects visits rather than every re-render. Renders nothing until a
 * real number arrives — so it stays invisible when Upstash isn't configured yet.
 */
export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const firstThisSession = !sessionStorage.getItem("cvdock-visited");
        const res = await fetch("/api/visits", {
          method: firstThisSession ? "POST" : "GET",
          cache: "no-store",
        });
        const data = await res.json();
        if (firstThisSession) sessionStorage.setItem("cvdock-visited", "1");
        if (!cancelled && typeof data?.count === "number") setCount(data.count);
      } catch {
        /* counter is non-critical — stay silent on failure */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (count === null) return null;

  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] text-ink-400"
      title="Toplam ziyaretçi"
    >
      <Users size={13} className="text-brand-600" />
      <span className="font-semibold tabular-nums text-ink-600">
        {count.toLocaleString("tr-TR")}
      </span>
      <span>ziyaretçi</span>
    </span>
  );
}
