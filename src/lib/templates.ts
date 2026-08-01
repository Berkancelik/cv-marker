import { TemplateDef, LayoutKind, HeadingStyle, PhotoShape } from "./types";

/**
 * Catalog is organised by *style* (Modern, Minimal, Executive, …) rather than
 * by layout engine — matching how mainstream resume builders (Novoresume, Zety,
 * Canva, resume.io) let people browse. Every template still maps onto one of the
 * 12 layout engines under the hood.
 */

// Ordered so the most in-demand styles surface first in the gallery/filter.
const CATEGORY_ORDER = [
  "Modern",
  "Minimal",
  "Profesyonel",
  "Kreatif",
  "Yönetici",
  "Teknik",
  "Akademik",
  "Zarif",
  "Klasik",
] as const;

// ---- Flagship, hand-tuned templates (premium single-word names) ----
const CURATED: TemplateDef[] = [
  // — original 20, re-categorised into styles —
  { id: "aurora", name: "Aurora", layout: "sidebar-left", accent: "#63722f", font: "sans", showPhoto: true, accentBg: true, uppercaseHeadings: true, category: "Kreatif" },
  { id: "berlin", name: "Berlin", layout: "header-banner", accent: "#0f766e", font: "sans", showPhoto: true, accentBg: true, category: "Modern" },
  { id: "classic", name: "Classic", layout: "classic", accent: "#1f2937", font: "serif", uppercaseHeadings: true, category: "Klasik" },
  { id: "coral", name: "Coral", layout: "sidebar-right", accent: "#e11d48", font: "sans", showPhoto: true, accentBg: false, photoShape: "squircle", category: "Kreatif" },
  { id: "monaco", name: "Monaco", layout: "minimal", accent: "#111827", font: "mono", headingStyle: "dot", category: "Teknik" },
  { id: "oxford", name: "Oxford", layout: "elegant-serif", accent: "#1e3a8a", font: "serif", uppercaseHeadings: true, headingStyle: "double", category: "Akademik" },
  { id: "verde", name: "Verde", layout: "sidebar-left", accent: "#15803d", font: "sans", showPhoto: true, accentBg: true, category: "Kreatif" },
  { id: "sunset", name: "Sunset", layout: "header-banner", accent: "#ea580c", font: "sans", showPhoto: true, accentBg: true, photoShape: "squircle", category: "Kreatif" },
  { id: "violet", name: "Violet", layout: "sidebar-right", accent: "#7c3aed", font: "sans", showPhoto: true, accentBg: true, category: "Kreatif" },
  { id: "slate", name: "Slate", layout: "compact-two-col", accent: "#475569", font: "sans", uppercaseHeadings: true, headingStyle: "bar", category: "Profesyonel" },
  { id: "timeline", name: "Timeline", layout: "timeline", accent: "#0891b2", font: "sans", category: "Modern" },
  { id: "minimal-ink", name: "Minimal Ink", layout: "minimal", accent: "#0a0a0a", font: "sans", headingStyle: "plain", category: "Minimal" },
  { id: "rosewood", name: "Rosewood", layout: "elegant-serif", accent: "#9f1239", font: "serif", category: "Zarif" },
  { id: "azure", name: "Azure", layout: "sidebar-left", accent: "#0284c7", font: "sans", showPhoto: true, accentBg: false, category: "Modern" },
  { id: "graphite", name: "Graphite", layout: "compact-two-col", accent: "#374151", font: "mono", headingStyle: "double", category: "Teknik" },
  { id: "amber", name: "Amber", layout: "header-banner", accent: "#b45309", font: "serif", showPhoto: true, accentBg: false, photoShape: "square", category: "Profesyonel" },
  { id: "teal-pro", name: "Teal Pro", layout: "sidebar-right", accent: "#0d9488", font: "sans", showPhoto: true, accentBg: true, uppercaseHeadings: true, photoShape: "squircle", category: "Modern" },
  { id: "indigo", name: "Indigo", layout: "timeline", accent: "#4f46e5", font: "sans", category: "Modern" },
  { id: "stone", name: "Stone", layout: "classic", accent: "#57534e", font: "serif", category: "Klasik" },
  { id: "midnight-blue", name: "Midnight Blue", layout: "sidebar-left", accent: "#1e293b", font: "sans", showPhoto: true, accentBg: true, uppercaseHeadings: true, photoShape: "square", category: "Yönetici" },

  // — 32 new flagship templates (showcase the new heading styles & photo shapes) —
  { id: "oslo", name: "Oslo", layout: "sidebar-header", accent: "#3b5b78", font: "sans", showPhoto: true, accentBg: true, photoShape: "squircle", headingStyle: "plain", uppercaseHeadings: true, category: "Modern" },
  { id: "kyoto", name: "Kyoto", layout: "minimal", accent: "#111827", font: "serif", headingStyle: "dot", category: "Minimal" },
  { id: "milano", name: "Milano", layout: "elegant-serif", accent: "#9f1239", font: "serif", headingStyle: "double", uppercaseHeadings: true, category: "Zarif" },
  { id: "zurich", name: "Zürich", layout: "left-rail", accent: "#1f2937", font: "sans", headingStyle: "plain", category: "Minimal" },
  { id: "helsinki", name: "Helsinki", layout: "top-band", accent: "#0f766e", font: "sans", headingStyle: "block", category: "Profesyonel" },
  { id: "vienna", name: "Vienna", layout: "boxed-header", accent: "#1e293b", font: "serif", showPhoto: true, photoShape: "square", uppercaseHeadings: true, category: "Yönetici" },
  { id: "lisbon", name: "Lisbon", layout: "header-banner", accent: "#c2410c", font: "sans", showPhoto: true, accentBg: true, photoShape: "squircle", headingStyle: "pill", category: "Kreatif" },
  { id: "tokyo", name: "Tokyo", layout: "sidebar-left", accent: "#111827", font: "sans", showPhoto: true, accentBg: true, photoShape: "square", headingStyle: "bar", uppercaseHeadings: true, category: "Yönetici" },
  { id: "denver", name: "Denver", layout: "timeline", accent: "#166534", font: "sans", headingStyle: "dot", category: "Modern" },
  { id: "bern", name: "Bern", layout: "compact-two-col", accent: "#475569", font: "sans", headingStyle: "bar", category: "Profesyonel" },
  { id: "porto", name: "Porto", layout: "sidebar-right", accent: "#7e22ce", font: "sans", showPhoto: true, accentBg: true, headingStyle: "block", category: "Kreatif" },
  { id: "atlas", name: "Atlas", layout: "classic", accent: "#374151", font: "mono", headingStyle: "double", uppercaseHeadings: true, category: "Teknik" },
  { id: "sienna", name: "Sienna", layout: "header-banner", accent: "#9a3412", font: "serif", showPhoto: true, accentBg: false, photoShape: "square", category: "Profesyonel" },
  { id: "cobalt", name: "Cobalt", layout: "sidebar-header", accent: "#1e40af", font: "sans", showPhoto: true, accentBg: true, photoShape: "squircle", headingStyle: "plain", category: "Kreatif" },
  { id: "aspen", name: "Aspen", layout: "boxed-header", accent: "#63722f", font: "sans", showPhoto: true, photoShape: "squircle", headingStyle: "block", uppercaseHeadings: true, category: "Yönetici" },
  { id: "verona", name: "Verona", layout: "elegant-serif", accent: "#6d28d9", font: "serif", headingStyle: "dot", category: "Zarif" },
  { id: "quartz", name: "Quartz", layout: "minimal", accent: "#475569", font: "sans", headingStyle: "plain", category: "Minimal" },
  { id: "nimbus", name: "Nimbus", layout: "left-rail", accent: "#0284c7", font: "sans", headingStyle: "bar", category: "Modern" },
  { id: "onyx", name: "Onyx", layout: "sidebar-left", accent: "#111827", font: "sans", showPhoto: true, accentBg: true, photoShape: "square", headingStyle: "plain", uppercaseHeadings: true, category: "Yönetici" },
  { id: "marble", name: "Marble", layout: "classic", accent: "#57534e", font: "serif", headingStyle: "underline", uppercaseHeadings: true, category: "Klasik" },
  { id: "cambridge", name: "Cambridge", layout: "elegant-serif", accent: "#1e293b", font: "serif", headingStyle: "double", uppercaseHeadings: true, category: "Akademik" },
  { id: "seoul", name: "Seoul", layout: "sidebar-right", accent: "#0e7490", font: "sans", showPhoto: true, accentBg: true, photoShape: "squircle", headingStyle: "pill", category: "Modern" },
  { id: "dublin", name: "Dublin", layout: "timeline", accent: "#115e59", font: "sans", headingStyle: "double", category: "Modern" },
  { id: "munich", name: "Munich", layout: "compact-two-col", accent: "#111827", font: "sans", uppercaseHeadings: true, headingStyle: "bar", category: "Profesyonel" },
  { id: "vellum", name: "Vellum", layout: "elegant-serif", accent: "#a16207", font: "serif", headingStyle: "dot", category: "Zarif" },
  { id: "cairo", name: "Cairo", layout: "header-banner", accent: "#a16207", font: "serif", showPhoto: true, accentBg: false, photoShape: "square", category: "Profesyonel" },
  { id: "nordic", name: "Nordic", layout: "sidebar-header", accent: "#475569", font: "sans", showPhoto: true, accentBg: true, photoShape: "squircle", headingStyle: "plain", category: "Modern" },
  { id: "madrid", name: "Madrid", layout: "boxed-header", accent: "#be123c", font: "sans", showPhoto: true, photoShape: "squircle", headingStyle: "block", uppercaseHeadings: true, category: "Kreatif" },
  { id: "pixel", name: "Pixel", layout: "minimal", accent: "#0f766e", font: "mono", headingStyle: "dot", category: "Teknik" },
  { id: "sequoia", name: "Sequoia", layout: "sidebar-left", accent: "#3f6212", font: "sans", showPhoto: true, accentBg: true, headingStyle: "bar", category: "Kreatif" },
  { id: "princeton", name: "Princeton", layout: "classic", accent: "#1e293b", font: "serif", headingStyle: "double", uppercaseHeadings: true, category: "Akademik" },
  { id: "amethyst", name: "Amethyst", layout: "sidebar-right", accent: "#6d28d9", font: "sans", showPhoto: true, accentBg: true, photoShape: "squircle", headingStyle: "pill", category: "Kreatif" },
];

// ---- Market-aligned accent palette (professional, muted-leaning; no pastels
// so white text always stays legible on filled sidebars) ----
const PALETTES: { key: string; name: string; hex: string }[] = [
  { key: "royal", name: "Royal", hex: "#1e40af" },
  { key: "blue", name: "Blue", hex: "#2563eb" },
  { key: "azure", name: "Azure", hex: "#0284c7" },
  { key: "sky", name: "Sky", hex: "#0369a1" },
  { key: "steel", name: "Steel", hex: "#3b5b78" },
  { key: "navy", name: "Navy", hex: "#1e293b" },
  { key: "midnight", name: "Midnight", hex: "#0f172a" },
  { key: "teal", name: "Teal", hex: "#0f766e" },
  { key: "emerald", name: "Emerald", hex: "#047857" },
  { key: "pine", name: "Pine", hex: "#115e59" },
  { key: "forest", name: "Forest", hex: "#166534" },
  { key: "green", name: "Green", hex: "#15803d" },
  { key: "sage", name: "Sage", hex: "#63722f" },
  { key: "olive", name: "Olive", hex: "#4d7c0f" },
  { key: "moss", name: "Moss", hex: "#3f6212" },
  { key: "amber", name: "Amber", hex: "#b45309" },
  { key: "bronze", name: "Bronze", hex: "#a16207" },
  { key: "terracotta", name: "Terracotta", hex: "#c2410c" },
  { key: "rust", name: "Rust", hex: "#9a3412" },
  { key: "sienna", name: "Sienna", hex: "#92400e" },
  { key: "red", name: "Red", hex: "#dc2626" },
  { key: "crimson", name: "Crimson", hex: "#be123c" },
  { key: "rose", name: "Rose", hex: "#e11d48" },
  { key: "wine", name: "Wine", hex: "#9f1239" },
  { key: "maroon", name: "Maroon", hex: "#7f1d1d" },
  { key: "pink", name: "Pink", hex: "#db2777" },
  { key: "purple", name: "Purple", hex: "#9333ea" },
  { key: "violet", name: "Violet", hex: "#7c3aed" },
  { key: "plum", name: "Plum", hex: "#7e22ce" },
  { key: "grape", name: "Grape", hex: "#6d28d9" },
  { key: "indigo", name: "Indigo", hex: "#4f46e5" },
  { key: "slate", name: "Slate", hex: "#475569" },
  { key: "graphite", name: "Graphite", hex: "#374151" },
  { key: "charcoal", name: "Charcoal", hex: "#1f2937" },
  { key: "ink", name: "Ink", hex: "#111827" },
  { key: "stone", name: "Stone", hex: "#57534e" },
  { key: "taupe", name: "Taupe", hex: "#78716c" },
  { key: "cyan", name: "Cyan", hex: "#0e7490" },
];

// Dark-neutral accents that read as "executive" on classic/boxed layouts.
const EXEC_KEYS = new Set(["ink", "charcoal", "navy", "midnight", "graphite", "slate", "steel"]);

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

const HEADINGS: HeadingStyle[] = ["underline", "bar", "pill", "block", "plain", "dot", "double"];
const PHOTO_SHAPES: PhotoShape[] = ["round", "squircle", "square"];

// Evocative names for the generated catalog (paired with a colour → "Geneva Navy").
const NAMES = [
  "Geneva", "Prague", "Warsaw", "Zagreb", "Athens", "Cardiff", "Bruges", "Ghent",
  "Bergen", "Aarhus", "Turin", "Genoa", "Bologna", "Sapporo", "Osaka", "Nagoya",
  "Kobe", "Busan", "Hanoi", "Manila", "Perth", "Hobart", "Adelaide", "Ottawa",
  "Quebec", "Calgary", "Boston", "Denali", "Sierra", "Cascade", "Rainier", "Tahoe",
  "Sedona", "Laguna", "Marin", "Cypress", "Cedar", "Alder", "Birch", "Maple",
  "Willow", "Juniper", "Basalt", "Granite", "Flint", "Sable", "Umber", "Cinder",
  "Harbor", "Meridian", "Summit", "Vertex", "Quill", "Ledger", "Beacon", "Lumen",
  "Nova", "Cove", "Delta", "Orion",
];

/** Map a layout + traits onto a browsing style category. */
function classify(layout: LayoutKind, font: "sans" | "serif" | "mono", accentBg: boolean, palKey: string): string {
  if (
    EXEC_KEYS.has(palKey) &&
    ["classic", "boxed-header", "sidebar-left", "sidebar-header", "elegant-serif"].includes(layout)
  ) {
    return "Yönetici";
  }
  if (font === "mono") return "Teknik";
  if (font === "serif") {
    if (layout === "classic") return "Klasik";
    if (layout === "elegant-serif") return "Zarif";
    return "Akademik";
  }
  switch (layout) {
    case "minimal":
    case "left-rail":
      return "Minimal";
    case "compact-two-col":
    case "top-band":
    case "boxed-header":
      return "Profesyonel";
    case "sidebar-header":
      return "Kreatif";
    case "header-banner":
    case "sidebar-left":
    case "sidebar-right":
      return accentBg ? "Kreatif" : "Modern";
    case "timeline":
      return "Modern";
    case "classic":
      return "Klasik";
    default:
      return "Modern";
  }
}

/** Deterministically generate `count` templates spread across styles & colours. */
function generate(count: number): TemplateDef[] {
  const out: TemplateDef[] = [];
  for (let i = 0; out.length < count; i++) {
    const fam = FAMILIES[i % FAMILIES.length];
    const pal = PALETTES[i % PALETTES.length];
    const heading = HEADINGS[i % HEADINGS.length];
    const font: Family["font"] =
      fam.font === "sans"
        ? i % 6 === 5
          ? "serif"
          : i % 11 === 10
          ? "mono"
          : "sans"
        : fam.font;
    const shape = PHOTO_SHAPES[i % PHOTO_SHAPES.length];
    out.push({
      id: `t-${fam.layout}-${pal.key}-${i}`,
      name: `${NAMES[i % NAMES.length]} ${pal.name}`,
      layout: fam.layout,
      accent: pal.hex,
      font,
      category: classify(fam.layout, font, !!fam.accentBg, pal.key),
      headingStyle: heading,
      uppercaseHeadings: i % 2 === 0,
      showPhoto: fam.showPhoto,
      accentBg: fam.accentBg,
      photoShape: shape,
    });
  }
  return out;
}

export const TEMPLATES: TemplateDef[] = [...CURATED, ...generate(268)];

/** Style categories present in the catalog, in a curated display order. */
export const CATEGORIES: string[] = CATEGORY_ORDER.filter((c) =>
  TEMPLATES.some((t) => t.category === c)
);

export function getTemplate(id: string): TemplateDef {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}
