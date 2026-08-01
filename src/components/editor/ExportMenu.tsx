"use client";

import React, { useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useCV } from "@/lib/store";
import { t } from "@/lib/i18n";
import { getTemplate } from "@/lib/templates";
import CVRenderer from "@/components/cv/CVRenderer";
import { generatePdfBlob, downloadBlob, safeFileName } from "@/lib/pdf";

/**
 * Export the CV as a real A4 PDF.
 *
 * Delivery adapts to the platform, because the `<a download>` trick is ignored
 * on mobile (iOS Safari opens the PDF inline instead of saving it):
 *   • Touch devices with file-sharing  → hand the real file to the OS share
 *     sheet, which offers "Save to Files" *and* every share target.
 *   • Everything else (desktop)         → a direct file download.
 *
 * We capture an off-screen, natural-size render of the CV (not the scaled
 * preview) so the PDF is always full A4 resolution.
 */
export default function ExportMenu() {
  const s = useCV();
  const tr = t(s.uiLang);
  const tpl = getTemplate(s.templateId);
  const accent = s.accentOverride ?? tpl.accent;

  const holderRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  const captureNode = () =>
    holderRef.current?.querySelector(".cv-page") as HTMLElement | null;

  const onExport = async () => {
    const node = captureNode();
    if (!node || busy) return;
    setBusy(true);
    try {
      const blob = await generatePdfBlob(node);
      const filename = safeFileName(s.data.contact.fullName);
      const file = new File([blob], filename, { type: "application/pdf" });

      const isTouch =
        typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(pointer: coarse)").matches;
      const canShare =
        typeof navigator !== "undefined" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] });

      if (isTouch && canShare) {
        try {
          await navigator.share({
            files: [file],
            title: tr.pdfShareTitle,
            text: tr.pdfShareText,
          });
          return;
        } catch (err) {
          // User dismissed the share sheet — don't fall through to a download.
          if ((err as { name?: string })?.name === "AbortError") return;
          // Any other share failure: fall back to a direct download.
        }
      }
      downloadBlob(blob, filename);
    } catch (e) {
      console.error(e);
      alert(tr.pdfError);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={onExport}
        disabled={busy}
        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-soft transition hover:bg-brand-700 disabled:opacity-70"
      >
        {busy ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        {busy ? tr.preparingPdf : tr.downloadPdf}
      </button>

      {/* Off-screen, natural-size capture source for the PDF. */}
      <div
        ref={holderRef}
        aria-hidden
        className="pointer-events-none fixed left-[-10000px] top-0 -z-10"
      >
        <CVRenderer data={s.data} tpl={tpl} accent={accent} lang={s.cvLang} />
      </div>
    </>
  );
}
