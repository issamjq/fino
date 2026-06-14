"use client";

import { useRef, useState } from "react";
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

function DockIcon({ item, mouseX }: { item: DockItem; mouseX: MotionValue<number> }) {
  const ref = useRef<HTMLAnchorElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [48, 78, 48]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });
  const heightSync = useTransform(distance, [-150, 0, 150], [48, 78, 48]);
  const height = useSpring(heightSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      ref={ref}
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      style={{ width, height }}
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
            className="object-contain p-1.5"
          />
        ) : (
          <span className="[&>svg]:h-5 [&>svg]:w-5">{item.icon}</span>
        )}
      </motion.div>

      {/* Tooltip */}
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

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-3">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="no-scrollbar pointer-events-auto mx-auto flex h-[72px] max-w-full items-end gap-2 overflow-x-auto rounded-3xl border border-border bg-white/70 px-3 pb-3 shadow-xl backdrop-blur-md sm:gap-3 sm:px-4"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
      >
        {dockItems.map((item) => (
          <DockIcon key={item.id} item={item} mouseX={mouseX} />
        ))}
      </motion.div>
    </div>
  );
}
