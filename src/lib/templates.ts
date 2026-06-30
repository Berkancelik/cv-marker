import { TemplateDef, LayoutKind, HeadingStyle } from "./types";

/** Human-readable category label per layout engine (used for grouping/filtering). */
export const CATEGORY_BY_LAYOUT: Record<LayoutKind, string> = {
  classic: "Klasik",
  "sidebar-left": "Kenar Çubuğu",
  "sidebar-right": "Sağ Kenar",
  "sidebar-header": "Kenar Başlık",
  "header-banner": "Banner",
  "top-band": "Üst Şerit",
  "left-rail": "İnce Çizgi",
  "boxed-header": "Kutu Başlık",
  timeline: "Zaman Çizelgesi",
  minimal: "Minimal",
  "compact-two-col": "İki Sütun",
  "elegant-serif": "Zarif Serif",
};

// ---- The original, hand-tuned 20 templates ----
const CURATED: Omit<TemplateDef, "category">[] = [
  { id: "aurora", name: "Aurora", layout: "sidebar-left", accent: "#3366ff", font: "sans", showPhoto: true, accentBg: true, uppercaseHeadings: true },
  { id: "berlin", name: "Berlin", layout: "header-banner", accent: "#0f766e", font: "sans", showPhoto: true, accentBg: true },
  { id: "classic", name: "Classic", layout: "classic", accent: "#1f2937", font: "serif", uppercaseHeadings: true },
  { id: "coral", name: "Coral", layout: "sidebar-right", accent: "#e11d48", font: "sans", showPhoto: true, accentBg: false },
  { id: "monaco", name: "Monaco", layout: "minimal", accent: "#111827", font: "mono" },
  { id: "oxford", name: "Oxford", layout: "elegant-serif", accent: "#1e3a8a", font: "serif", uppercaseHeadings: true },
  { id: "verde", name: "Verde", layout: "sidebar-left", accent: "#15803d", font: "sans", showPhoto: true, accentBg: true },
  { id: "sunset", name: "Sunset", layout: "header-banner", accent: "#ea580c", font: "sans", showPhoto: true, accentBg: true },
  { id: "violet", name: "Violet", layout: "sidebar-right", accent: "#7c3aed", font: "sans", showPhoto: true, accentBg: true },
  { id: "slate", name: "Slate", layout: "compact-two-col", accent: "#475569", font: "sans", uppercaseHeadings: true },
  { id: "timeline", name: "Timeline", layout: "timeline", accent: "#0891b2", font: "sans" },
  { id: "minimal-ink", name: "Minimal Ink", layout: "minimal", accent: "#0a0a0a", font: "sans" },
  { id: "rosewood", name: "Rosewood", layout: "elegant-serif", accent: "#9f1239", font: "serif" },
  { id: "azure", name: "Azure", layout: "sidebar-left", accent: "#0284c7", font: "sans", showPhoto: true, accentBg: false },
  { id: "graphite", name: "Graphite", layout: "compact-two-col", accent: "#374151", font: "mono" },
  { id: "amber", name: "Amber", layout: "header-banner", accent: "#b45309", font: "serif", showPhoto: true, accentBg: false },
  { id: "teal-pro", name: "Teal Pro", layout: "sidebar-right", accent: "#0d9488", font: "sans", showPhoto: true, accentBg: true, uppercaseHeadings: true },
  { id: "indigo", name: "Indigo", layout: "timeline", accent: "#4f46e5", font: "sans" },
  { id: "stone", name: "Stone", layout: "classic", accent: "#57534e", font: "serif" },
  { id: "midnight-blue", name: "Midnight Blue", layout: "sidebar-left", accent: "#1e293b", font: "sans", showPhoto: true, accentBg: true, uppercaseHeadings: true },
];

// ---- Palette used to generate the extended catalog ----
const PALETTES: { key: string; name: string; hex: string }[] = [
  { key: "blue", name: "Blue", hex: "#2563eb" },
  { key: "royal", name: "Royal", hex: "#1e40af" },
  { key: "sky", name: "Sky", hex: "#0284c7" },
  { key: "cyan", name: "Cyan", hex: "#0891b2" },
  { key: "teal", name: "Teal", hex: "#0d9488" },
  { key: "emerald", name: "Emerald", hex: "#059669" },
  { key: "green", name: "Green", hex: "#15803d" },
  { key: "forest", name: "Forest", hex: "#166534" },
  { key: "olive", name: "Olive", hex: "#4d7c0f" },
  { key: "amber", name: "Amber", hex: "#b45309" },
  { key: "orange", name: "Orange", hex: "#ea580c" },
  { key: "red", name: "Red", hex: "#dc2626" },
  { key: "rose", name: "Rose", hex: "#e11d48" },
  { key: "pink", name: "Pink", hex: "#db2777" },
  { key: "fuchsia", name: "Fuchsia", hex: "#c026d3" },
  { key: "purple", name: "Purple", hex: "#9333ea" },
  { key: "violet", name: "Violet", hex: "#7c3aed" },
  { key: "indigo", name: "Indigo", hex: "#4f46e5" },
  { key: "slate", name: "Slate", hex: "#475569" },
  { key: "graphite", name: "Graphite", hex: "#374151" },
  { key: "ink", name: "Ink", hex: "#111827" },
  { key: "navy", name: "Navy", hex: "#1e293b" },
  { key: "maroon", name: "Maroon", hex: "#9f1239" },
  { key: "bronze", name: "Bronze", hex: "#a16207" },
];

// ---- Layout families used by the generator ----
interface Family {
  layout: LayoutKind;
  font: "sans" | "serif" | "mono";
  showPhoto?: boolean;
  accentBg?: boolean;
}
const FAMILIES: Family[] = [
  { layout: "sidebar-left", font: "sans", showPhoto: true, accentBg: true },
  { layout: "sidebar-right", font: "sans", showPhoto: true, accentBg: false },
  { layout: "sidebar-header", font: "sans", showPhoto: true, accentBg: true },
  { layout: "header-banner", font: "sans", showPhoto: true, accentBg: true },
  { layout: "top-band", font: "sans", showPhoto: false, accentBg: false },
  { layout: "boxed-header", font: "sans", showPhoto: true, accentBg: false },
  { layout: "left-rail", font: "sans", showPhoto: false, accentBg: false },
  { layout: "timeline", font: "sans", showPhoto: false, accentBg: false },
  { layout: "compact-two-col", font: "sans", showPhoto: false, accentBg: false },
  { layout: "minimal", font: "sans", showPhoto: false, accentBg: false },
  { layout: "classic", font: "serif", showPhoto: false, accentBg: false },
  { layout: "elegant-serif", font: "serif", showPhoto: false, accentBg: false },
];

const HEADINGS: HeadingStyle[] = ["underline", "bar", "pill", "block", "plain"];

/** Deterministically generate `target` extra templates from families × palettes. */
function generate(target: number): TemplateDef[] {
  const out: TemplateDef[] = [];
  for (let j = 0; out.length < target; j++) {
    for (let f = 0; f < FAMILIES.length && out.length < target; f++) {
      const fam = FAMILIES[f];
      const pal = PALETTES[(f * 5 + j) % PALETTES.length];
      const heading = HEADINGS[(j + f) % HEADINGS.length];
      const font: Family["font"] = j % 3 === 2 ? "serif" : fam.font;
      const label = CATEGORY_BY_LAYOUT[fam.layout];
      out.push({
        id: `t-${fam.layout}-${pal.key}-${j}`,
        name: `${pal.name} ${label}`,
        layout: fam.layout,
        accent: pal.hex,
        font,
        category: label,
        headingStyle: heading,
        uppercaseHeadings: j % 2 === 0,
        showPhoto: fam.showPhoto,
        accentBg: fam.accentBg,
      });
    }
  }
  return out;
}

export const TEMPLATES: TemplateDef[] = [
  ...CURATED.map((t) => ({ ...t, category: CATEGORY_BY_LAYOUT[t.layout] })),
  ...generate(100),
];

/** Ordered, de-duplicated list of category labels present in the catalog. */
export const CATEGORIES: string[] = Array.from(new Set(TEMPLATES.map((t) => t.category)));

export function getTemplate(id: string): TemplateDef {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}
