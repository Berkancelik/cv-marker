"use client";

import React, { useEffect, useState } from "react";
import { LogoFull } from "@/components/Logo";

/**
 * Branded splash shown while the app boots. Fades out on its own after a short
 * beat. Rendered at the root so it covers the very first paint on every fresh
 * load (desktop and mobile).
 */
export default function SplashScreen() {
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const leave = setTimeout(() => setLeaving(true), 1400);
    const remove = setTimeout(() => setDone(true), 1950);
    return () => {
      clearTimeout(leave);
      clearTimeout(remove);
    };
  }, []);

  if (done) return null;

  return (
    <div className={`splash-root ${leaving ? "is-leaving" : ""}`} aria-hidden>
      <div className="flex flex-col items-center gap-6 px-6">
        <div className="splash-mark">
          <LogoFull size={92} stacked />
        </div>
        <div className="splash-wordmark flex flex-col items-center gap-3">
          <p className="text-sm font-medium text-ink-400">
            Profesyonel özgeçmiş oluşturucu
          </p>
          <div className="splash-bar" />
        </div>
      </div>
    </div>
  );
}
