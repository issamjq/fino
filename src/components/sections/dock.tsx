"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Home, Mail, Phone, Globe, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { products } from "@/lib/products";

type DockItem = {
  id: string;
  name: string;
  href: string;
  icon?: React.ReactNode;
  image?: string;
  external?: boolean;
};

// Home + the 5 products (each a quick-jump link)
const dockItems: DockItem[] = [
  { id: "home", name: "Home", href: "#top", icon: <Home /> },
  ...products.map((p) => ({
    id: p.id,
    name: p.name,
    href: `#${p.id}`,
    image: p.image,
  })),
];

// Mobile only — grouped under the contact (phone) tab as an upward speed-dial
const contactItems: DockItem[] = [
  { id: "blog", name: "Blog", href: "#blog", icon: <Newspaper /> },
  { id: "email", name: "Email", href: "mailto:mk@mjqinvestment.com", icon: <Mail /> },
  { id: "call", name: "Call", href: "tel:+971522885649", icon: <Phone /> },
  {
    id: "web",
    name: "Website",
    href: "https://www.mjqinvestment.com/",
    external: true,
    icon: <Globe />,
  },
];

// Desktop — the same four shown as separate icons (detailed tooltips), as before
const desktopContactItems: DockItem[] = [
  { id: "blog", name: "Blog", href: "#blog", icon: <Newspaper /> },
  { id: "email", name: "mk@mjqinvestment.com", href: "mailto:mk@mjqinvestment.com", icon: <Mail /> },
  { id: "call", name: "+971 52 288 5649", href: "tel:+971522885649", icon: <Phone /> },
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

/** shared magnify spring for a dock cell */
function useMagnify(ref: React.RefObject<HTMLElement | null>, mouseX: MotionValue<number>, dims: Dims) {
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });
  const sizeSync = useTransform(distance, [-150, 0, 150], [dims.base, dims.max, dims.base]);
  return useSpring(sizeSync, { mass: 0.1, stiffness: 150, damping: 12 });
}

function DockIcon({ item, mouseX, dims }: { item: DockItem; mouseX: MotionValue<number>; dims: Dims }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const size = useMagnify(ref, mouseX, dims);
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
          <Image src={item.image} alt={item.name} fill sizes="78px" className="object-contain" style={{ padding: imgPad }} />
        ) : (
          <span style={{ width: iconPx, height: iconPx }} className="[&>svg]:h-full [&>svg]:w-full">
            {item.icon}
          </span>
        )}
      </motion.div>

      <Tooltip show={isHovered}>{item.name}</Tooltip>
    </motion.a>
  );
}

function Tooltip({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.85 }}
      animate={{ opacity: show ? 1 : 0, y: show ? -16 : 8, scale: show ? 1 : 0.85 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#0a0a0a] px-2.5 py-1 text-xs font-medium text-white"
    >
      {children}
    </motion.div>
  );
}

/** The contact tab: a phone icon that pops an upward speed-dial of links. */
function ContactDock({ mouseX, dims }: { mouseX: MotionValue<number>; dims: Dims }) {
  const ref = useRef<HTMLDivElement>(null);
  const size = useMagnify(ref, mouseX, dims);
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const iconPx = Math.round(dims.base * 0.46);

  // close when clicking/tapping outside
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      className="relative flex aspect-square shrink-0 items-center justify-center"
    >
      {/* Speed-dial menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-full right-0 mb-3 flex flex-col items-end gap-2.5"
          >
            {contactItems.map((item, i) => (
              <motion.a
                key={item.id}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 16, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { delay: (contactItems.length - 1 - i) * 0.05, type: "spring", stiffness: 520, damping: 22 },
                }}
                exit={{ opacity: 0, y: 12, scale: 0.5, transition: { duration: 0.12 } }}
                className="flex items-center gap-2.5"
              >
                <span className="whitespace-nowrap rounded-full bg-[#0a0a0a]/90 px-3 py-1 text-xs font-medium text-white shadow-md backdrop-blur">
                  {item.name}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-lg transition-colors hover:border-primary hover:text-primary [&>svg]:h-[18px] [&>svg]:w-[18px]">
                  {item.icon}
                </span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phone face (toggles the menu) */}
      <motion.button
        type="button"
        aria-label="Contact"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative flex h-full w-full items-center justify-center rounded-2xl border shadow-sm transition-colors",
          open ? "border-transparent bg-primary text-primary-foreground" : "border-border bg-white text-foreground"
        )}
        animate={{ y: isHovered && !open ? -8 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        whileTap={{ scale: 0.94 }}
      >
        <motion.span
          style={{ width: iconPx, height: iconPx }}
          className="[&>svg]:h-full [&>svg]:w-full"
          animate={{ rotate: open ? 135 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
        >
          <Phone />
        </motion.span>
      </motion.button>

      <Tooltip show={isHovered && !open}>Contact</Tooltip>
    </motion.div>
  );
}

export function Dock() {
  const mouseX = useMotionValue(Infinity);
  const [dims, setDims] = useState<Dims>(DESKTOP);
  const [isMobile, setIsMobile] = useState(false);

  // Size icons so all tabs fit; shrink + drop magnify on phones. The contact
  // group (speed-dial) is mobile-only — desktop keeps the separate icons.
  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      const mobile = vw < 640;
      setIsMobile(mobile);
      if (!mobile) {
        setDims(DESKTOP);
        return;
      }
      const N = dockItems.length + 1; // 6 links + the contact tab
      const gap = vw < 380 ? 5 : 6;
      const avail = vw - 24 - 16; // wrapper px-3 + pill px-2
      let base = Math.floor((avail - gap * (N - 1)) / N);
      base = Math.max(30, Math.min(base, 52));
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
        {isMobile ? (
          <ContactDock mouseX={mouseX} dims={dims} />
        ) : (
          desktopContactItems.map((item) => (
            <DockIcon key={item.id} item={item} mouseX={mouseX} dims={dims} />
          ))
        )}
      </motion.div>
    </div>
  );
}
