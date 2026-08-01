/**
 * Client-side PDF export for the rendered CV page.
 *
 * We rasterise the natural-size `.cv-page` node with html2canvas and place it
 * into an A4 jsPDF document, splitting across pages when the CV is taller than
 * one page. Everything runs in the browser, so the resulting PDF can be
 * downloaded *and* shared (Web Share API) on mobile without any backend.
 */

const A4_W = 595.28; // pt
const A4_H = 841.89; // pt

async function renderCanvas(node: HTMLElement): Promise<HTMLCanvasElement> {
  const html2canvas = (await import("html2canvas")).default;
  return html2canvas(node, {
    scale: Math.min(3, Math.max(2, (window.devicePixelRatio || 1) * 2)),
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    windowWidth: node.scrollWidth,
    windowHeight: node.scrollHeight,
  });
}

export async function generatePdfBlob(node: HTMLElement): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const canvas = await renderCanvas(node);

  const pdf = new jsPDF({ unit: "pt", format: "a4", compress: true });
  const imgData = canvas.toDataURL("image/jpeg", 0.92);

  const imgW = A4_W;
  const imgH = (canvas.height * imgW) / canvas.width;

  if (imgH <= A4_H + 1) {
    pdf.addImage(imgData, "JPEG", 0, 0, imgW, imgH, undefined, "FAST");
  } else {
    // Draw the full-height image once per page, shifted up; jsPDF clips to the
    // page box so each page shows the next A4-height slice.
    let y = 0;
    while (y < imgH - 1) {
      pdf.addImage(imgData, "JPEG", 0, -y, imgW, imgH, undefined, "FAST");
      y += A4_H;
      if (y < imgH - 1) pdf.addPage();
    }
  }

  return pdf.output("blob");
}

export function safeFileName(name: string): string {
  const base = (name || "cv")
    .trim()
    .replace(/[^\p{L}\p{N}\-_ ]/gu, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
  return `${base || "cv"}-cvdock.pdf`;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/** True when the browser can share actual files (mainly mobile Safari/Chrome). */
export function canShareFiles(): boolean {
  if (typeof navigator === "undefined" || !("canShare" in navigator)) return false;
  try {
    const probe = new File([new Blob()], "probe.pdf", { type: "application/pdf" });
    return navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
}
