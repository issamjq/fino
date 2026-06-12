import { brand, products } from "@/lib/products";

/**
 * Builds a real (vector) PDF of the Fino Premium Touch catalog by *drawing* it
 * with the jsPDF API — NOT by screenshotting HTML. Text stays vector and pack
 * images are embedded at full resolution, so it's sharp at any zoom. One
 * continuous page, one-click download, no print dialog.
 *
 * Layout: header → a row of product cards → the trade table
 * (SI No · Barcode · Description · COO · CRT Size · Size · Price) → contact.
 */

const W = 800; // page width in px units
const PAD = 40;
const contentW = W - PAD * 2; // 720
const FINO = "#c2185b";

// ── product card row ──
const CARD_GAP = 12;
const CARD_COLS = products.length;
const cardW = (contentW - CARD_GAP * (CARD_COLS - 1)) / CARD_COLS;
const cardImgH = cardW;
const cardH = cardImgH + 30;

// ── trade table ──
const COLS: { key: string; label: string; w: number; align: "left" | "center" }[] = [
  { key: "si", label: "SI", w: 38, align: "center" },
  { key: "barcode", label: "Barcode", w: 118, align: "left" },
  { key: "desc", label: "Description", w: 252, align: "left" },
  { key: "coo", label: "COO", w: 58, align: "center" },
  { key: "crt", label: "CRT", w: 60, align: "center" },
  { key: "size", label: "Size", w: 86, align: "center" },
  { key: "price", label: "Price", w: 110, align: "center" },
];
const ROW_H = 34;

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

  // ── measure total height for a single continuous page ──
  const HEADER_H = 110;
  const CARD_BLOCK = cardH + 30;
  const TABLE_H = ROW_H * (products.length + 1) + 20;
  const FOOTER_H = 90;
  const totalH = Math.round(
    PAD + HEADER_H + CARD_BLOCK + TABLE_H + FOOTER_H + PAD
  );

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [W, totalH],
    compress: true,
  });

  // ── header ──
  let cy = PAD;
  pdf.setTextColor("#6b7280");
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text("DISTRIBUTED BY MJQ", PAD, cy + 10);

  pdf.setTextColor(FINO);
  pdf.setFont("times", "italic");
  pdf.setFontSize(44);
  pdf.text("fino", PAD, cy + 54);
  pdf.setFont("times", "normal");
  pdf.setFontSize(12);
  pdf.setTextColor(FINO);
  pdf.text("P R E M I U M   T O U C H", PAD + 4, cy + 74);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor("#6b7280");
  pdf.text(
    `Premium Japanese hair care  ·  ${products.length} products  ·  made in ${brand.origin}`,
    PAD,
    cy + 96
  );
  cy += HEADER_H;

  // ── product cards ──
  products.forEach((product, i) => {
    const x = PAD + i * (cardW + CARD_GAP);
    pdf.setDrawColor("#f0dde6");
    pdf.setFillColor("#ffffff");
    pdf.roundedRect(x, cy, cardW, cardH, 8, 8, "FD");

    const im = product.image ? pics[product.image] : null;
    if (im) {
      const ar = im.w / im.h;
      const boxW = cardW - 16;
      const boxH = cardImgH - 12;
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
        cy + 8 + (boxH - dh) / 2,
        dw,
        dh
      );
    }
    pdf.setTextColor("#0a0a0a");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.text(product.name, x + cardW / 2, cy + cardImgH + 16, {
      align: "center",
      maxWidth: cardW - 8,
    });
  });
  cy += CARD_BLOCK;

  // ── trade table ──
  const cellX = (idx: number) =>
    PAD + COLS.slice(0, idx).reduce((s, c) => s + c.w, 0);

  // header row
  pdf.setFillColor("#0a0a0a");
  pdf.roundedRect(PAD, cy, contentW, ROW_H, 6, 6, "F");
  pdf.setTextColor("#ffffff");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  COLS.forEach((col, idx) => {
    const x = cellX(idx);
    const tx = col.align === "center" ? x + col.w / 2 : x + 10;
    pdf.text(col.label, tx, cy + ROW_H / 2 + 3, { align: col.align });
  });
  cy += ROW_H;

  // body rows
  products.forEach((product, i) => {
    if (i % 2 === 1) {
      pdf.setFillColor("#fdf4f8");
      pdf.rect(PAD, cy, contentW, ROW_H, "F");
    }
    pdf.setDrawColor("#f0dde6");
    pdf.line(PAD, cy + ROW_H, PAD + contentW, cy + ROW_H);

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
      const tx = col.align === "center" ? x + col.w / 2 : x + 10;
      if (col.key === "desc") {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor("#0a0a0a");
        pdf.setFontSize(8.5);
      } else if (col.key === "price") {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(product.price ? "#0a0a0a" : "#9ca3af");
        pdf.setFontSize(8.5);
      } else {
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor("#374151");
        pdf.setFontSize(8.5);
      }
      pdf.text(values[col.key], tx, cy + ROW_H / 2 + 3, {
        align: col.align,
        maxWidth: col.w - 14,
      });
    });
    cy += ROW_H;
  });
  cy += 28;

  // ── footer ──
  pdf.setDrawColor("#f0dde6");
  pdf.line(PAD, cy, PAD + contentW, cy);
  cy += 24;
  const mjq = pics["/mjq-logo.avif"];
  if (mjq) {
    const mh = 22;
    const mw = (mjq.w / mjq.h) * mh;
    pdf.addImage(mjq.url, "PNG", W / 2 - mw / 2, cy - 6, mw, mh);
    cy += mh;
  }
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(15);
  pdf.setTextColor("#0a0a0a");
  pdf.text("Fino Premium Touch, distributed by MJQ.", W / 2, cy + 12, {
    align: "center",
  });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor("#6b7280");
  pdf.text(
    "+971 52 288 5649     ·     mk@mjqinvestment.com     ·     mjqinvestment.com",
    W / 2,
    cy + 30,
    { align: "center" }
  );

  pdf.save("Fino-Premium-Touch-Catalog.pdf");
}
