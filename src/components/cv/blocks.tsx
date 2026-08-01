import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
} from "lucide-react";
import { CVData, TemplateDef, Lang } from "@/lib/types";
import { t } from "@/lib/i18n";

export interface RenderCtx {
  data: CVData;
  tpl: TemplateDef;
  accent: string;
  lang: Lang;
}

export function dateRange(
  start: string,
  end: string,
  current: boolean,
  lang: Lang
): string {
  const present = t(lang).present;
  const e = current ? present : end;
  if (start && e) return `${start} — ${e}`;
  return start || e || "";
}

export function bullets(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** A section heading whose style depends on the template (headingStyle token). */
export function Heading({
  children,
  ctx,
  onLight = true,
}: {
  children: React.ReactNode;
  ctx: RenderCtx;
  onLight?: boolean;
}) {
  const { tpl, accent } = ctx;
  const style = tpl.headingStyle ?? "underline";
  const transform = tpl.uppercaseHeadings ? "uppercase" : "none";
  const text = onLight ? accent : "#ffffff";
  const base: React.CSSProperties = {
    color: text,
    textTransform: transform as React.CSSProperties["textTransform"],
    letterSpacing: tpl.uppercaseHeadings ? "0.08em" : "0.01em",
  };

  if (style === "bar") {
    return (
      <h3
        style={{
          ...base,
          borderLeft: `3px solid ${onLight ? accent : "rgba(255,255,255,0.8)"}`,
          paddingLeft: 8,
        }}
        className="text-[12.5px] font-bold mb-2.5"
      >
        {children}
      </h3>
    );
  }
  if (style === "pill") {
    return (
      <h3 className="mb-2.5">
        <span
          style={{
            ...base,
            background: onLight ? hexToRgba(accent, 0.12) : "rgba(255,255,255,0.2)",
          }}
          className="inline-block rounded-full px-3 py-0.5 text-[11.5px] font-bold"
        >
          {children}
        </span>
      </h3>
    );
  }
  if (style === "block") {
    return (
      <h3
        style={{
          color: onLight ? accent : "#fff",
          background: onLight ? hexToRgba(accent, 0.1) : "rgba(255,255,255,0.18)",
          textTransform: transform as React.CSSProperties["textTransform"],
          letterSpacing: tpl.uppercaseHeadings ? "0.08em" : "0.01em",
        }}
        className="mb-2.5 rounded-md px-2.5 py-1 text-[12px] font-bold"
      >
        {children}
      </h3>
    );
  }
  if (style === "plain") {
    return (
      <h3 style={base} className="text-[13px] font-bold mb-2">
        {children}
      </h3>
    );
  }
  if (style === "dot") {
    return (
      <h3 style={base} className="mb-2 flex items-center gap-2 text-[12.5px] font-bold">
        <span
          className="inline-block h-2 w-2 shrink-0 rounded-full"
          style={{ background: onLight ? accent : "rgba(255,255,255,0.85)" }}
        />
        {children}
      </h3>
    );
  }
  if (style === "double") {
    return (
      <h3
        style={{
          ...base,
          borderBottom: `3px double ${onLight ? hexToRgba(accent, 0.5) : "rgba(255,255,255,0.5)"}`,
        }}
        className="mb-2.5 pb-1 text-[12.5px] font-bold"
      >
        {children}
      </h3>
    );
  }
  // default: underline
  return (
    <h3
      style={{ ...base, borderColor: onLight ? hexToRgba(accent, 0.25) : "rgba(255,255,255,0.3)" }}
      className="text-[12.5px] font-bold mb-2 pb-1 border-b"
    >
      {children}
    </h3>
  );
}

export function ContactList({
  ctx,
  onLight = true,
  icons = true,
}: {
  ctx: RenderCtx;
  onLight?: boolean;
  icons?: boolean;
}) {
  const c = ctx.data.contact;
  const items: { icon: React.ReactNode; value: string }[] = [];
  const isz = 12;
  if (c.email) items.push({ icon: <Mail size={isz} />, value: c.email });
  if (c.phone) items.push({ icon: <Phone size={isz} />, value: c.phone });
  if (c.location) items.push({ icon: <MapPin size={isz} />, value: c.location });
  if (c.website) items.push({ icon: <Globe size={isz} />, value: c.website });
  if (c.linkedin) items.push({ icon: <Linkedin size={isz} />, value: c.linkedin });
  if (c.github) items.push({ icon: <Github size={isz} />, value: c.github });

  return (
    <ul className="space-y-1.5 text-[11px]" style={{ color: onLight ? "#374151" : "rgba(255,255,255,0.92)" }}>
      {items.map((it, i) => (
        <li key={i} className="flex items-center gap-2 break-all">
          {icons && <span className="shrink-0 opacity-80">{it.icon}</span>}
          <span>{it.value}</span>
        </li>
      ))}
    </ul>
  );
}

export function SummaryBlock({ ctx, onLight = true }: { ctx: RenderCtx; onLight?: boolean }) {
  if (!ctx.data.summary) return null;
  return (
    <section className="mb-5">
      <Heading ctx={ctx} onLight={onLight}>
        {t(ctx.lang).sectionSummary}
      </Heading>
      <p
        className="text-[11.5px] leading-relaxed"
        style={{ color: onLight ? "#374151" : "rgba(255,255,255,0.9)" }}
      >
        {ctx.data.summary}
      </p>
    </section>
  );
}

export function ExperienceBlock({
  ctx,
  onLight = true,
  timeline = false,
}: {
  ctx: RenderCtx;
  onLight?: boolean;
  timeline?: boolean;
}) {
  const { data, lang, accent } = ctx;
  if (data.experience.length === 0) return null;
  const sub = onLight ? "#6b7280" : "rgba(255,255,255,0.75)";
  const body = onLight ? "#374151" : "rgba(255,255,255,0.9)";
  const strong = onLight ? "#111827" : "#ffffff";
  return (
    <section className="mb-5">
      <Heading ctx={ctx} onLight={onLight}>
        {t(lang).sectionExperience}
      </Heading>
      <div className={timeline ? "relative pl-5" : ""}>
        {timeline && (
          <span
            className="absolute left-1 top-1 bottom-1 w-px"
            style={{ background: hexToRgba(accent, 0.3) }}
          />
        )}
        {data.experience.map((e) => (
          <div key={e.id} className="mb-3.5 last:mb-0 relative">
            {timeline && (
              <span
                className="absolute -left-[18px] top-1 w-2.5 h-2.5 rounded-full"
                style={{ background: accent, boxShadow: "0 0 0 3px #fff" }}
              />
            )}
            <div className="flex justify-between items-baseline gap-3">
              <p className="text-[12.5px] font-semibold" style={{ color: strong }}>
                {e.role}
              </p>
              <span className="text-[10.5px] whitespace-nowrap" style={{ color: sub }}>
                {dateRange(e.start, e.end, e.current, lang)}
              </span>
            </div>
            <p className="text-[11.5px] font-medium" style={{ color: accent }}>
              {e.company}
              {e.location ? ` · ${e.location}` : ""}
            </p>
            {bullets(e.description).length > 0 && (
              <ul className="mt-1 space-y-0.5">
                {bullets(e.description).map((b, i) => (
                  <li
                    key={i}
                    className="text-[11px] leading-snug pl-3 relative"
                    style={{ color: body }}
                  >
                    <span
                      className="absolute left-0 top-[6px] w-1 h-1 rounded-full"
                      style={{ background: accent }}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function EducationBlock({ ctx, onLight = true }: { ctx: RenderCtx; onLight?: boolean }) {
  const { data, lang, accent } = ctx;
  if (data.education.length === 0) return null;
  const sub = onLight ? "#6b7280" : "rgba(255,255,255,0.75)";
  const body = onLight ? "#374151" : "rgba(255,255,255,0.9)";
  const strong = onLight ? "#111827" : "#ffffff";
  return (
    <section className="mb-5">
      <Heading ctx={ctx} onLight={onLight}>
        {t(lang).sectionEducation}
      </Heading>
      {data.education.map((e) => (
        <div key={e.id} className="mb-2.5 last:mb-0">
          <div className="flex justify-between items-baseline gap-3">
            <p className="text-[12px] font-semibold" style={{ color: strong }}>
              {e.degree}
            </p>
            <span className="text-[10.5px] whitespace-nowrap" style={{ color: sub }}>
              {dateRange(e.start, e.end, false, lang)}
            </span>
          </div>
          <p className="text-[11.5px]" style={{ color: accent }}>
            {e.school}
            {e.location ? ` · ${e.location}` : ""}
          </p>
          {e.description && (
            <p className="text-[11px] mt-0.5" style={{ color: body }}>
              {e.description}
            </p>
          )}
        </div>
      ))}
    </section>
  );
}

export function ProjectsBlock({ ctx, onLight = true }: { ctx: RenderCtx; onLight?: boolean }) {
  const { data, lang, accent } = ctx;
  if (data.projects.length === 0) return null;
  const body = onLight ? "#374151" : "rgba(255,255,255,0.9)";
  const strong = onLight ? "#111827" : "#ffffff";
  return (
    <section className="mb-5">
      <Heading ctx={ctx} onLight={onLight}>
        {t(lang).sectionProjects}
      </Heading>
      {data.projects.map((p) => (
        <div key={p.id} className="mb-2 last:mb-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <p className="text-[12px] font-semibold" style={{ color: strong }}>
              {p.name}
            </p>
            {p.link && (
              <span className="text-[10.5px]" style={{ color: accent }}>
                {p.link}
              </span>
            )}
          </div>
          {p.description && (
            <p className="text-[11px]" style={{ color: body }}>
              {p.description}
            </p>
          )}
        </div>
      ))}
    </section>
  );
}

export function SkillsBlock({ ctx, onLight = true }: { ctx: RenderCtx; onLight?: boolean }) {
  const { data, lang, accent } = ctx;
  if (data.skills.length === 0) return null;
  return (
    <section className="mb-5">
      <Heading ctx={ctx} onLight={onLight}>
        {t(lang).sectionSkills}
      </Heading>
      <div className="flex flex-wrap gap-1.5">
        {data.skills.map((s) => (
          <span
            key={s.id}
            className="text-[10.5px] px-2 py-0.5 rounded-full"
            style={{
              background: onLight ? hexToRgba(accent, 0.1) : "rgba(255,255,255,0.18)",
              color: onLight ? accent : "#fff",
            }}
          >
            {s.name}
          </span>
        ))}
      </div>
    </section>
  );
}

export function LanguagesBlock({ ctx, onLight = true }: { ctx: RenderCtx; onLight?: boolean }) {
  const { data, lang } = ctx;
  if (data.languages.length === 0) return null;
  const textColor = onLight ? "#374151" : "rgba(255,255,255,0.92)";
  const sub = onLight ? "#6b7280" : "rgba(255,255,255,0.7)";
  return (
    <section className="mb-5">
      <Heading ctx={ctx} onLight={onLight}>
        {t(lang).sectionLanguages}
      </Heading>
      <ul className="space-y-1">
        {data.languages.map((l) => (
          <li key={l.id} className="flex justify-between text-[11.5px]" style={{ color: textColor }}>
            <span>{l.name}</span>
            <span style={{ color: sub }}>{l.level}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CertificatesBlock({ ctx, onLight = true }: { ctx: RenderCtx; onLight?: boolean }) {
  const { data, lang, accent } = ctx;
  if (data.certificates.length === 0) return null;
  const textColor = onLight ? "#111827" : "#fff";
  const sub = onLight ? "#6b7280" : "rgba(255,255,255,0.7)";
  return (
    <section className="mb-5">
      <Heading ctx={ctx} onLight={onLight}>
        {t(lang).sectionCertificates}
      </Heading>
      <ul className="space-y-1">
        {data.certificates.map((citem) => (
          <li key={citem.id} className="text-[11.5px]">
            <span style={{ color: textColor }} className="font-medium">
              {citem.name}
            </span>
            <span style={{ color: sub }}>
              {citem.issuer ? ` · ${citem.issuer}` : ""}
              {citem.date ? ` · ${citem.date}` : ""}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Photo({ ctx, size = 96 }: { ctx: RenderCtx; size?: number }) {
  const { data, accent } = ctx;
  if (!ctx.tpl.showPhoto) return null;
  const shape = ctx.tpl.photoShape ?? "round";
  const radius = shape === "round" ? "9999px" : shape === "squircle" ? "28%" : "12px";
  if (data.contact.photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={data.contact.photo}
        alt={data.contact.fullName}
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: "cover", borderRadius: radius }}
      />
    );
  }
  // initials placeholder
  const initials = data.contact.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <div
      style={{
        width: size,
        height: size,
        background: hexToRgba(accent, 0.18),
        color: accent,
        borderRadius: radius,
      }}
      className="flex items-center justify-center text-2xl font-bold"
    >
      {initials || "—"}
    </div>
  );
}
