import React from "react";

/**
 * "Powered by Alpina Systems" attribution — links to the developer's site.
 * Opens in a new tab; rel prevents the target page from accessing window.opener.
 */
export default function PoweredBy({ className = "" }: { className?: string }) {
  return (
    <a
      href="https://alpinasystems.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-1 text-[11px] text-ink-400 transition hover:text-brand-700 ${className}`}
    >
      <span>Powered by</span>
      <span className="font-semibold text-brand-700 group-hover:underline">Alpina Systems</span>
    </a>
  );
}
