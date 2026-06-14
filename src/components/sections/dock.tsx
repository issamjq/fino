"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Home, Mail, Phone, Globe, Newspaper } from "lucide-react";
import { products } from "@/lib/products";

type DockItem = {
  id: string;
  name: string;
  href: string;
  icon?: React.ReactNode;
  image?: string;
  /** open in a new tab (external link) */
  external?: boolean;
};

const dockItems: DockItem[] = [
  { id: "home", name: "Home", href: "#top", icon: <Home /> },
  ...products.map((p) => ({
    id: p.id,
    name: p.name,
    href: `#${p.id}`,
    image: p.image,
  })),
  { id: "blog", name: "Blog", href: "#blog", icon: <Newspaper /> },
  {
    id: "contact",
    name: "mk@mjqinvestment.com",
    href: "mailto:mk@mjqinvestment.com",
    icon: <Mail />,
  },
  {
    id: "call",
    name: "+971 52 288 5649",
    href: "tel:+971522885649",
    icon: <Phone />,
  },
  {
    id: "web",
    name: "mjqinvestment.com",
    href: "https://www.mjqinvestment.com/",
    external: true,
    icon: <Globe />,
  },
];

type Dims = { base: number; max: number; gap: number; height: number };
const DESKTOP: Dims = { base: 48, max: 78, gap: 12, height: 72 };

function DockIcon({
  item,
  mouseX,
  dims,
}: {
  item: DockItem;
  mouseX: MotionValue<number>;
  dims: Dims;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const sizeSync = useTransform(distance, [-150, 0, 150], [dims.base, dims.max, dims.base]);
  const size = useSpring(sizeSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const [isHovered, setIsHovered] = useState(false);

  const iconPx = Math.round(dims.base * 0.46);
  const imgPad = Math.max(2, Math.round(dims.base * 0.12));

  return (
    <motion.a
      ref={ref}
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex aspect-square shrink-0 cursor-pointer items-center justify-center"
      whileTap={{ scale: 0.94 }}
    >
      <motion.div
        className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-white text-foreground shadow-sm"
        animate={{ y: isHovered ? -8 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="78px"
            className="object-contain"
            style={{ padding: imgPad }}
          />
        ) : (
          <span
            style={{ width: iconPx, height: iconPx }}
            className="[&>svg]:h-full [&>svg]:w-full"
          >
            {item.icon}
          </span>
        )}
      </motion.div>

      {/* Tooltip (hover only — hidden on touch) */}
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.85 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          y: isHovered ? -16 : 8,
          scale: isHovered ? 1 : 0.85,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#0a0a0a] px-2.5 py-1 text-xs font-medium text-white"
      >
        {item.name}
      </motion.div>
    </motion.a>
  );
}

export function Dock() {
  const mouseX = useMotionValue(Infinity);
  const [dims, setDims] = useState<Dims>(DESKTOP);

  // Size the icons so all tabs fit the row. On phones we shrink the base size
  // (and drop the hover-magnify, which is pointless on touch) so nothing
  // overflows; on ≥640px we keep the full macOS-style magnify dock.
  useEffect(() => {
    const N = dockItems.length;
    const compute = () => {
      const vw = window.innerWidth;
      if (vw >= 640) {
        setDims(DESKTOP);
        return;
      }
      const gap = vw < 380 ? 4 : 5;
      const outerPad = 24; // wrapper px-3 (both sides)
      const innerPad = 16; // pill px-2 (both sides)
      const avail = vw - outerPad - innerPad;
      let base = Math.floor((avail - gap * (N - 1)) / N);
      base = Math.max(26, Math.min(base, 44));
      setDims({ base, max: base, gap, height: base + 14 });
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-3">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        style={{ gap: dims.gap, height: dims.height }}
        className="pointer-events-auto mx-auto flex max-w-full items-end rounded-3xl border border-border bg-white/70 px-2 pb-2 shadow-xl backdrop-blur-md sm:px-4 sm:pb-3"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
      >
        {dockItems.map((item) => (
          <DockIcon key={item.id} item={item} mouseX={mouseX} dims={dims} />
        ))}
      </motion.div>
    </div>
  );
}
