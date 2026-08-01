"use client";

import React, { useEffect, useRef, useState } from "react";
import { Download, Share2, Loader2 } from "lucide-react";
import { useCV } from "@/lib/store";
import { t } from "@/lib/i18n";
import { getTemplate } from "@/lib/templates";
import CVRenderer from "@/components/cv/CVRenderer";
import { generatePdfBlob, downloadBlob, safeFileName, canShareFiles } from "@/lib/pdf";

/**
 * Download / Share the CV as a real A4 PDF. Works on desktop and mobile — on
 * phones the Share button hands the PDF file to the native share sheet
 * (WhatsApp, Mail, AirDrop, …) via the Web Share API.
 *
 * We capture an off-screen, natural-size render of the CV (not the scaled
 * preview) so the PDF is always full A4 resolution regardless of the on-screen
 * fit-to-width scaling.
 */
export default function ExportMenu() {
  const s = useCV();
  const tr = t(s.uiLang);
  const tpl = getTemplate(s.templateId);
  const accent = s.accentOverride ?? tpl.accent;

  const holderRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<null | "download" | "share">(null);
  const [shareable, setShareable] = useState(false);

  useEffect(() => setShareable(canShareFiles()), []);

  const captureNode = () =>
    holderRef.current?.querySelector(".cv-page") as HTMLElement | null;

  const onDownload = async () => {
    const node = captureNode();
    if (!node || busy) return;
    setBusy("download");
    try {
      const blob = await generatePdfBlob(node);
      downloadBlob(blob, safeFileName(s.data.contact.fullName));
    } catch (e) {
      console.error(e);
      alert(tr.pdfError);
    } finally {
      setBusy(null);
    }
  };

  const onShare = async () => {
    const node = captureNode();
    if (!node || busy) return;
    setBusy("share");
    try {
      const blob = await generatePdfBlob(node);
      const file = new File([blob], safeFileName(s.data.contact.fullName), {
        type: "application/pdf",
      });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: tr.pdfShareTitle,
          text: tr.pdfShareText,
        });
      } else {
        downloadBlob(blob, file.name);
      }
    } catch (e) {
      // Cancelling the native share sheet throws AbortError — that's fine.
      if ((e as { name?: string })?.name !== "AbortError") {
        console.error(e);
        alert(tr.pdfError);
      }
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      {shareable && (
        <button
          onClick={onShare}
          disabled={!!busy}
          title={tr.sharePdf}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-60"
        >
          {busy === "share" ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Share2 size={14} />
          )}
          <span className="hidden sm:inline">{tr.sharePdf}</span>
        </button>
      )}

      <button
        onClick={onDownload}
        disabled={!!busy}
        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-soft transition hover:bg-brand-700 disabled:opacity-70"
      >
        {busy === "download" ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Download size={14} />
        )}
        {busy === "download" ? tr.preparingPdf : tr.downloadPdf}
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
