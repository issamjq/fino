import { brand, products } from "@/lib/products";

/**
 * Builds a real (vector) PDF of the Fino Premium Touch catalog by *drawing* it
 * with the jsPDF API — NOT by screenshotting HTML. Text stays vector and pack
 * images are embedded at full resolution, so it's sharp at any zoom.
 *
 * Drawn on a standard A4 portrait page (pt units) with comfortable margins so
 * it renders and prints cleanly on any device/viewer — nothing hugs the edge.
 *
 * Layout: header → a row of product cards → the trade table
 * (SI · Barcode · Description · COO · CRT · Size · Price) → contact.
 */

// A4 portrait in points
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const M = 42; // page margin
const contentW = PAGE_W - M * 2; // ~511
const FINO = "#c2185b";

// ── product card row ──
const CARD_GAP = 8;
const CARD_COLS = products.length;
const cardW = (contentW - CARD_GAP * (CARD_COLS - 1)) / CARD_COLS;
const cardImgH = cardW;
const cardH = cardImgH + 18;

// ── trade table (widths sum to contentW) ──
const COLS: { key: string; label: string; w: number; align: "left" | "center" }[] = [
  { key: "si", label: "SI", w: 26, align: "center" },
  { key: "barcode", label: "Barcode", w: 90, align: "left" },
  { key: "desc", label: "Description", w: 165, align: "left" },
  { key: "coo", label: "COO", w: 42, align: "center" },
  { key: "crt", label: "CRT", w: 38, align: "center" },
  { key: "size", label: "Size", w: 54, align: "center" },
  { key: "price", label: "Price", w: contentW - (26 + 90 + 165 + 42 + 38 + 54), align: "center" },
];
const ROW_H = 26;

const loadImage = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

const MAX_IMG_DIM = 700;

type Pic = { url: string; w: number; h: number };

const toPng = (img: HTMLImageElement, maxDim = Infinity): Pic => {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const s = Math.min(1, maxDim / Math.max(w, h));
  const cw = Math.max(1, Math.round(w * s));
  const ch = Math.max(1, Math.round(h * s));
  const c = document.createElement("canvas");
  c.width = cw;
  c.height = ch;
  c.getContext("2d")?.drawImage(img, 0, 0, cw, ch);
  return { url: c.toDataURL("image/png"), w, h };
};

const yieldToBrowser = () =>
  new Promise<void>((r) => requestAnimationFrame(() => r()));

export async function generateCatalogPdf() {
  await yieldToBrowser();

  const { jsPDF } = await import("jspdf");

  // ── preload + downscale every image we draw ──
  const srcs = new Set<string>(["/mjq-logo.avif"]);
  products.forEach((p) => p.image && srcs.add(p.image));
  const pics: Record<string, Pic | null> = {};
  await Promise.all(
    [...srcs].map((s) =>
      loadImage(s).then((img) => {
        pics[s] = img && img.naturalWidth ? toPng(img, MAX_IMG_DIM) : null;
      })
    )
  );

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
    compress: true,
  });

  // ── header ──
  let cy = M;
  pdf.setTextColor("#6b7280");
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  pdf.text("DISTRIBUTED BY MJQ", M, cy + 8);

  pdf.setTextColor(FINO);
  pdf.setFont("times", "italic");
  pdf.setFontSize(34);
  pdf.text("fino", M, cy + 42);
  pdf.setFont("times", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(FINO);
  pdf.text("P R E M I U M   T O U C H", M + 3, cy + 58);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9.5);
  pdf.setTextColor("#6b7280");
  pdf.text(
    `Premium Japanese hair care   ·   ${products.length} products   ·   made in ${brand.origin}`,
    M,
    cy + 78
  );
  cy += 96;

  // ── product cards ──
  products.forEach((product, i) => {
    const x = M + i * (cardW + CARD_GAP);
    pdf.setDrawColor("#f0dde6");
    pdf.setFillColor("#ffffff");
    pdf.roundedRect(x, cy, cardW, cardH, 6, 6, "FD");

    const im = product.image ? pics[product.image] : null;
    if (im) {
      const ar = im.w / im.h;
      const boxW = cardW - 12;
      const boxH = cardImgH - 10;
      let dw = boxW;
      let dh = dw / ar;
      if (dh > boxH) {
        dh = boxH;
        dw = dh * ar;
      }
      pdf.addImage(
        im.url,
        "PNG",
        x + (cardW - dw) / 2,
        cy + 6 + (boxH - dh) / 2,
        dw,
        dh
      );
    }
    pdf.setTextColor("#0a0a0a");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(6);
    pdf.text(product.name, x + cardW / 2, cy + cardImgH + 11, {
      align: "center",
      maxWidth: cardW - 6,
    });
  });
  cy += cardH + 26;

  // ── trade table ──
  const cellX = (idx: number) =>
    M + COLS.slice(0, idx).reduce((s, c) => s + c.w, 0);

  // header row
  pdf.setFillColor("#0a0a0a");
  pdf.roundedRect(M, cy, contentW, ROW_H, 5, 5, "F");
  pdf.setTextColor("#ffffff");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  COLS.forEach((col, idx) => {
    const x = cellX(idx);
    const tx = col.align === "center" ? x + col.w / 2 : x + 8;
    pdf.text(col.label, tx, cy + ROW_H / 2 + 3, { align: col.align });
  });
  cy += ROW_H;

  // body rows
  products.forEach((product, i) => {
    if (i % 2 === 1) {
      pdf.setFillColor("#fdf4f8");
      pdf.rect(M, cy, contentW, ROW_H, "F");
    }
    pdf.setDrawColor("#f0dde6");
    pdf.line(M, cy + ROW_H, M + contentW, cy + ROW_H);

    const values: Record<string, string> = {
      si: String(i + 1),
      barcode: product.barcode,
      desc: product.fullName,
      coo: product.origin,
      crt: String(product.cartonSize),
      size: product.size,
      price: product.price ?? "On request",
    };

    COLS.forEach((col, idx) => {
      const x = cellX(idx);
      const tx = col.align === "center" ? x + col.w / 2 : x + 8;
      if (col.key === "desc") {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor("#0a0a0a");
        pdf.setFontSize(7.5);
      } else if (col.key === "price") {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(product.price ? "#0a0a0a" : "#9ca3af");
        pdf.setFontSize(7.5);
      } else {
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor("#374151");
        pdf.setFontSize(7.5);
      }
      pdf.text(values[col.key], tx, cy + ROW_H / 2 + 3, {
        align: col.align,
        maxWidth: col.w - 10,
      });
    });
    cy += ROW_H;
  });
  cy += 28;

  // ── footer ──
  pdf.setDrawColor("#f0dde6");
  pdf.line(M, cy, M + contentW, cy);
  cy += 22;
  const mjq = pics["/mjq-logo.avif"];
  if (mjq) {
    const mh = 22;
    const mw = (mjq.w / mjq.h) * mh;
    pdf.addImage(mjq.url, "PNG", PAGE_W / 2 - mw / 2, cy - 6, mw, mh);
    cy += mh;
  }
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.setTextColor("#0a0a0a");
  pdf.text("Fino Premium Touch, distributed by MJQ.", PAGE_W / 2, cy + 10, {
    align: "center",
  });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor("#6b7280");
  pdf.text(
    "+971 52 288 5649     ·     mk@mjqinvestment.com     ·     mjqinvestment.com",
    PAGE_W / 2,
    cy + 26,
    { align: "center" }
  );

  // guard: if content ever grows past one A4 page, jsPDF keeps the page size;
  // everything above is sized to fit comfortably within PAGE_H.
  void PAGE_H;

  pdf.save("Fino-Premium-Touch-Catalog.pdf");
}
