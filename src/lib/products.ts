/**
 * Fino Premium Touch catalog data.
 *
 * One premium Japanese hair-care line of 5 products, distributed by MJQ.
 * Each product carries the data printed on the trade sheet: EAN barcode,
 * country of origin, units per carton (CRT size) and retail unit size.
 * Prices are filled in once provided (`price` is optional until then).
 */

export type Product = {
  /** url + dom id, e.g. "hair-mask" */
  id: string;
  /** short display name, e.g. "Hair Mask" */
  name: string;
  /** full product name as printed on the pack */
  fullName: string;
  /** one-line description for the section intro */
  tagline: string;
  /** EAN barcode */
  barcode: string;
  /** country of origin */
  origin: string;
  /** units per carton (CRT size) */
  cartonSize: number;
  /** retail unit size, e.g. "230 gm" / "550 ML" */
  size: string;
  /** retail price — filled in once provided */
  price?: string;
  /** accent colour used by the spec sheet + dock badge */
  accent: string;
  /** real pack image (placeholder is used while undefined) */
  image?: string;
};

export const brand = {
  name: "Fino",
  line: "Premium Touch",
  origin: "Japan",
  distributor: "MJQ",
} as const;

export const products: Product[] = [
  {
    id: "hair-mask",
    name: "Hair Mask",
    fullName: "Fino Premium Touch Hair Mask",
    tagline:
      "An intensive penetrating beauty-serum mask for smooth, lustrous hair.",
    barcode: "4901872837144",
    origin: "Japan",
    cartonSize: 36,
    size: "230 gm",
    price: "82 AED",
    accent: "#b3315f",
    image: "/products/hair-mask.webp",
  },
  {
    id: "hair-oil",
    name: "Hair Oil",
    fullName: "Fino Premium Touch Hair Oil",
    tagline:
      "A rich serum hair oil that concentrates on repairing damage for silky strands.",
    barcode: "4901872471997",
    origin: "Japan",
    cartonSize: 36,
    size: "70 ML",
    price: "99 AED",
    accent: "#c2185b",
    image: "/products/hair-oil.webp",
  },
  {
    id: "shampoo",
    name: "Shampoo",
    fullName: "Fino Premium Touch Shampoo",
    tagline:
      "A moist-repair shampoo formulated with beauty serum to cleanse and nourish.",
    barcode: "4550516475961",
    origin: "Japan",
    cartonSize: 9,
    size: "550 ML",
    price: "89 AED",
    accent: "#a61e4d",
    image: "/products/shampoo.webp",
  },
  {
    id: "conditioner",
    name: "Conditioner",
    fullName: "Fino Premium Touch Conditioner",
    tagline:
      "A moist conditioner that wraps hair in beauty serum for a supple, soft finish.",
    barcode: "4550516476074",
    origin: "Japan",
    cartonSize: 9,
    size: "550 ML",
    price: "89 AED",
    accent: "#c13a6a",
    image: "/products/conditioner.avif",
  },
  {
    id: "hair-oil-airy",
    name: "Hair Oil — Airy Smooth",
    fullName: "Fino Premium Touch Hair Oil (Airy Smooth)",
    tagline:
      "A lightweight hair-oil serum for an airy, smooth, weightless touch.",
    barcode: "4550516483836",
    origin: "Japan",
    cartonSize: 36,
    size: "70 ML",
    price: "99 AED",
    accent: "#d6336c",
    image: "/products/hair-oil-airy.webp",
  },
];
