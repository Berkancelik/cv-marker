import React from "react";
import { CVData, TemplateDef, Lang } from "@/lib/types";
import {
  RenderCtx,
  ContactList,
  SummaryBlock,
  ExperienceBlock,
  EducationBlock,
  ProjectsBlock,
  SkillsBlock,
  LanguagesBlock,
  CertificatesBlock,
  Photo,
  hexToRgba,
} from "./blocks";

interface Props {
  data: CVData;
  tpl: TemplateDef;
  accent: string;
  lang: Lang;
}

function NameHeader({ ctx, center = false, light = true }: { ctx: RenderCtx; center?: boolean; light?: boolean }) {
  const c = ctx.data.contact;
  return (
    <div className={center ? "text-center" : ""}>
      <h1
        className="text-[26px] font-bold leading-tight"
        style={{ color: light ? "#0f172a" : "#fff" }}
      >
        {c.fullName || "—"}
      </h1>
      {c.title && (
        <p
          className="text-[13px] font-medium mt-0.5"
          style={{ color: light ? ctx.accent : "rgba(255,255,255,0.9)" }}
        >
          {c.title}
        </p>
      )}
    </div>
  );
}

export default function CVRenderer({ data, tpl, accent, lang }: Props) {
  const ctx: RenderCtx = { data, tpl, accent, lang };
  const fontClass =
    tpl.font === "serif" ? "font-serif" : tpl.font === "mono" ? "font-mono" : "font-sans";

  const mainColumn = (
    <>
      <SummaryBlock ctx={ctx} />
      <ExperienceBlock ctx={ctx} />
      <EducationBlock ctx={ctx} />
      <ProjectsBlock ctx={ctx} />
    </>
  );

  const sideColumn = (light: boolean) => (
    <>
      <ContactList ctx={ctx} onLight={light} />
      <div className="mt-5" />
      <SkillsBlock ctx={ctx} onLight={light} />
      <LanguagesBlock ctx={ctx} onLight={light} />
      <CertificatesBlock ctx={ctx} onLight={light} />
    </>
  );

  // ---- Layout: sidebar-left / sidebar-right ----
  if (tpl.layout === "sidebar-left" || tpl.layout === "sidebar-right") {
    const filled = !!tpl.accentBg;
    const sideLight = !filled; // if filled bg, content is on dark
    const sidebar = (
      <aside
        className="w-[34%] p-7 shrink-0"
        style={
          filled
            ? { background: accent, color: "#fff" }
            : { background: hexToRgba(accent, 0.07) }
        }
      >
        {tpl.showPhoto && (
          <div className="flex justify-center mb-5">
            <Photo ctx={ctx} size={104} />
          </div>
        )}
        {sideColumn(sideLight)}
      </aside>
    );
    const main = (
      <div className="flex-1 p-8">
        <NameHeader ctx={ctx} />
        <div className="mt-5">{mainColumn}</div>
      </div>
    );
    return (
      <div className={`cv-page flex ${fontClass}`}>
        {tpl.layout === "sidebar-left" ? (
          <>
            {sidebar}
            {main}
          </>
        ) : (
          <>
            {main}
            {sidebar}
          </>
        )}
      </div>
    );
  }

  // ---- Layout: sidebar-header (name + photo live inside the colored sidebar) ----
  if (tpl.layout === "sidebar-header") {
    const filled = !!tpl.accentBg;
    const sideLight = !filled;
    return (
      <div className={`cv-page flex ${fontClass}`}>
        <aside
          className="w-[36%] p-7 shrink-0"
          style={filled ? { background: accent, color: "#fff" } : { background: hexToRgba(accent, 0.08) }}
        >
          <div className="flex flex-col items-center text-center mb-5">
            {tpl.showPhoto && <Photo ctx={ctx} size={108} />}
            <h1
              className="mt-3 text-[21px] font-bold leading-tight"
              style={{ color: sideLight ? "#0f172a" : "#fff" }}
            >
              {data.contact.fullName || "—"}
            </h1>
            {data.contact.title && (
              <p
                className="text-[12px] font-medium mt-0.5"
                style={{ color: sideLight ? accent : "rgba(255,255,255,0.9)" }}
              >
                {data.contact.title}
              </p>
            )}
          </div>
          <ContactList ctx={ctx} onLight={sideLight} />
          <div className="mt-5" />
          <SkillsBlock ctx={ctx} onLight={sideLight} />
          <LanguagesBlock ctx={ctx} onLight={sideLight} />
          <CertificatesBlock ctx={ctx} onLight={sideLight} />
        </aside>
        <div className="flex-1 p-8">{mainColumn}</div>
      </div>
    );
  }

  // ---- Layout: top-band (thin full-width accent band, centered name) ----
  if (tpl.layout === "top-band") {
    return (
      <div className={`cv-page ${fontClass}`}>
        <div className="px-10 py-6 text-center" style={{ background: accent }}>
          <h1 className="text-[26px] font-bold leading-tight text-white">
            {data.contact.fullName || "—"}
          </h1>
          {data.contact.title && (
            <p className="text-[13px] mt-0.5" style={{ color: "rgba(255,255,255,0.9)" }}>
              {data.contact.title}
            </p>
          )}
        </div>
        <div className="px-10 py-3 border-b border-slate-100">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-gray-600">
            {[
              data.contact.email,
              data.contact.phone,
              data.contact.location,
              data.contact.website,
              data.contact.linkedin,
              data.contact.github,
            ]
              .filter(Boolean)
              .map((v, i) => (
                <span key={i}>{v}</span>
              ))}
          </div>
        </div>
        <div className="px-10 py-7">
          <SummaryBlock ctx={ctx} />
          <ExperienceBlock ctx={ctx} />
          <EducationBlock ctx={ctx} />
          <div className="grid grid-cols-2 gap-x-10">
            <div>
              <SkillsBlock ctx={ctx} />
              <ProjectsBlock ctx={ctx} />
            </div>
            <div>
              <LanguagesBlock ctx={ctx} />
              <CertificatesBlock ctx={ctx} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- Layout: left-rail (thin accent rail on the far-left edge) ----
  if (tpl.layout === "left-rail") {
    return (
      <div className={`cv-page flex ${fontClass}`}>
        <div className="w-2.5 shrink-0" style={{ background: accent }} />
        <div className="flex-1 px-10 py-9">
          <header className="mb-5">
            <div className="flex items-end justify-between gap-6">
              <NameHeader ctx={ctx} />
              <div className="max-w-[48%]">
                <ContactList ctx={ctx} />
              </div>
            </div>
          </header>
          <SummaryBlock ctx={ctx} />
          <ExperienceBlock ctx={ctx} />
          <EducationBlock ctx={ctx} />
          <div className="grid grid-cols-2 gap-x-10">
            <div>
              <SkillsBlock ctx={ctx} />
              <ProjectsBlock ctx={ctx} />
            </div>
            <div>
              <LanguagesBlock ctx={ctx} />
              <CertificatesBlock ctx={ctx} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- Layout: boxed-header (name in a filled header box, two-column body) ----
  if (tpl.layout === "boxed-header") {
    return (
      <div className={`cv-page p-8 ${fontClass}`}>
        <header
          className="mb-6 flex items-center gap-5 rounded-xl px-6 py-5"
          style={{ background: hexToRgba(accent, 0.1), borderLeft: `5px solid ${accent}` }}
        >
          {tpl.showPhoto && <Photo ctx={ctx} size={84} />}
          <div className="flex-1">
            <NameHeader ctx={ctx} />
          </div>
          <div className="max-w-[42%]">
            <ContactList ctx={ctx} />
          </div>
        </header>
        <div className="grid grid-cols-[1.7fr_1fr] gap-8">
          <div>
            <SummaryBlock ctx={ctx} />
            <ExperienceBlock ctx={ctx} />
            <ProjectsBlock ctx={ctx} />
          </div>
          <div>
            <EducationBlock ctx={ctx} />
            <SkillsBlock ctx={ctx} />
            <LanguagesBlock ctx={ctx} />
            <CertificatesBlock ctx={ctx} />
          </div>
        </div>
      </div>
    );
  }

  // ---- Layout: header-banner ----
  if (tpl.layout === "header-banner") {
    const filled = !!tpl.accentBg;
    return (
      <div className={`cv-page ${fontClass}`}>
        <header
          className="px-8 py-7 flex items-center gap-6"
          style={
            filled
              ? { background: accent, color: "#fff" }
              : { borderBottom: `4px solid ${accent}`, background: hexToRgba(accent, 0.06) }
          }
        >
          {tpl.showPhoto && <Photo ctx={ctx} size={92} />}
          <div className="flex-1">
            <NameHeader ctx={ctx} light={!filled} />
          </div>
          <div className="max-w-[40%]">
            <ContactList ctx={ctx} onLight={!filled} />
          </div>
        </header>
        <div className="flex">
          <div className="flex-1 p-8 pr-5">
            {mainColumn}
          </div>
          <div className="w-[32%] p-8 pl-3">
            <SkillsBlock ctx={ctx} />
            <LanguagesBlock ctx={ctx} />
            <CertificatesBlock ctx={ctx} />
          </div>
        </div>
      </div>
    );
  }

  // ---- Layout: timeline ----
  if (tpl.layout === "timeline") {
    return (
      <div className={`cv-page p-9 ${fontClass}`}>
        <header className="flex items-center justify-between gap-6 mb-6">
          <NameHeader ctx={ctx} />
          <div className="max-w-[45%]">
            <ContactList ctx={ctx} />
          </div>
        </header>
        <div
          className="h-1 w-full rounded-full mb-6"
          style={{ background: hexToRgba(accent, 0.2) }}
        />
        <SummaryBlock ctx={ctx} />
        <ExperienceBlock ctx={ctx} timeline />
        <EducationBlock ctx={ctx} />
        <div className="grid grid-cols-2 gap-x-8">
          <div>
            <SkillsBlock ctx={ctx} />
            <ProjectsBlock ctx={ctx} />
          </div>
          <div>
            <LanguagesBlock ctx={ctx} />
            <CertificatesBlock ctx={ctx} />
          </div>
        </div>
      </div>
    );
  }

  // ---- Layout: minimal ----
  if (tpl.layout === "minimal") {
    return (
      <div className={`cv-page px-12 py-10 ${fontClass}`}>
        <header className="mb-6 text-center">
          <NameHeader ctx={ctx} center />
          <div className="mt-3 flex justify-center">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-gray-600 max-w-[90%]">
              {[
                data.contact.email,
                data.contact.phone,
                data.contact.location,
                data.contact.website,
                data.contact.linkedin,
                data.contact.github,
              ]
                .filter(Boolean)
                .map((v, i) => (
                  <span key={i}>{v}</span>
                ))}
            </div>
          </div>
          <div className="mt-4 mx-auto w-16 h-0.5" style={{ background: accent }} />
        </header>
        <SummaryBlock ctx={ctx} />
        <ExperienceBlock ctx={ctx} />
        <EducationBlock ctx={ctx} />
        <ProjectsBlock ctx={ctx} />
        <div className="grid grid-cols-2 gap-x-10">
          <SkillsBlock ctx={ctx} />
          <div>
            <LanguagesBlock ctx={ctx} />
            <CertificatesBlock ctx={ctx} />
          </div>
        </div>
      </div>
    );
  }

  // ---- Layout: compact-two-col ----
  if (tpl.layout === "compact-two-col") {
    return (
      <div className={`cv-page p-9 ${fontClass}`}>
        <header
          className="mb-5 pb-4"
          style={{ borderBottom: `2px solid ${hexToRgba(accent, 0.25)}` }}
        >
          <NameHeader ctx={ctx} />
        </header>
        <div className="grid grid-cols-[1.6fr_1fr] gap-8">
          <div>
            <SummaryBlock ctx={ctx} />
            <ExperienceBlock ctx={ctx} />
            <ProjectsBlock ctx={ctx} />
          </div>
          <div>
            <ContactList ctx={ctx} />
            <div className="mt-5" />
            <EducationBlock ctx={ctx} />
            <SkillsBlock ctx={ctx} />
            <LanguagesBlock ctx={ctx} />
            <CertificatesBlock ctx={ctx} />
          </div>
        </div>
      </div>
    );
  }

  // ---- Layout: elegant-serif ----
  if (tpl.layout === "elegant-serif") {
    return (
      <div className={`cv-page px-12 py-10 ${fontClass}`}>
        <header className="text-center mb-6">
          <h1 className="text-[30px] tracking-wide" style={{ color: "#1f2937" }}>
            {data.contact.fullName || "—"}
          </h1>
          {data.contact.title && (
            <p className="text-[13px] tracking-[0.25em] uppercase mt-1" style={{ color: accent }}>
              {data.contact.title}
            </p>
          )}
          <div className="mt-3 flex justify-center gap-x-4 flex-wrap text-[11px] text-gray-600">
            {[
              data.contact.email,
              data.contact.phone,
              data.contact.location,
              data.contact.website,
            ]
              .filter(Boolean)
              .map((v, i) => (
                <span key={i}>{v}</span>
              ))}
          </div>
          <div
            className="mt-4 mx-auto w-full h-px"
            style={{ background: hexToRgba(accent, 0.4) }}
          />
        </header>
        <SummaryBlock ctx={ctx} />
        <ExperienceBlock ctx={ctx} />
        <EducationBlock ctx={ctx} />
        <div className="grid grid-cols-2 gap-x-10">
          <div>
            <SkillsBlock ctx={ctx} />
            <ProjectsBlock ctx={ctx} />
          </div>
          <div>
            <LanguagesBlock ctx={ctx} />
            <CertificatesBlock ctx={ctx} />
          </div>
        </div>
      </div>
    );
  }

  // ---- Layout: classic (default) ----
  return (
    <div className={`cv-page p-10 ${fontClass}`}>
      <header
        className="mb-5 pb-4"
        style={{ borderBottom: `3px solid ${accent}` }}
      >
        <NameHeader ctx={ctx} />
        <div className="mt-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-600">
            {[
              data.contact.email,
              data.contact.phone,
              data.contact.location,
              data.contact.website,
              data.contact.linkedin,
              data.contact.github,
            ]
              .filter(Boolean)
              .map((v, i) => (
                <span key={i}>{v}</span>
              ))}
          </div>
        </div>
      </header>
      <SummaryBlock ctx={ctx} />
      <ExperienceBlock ctx={ctx} />
      <EducationBlock ctx={ctx} />
      <ProjectsBlock ctx={ctx} />
      <div className="grid grid-cols-2 gap-x-10">
        <SkillsBlock ctx={ctx} />
        <div>
          <LanguagesBlock ctx={ctx} />
          <CertificatesBlock ctx={ctx} />
        </div>
      </div>
    </div>
  );
}
