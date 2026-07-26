# Fino Premium Touch — Catalog

A single-page product catalog for **Fino Premium Touch**, the premium Japanese
hair-care line distributed by **MJQ**. Built with Next.js (App Router),
Tailwind CSS v4 and Framer Motion.

## The range

Five products, defined in [`src/lib/products.ts`](src/lib/products.ts):

| # | Product | Barcode | COO | Carton | Size | Price |
|---|---------|---------|-----|--------|------|-------|
| 1 | Hair Mask | 4550516493583 | Japan | 36 | 230 gm | 65 AED |
| 2 | Hair Oil | 4550516493590 | Japan | 36 | 70 ML | 79 AED |
| 3 | Shampoo | 4550516475961 | Japan | 9 | 550 ML | 72 AED |
| 4 | Conditioner | 4550516476074 | Japan | 9 | 550 ML | 72 AED |
| 5 | Hair Oil — Airy Smooth | 4550516483836 | Japan | 36 | 70 ML | 79 AED |

Prices are optional (`price` field) and shown as "On request" until provided.

## Features

- **Hero** with an interactive product accordion and a one-click vector **PDF
  catalog** download (trade table — see [`generate-catalog-pdf.ts`](src/lib/generate-catalog-pdf.ts)).
- **Per-product sections** with a flip card: pack on the front, full spec sheet
  (barcode, origin, carton, size, price) on the back.
- **Blog** powered by the `mjqapp` manager (set `MJQAPP_BRAND=fino`); falls back
  to bundled dummy posts until the API is configured. See `.env.local.example`.
- macOS-style **dock** for quick navigation.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Blog / CMS

Copy `.env.local.example` to `.env.local` and fill in the `mjqapp` manager
values. The catalog shows posts for the `fino` brand.
