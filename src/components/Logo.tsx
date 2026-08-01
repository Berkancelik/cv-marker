import React from "react";

const SAGE = "#7e8f4a";
const INK = "#2e2e2e";

/**
 * CV Dock brand mark — a document/page with a folded corner (sage) behind the
 * "CV" wordmark (C in charcoal, V in sage). Pure SVG so it stays crisp at any
 * size and needs no binary asset.
 */
export function LogoMark({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      role="img"
      aria-label="CV Dock"
    >
      {/* Document / page with folded corner */}
      <path
        d="M58 14h27l19 19v57a5 5 0 0 1-5 5H58a5 5 0 0 1-5-5V19a5 5 0 0 1 5-5z"
        fill="#fdfbf4"
        stroke={SAGE}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M84 15v14a4 4 0 0 0 4 4h15"
        fill="none"
        stroke={SAGE}
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Text lines inside the page */}
      <g stroke={SAGE} strokeWidth="4.5" strokeLinecap="round" opacity="0.85">
        <line x1="65" y1="40" x2="92" y2="40" />
        <line x1="65" y1="49" x2="88" y2="49" />
        <line x1="65" y1="58" x2="92" y2="58" />
      </g>
      {/* CV wordmark */}
      <text
        x="6"
        y="99"
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="74"
        fontWeight="800"
        letterSpacing="-3"
      >
        <tspan fill={INK}>C</tspan>
        <tspan fill={SAGE}>V</tspan>
      </text>
    </svg>
  );
}

/**
 * Full lockup: brand mark + "CV DOCK" wordmark. `stacked` puts the wordmark
 * under the mark (used on the splash screen); otherwise it sits to the right.
 */
export function LogoFull({
  size = 40,
  stacked = false,
  className = "",
}: {
  size?: number;
  stacked?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex ${stacked ? "flex-col items-center gap-3" : "flex-row items-center gap-2.5"} ${className}`}
    >
      <LogoMark size={size} />
      <div
        className="font-extrabold tracking-tight leading-none"
        style={{ fontSize: stacked ? size * 0.55 : size * 0.48 }}
      >
        <span style={{ color: SAGE }}>CV</span>{" "}
        <span style={{ color: INK }}>DOCK</span>
      </div>
    </div>
  );
}

export default LogoMark;
