"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/**
 * Free smooth scrolling + a "gate" between sections.
 *
 * You scroll the page freely (heavy Lenis momentum). When you reach the
 * boundary between two sections, the page sticks there and you have to keep
 * scrolling (~2–3 wheel notches) to break through — then free scrolling
 * resumes. It is NOT a pager: nothing slides you section-to-section, and the
 * keyboard scrolls normally.
 *
 * - Touch devices: gate disabled, fully native/free scroll.
 */

// accumulated wheel travel (px) needed to break through a boundary
const THRESHOLD = 220;
// reset the accumulator if the user pauses between scrolls (ms)
const IDLE_RESET = 220;
// section ids in DOM order
const SECTION_IDS = [
  "#top",
  "#brand",
  "#puffs",
  "#collagen",
  "#heros",
  "#blog",
  "#contact",
];

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // the section gate only applies on the homepage; other routes (e.g. blog
    // posts) get free smooth scroll with no boundary sticking
    const gateEnabled = pathname === "/";

    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.08, // heavy momentum
      wheelMultiplier: 0.9,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const isCoarse =
      typeof window !== "undefined" &&
      window.matchMedia?.("(pointer: coarse)").matches;

    // ── boundary state ──
    let tops: number[] = [];
    let prev = 0;
    let gated = false;
    let accum = 0;
    let accumDir = 0;
    let gateTop = 0;
    let releasedTop: number | null = null;
    let lastTs = 0;
    let programmatic = false; // anchor-click scroll in flight — don't gate
    let progTimer: ReturnType<typeof setTimeout> | undefined;

    const computeTops = () => {
      if (!gateEnabled) {
        tops = [];
        return;
      }
      tops = SECTION_IDS.map((id) => document.querySelector<HTMLElement>(id))
        .filter((el): el is HTMLElement => !!el)
        .map((el) => Math.round(el.getBoundingClientRect().top + window.scrollY))
        .sort((a, b) => a - b);
    };

    // stick at a boundary until the user pushes through
    const engage = (top: number) => {
      gated = true;
      accum = 0;
      accumDir = 0;
      gateTop = top;
      lenis.scrollTo(top, { immediate: true });
      lenis.stop();
      prev = top;
    };

    // let go and resume free scroll, nudging just past the boundary
    const release = (dir: number) => {
      gated = false;
      releasedTop = gateTop;
      lenis.start();
      lenis.scrollTo(gateTop + dir * Math.round(window.innerHeight * 0.12), {
        duration: 0.5,
      });
    };

    const onScroll = () => {
      const cur = lenis.scroll;
      if (!gated && !programmatic && tops.length) {
        const lo = Math.min(prev, cur);
        const hi = Math.max(prev, cur);
        for (const t of tops) {
          if (t === releasedTop) continue;
          if (t > lo && t <= hi) {
            engage(t);
            break;
          }
        }
        if (releasedTop !== null && Math.abs(cur - releasedTop) > 60) {
          releasedTop = null;
        }
      }
      prev = cur;
    };
    lenis.on("scroll", onScroll);

    const tryBreak = (deltaY: number, dir: number) => {
      const now = Date.now();
      if (now - lastTs > IDLE_RESET) accum = 0;
      lastTs = now;
      if (dir !== accumDir) {
        accum = 0;
        accumDir = dir;
      }
      accum += Math.abs(deltaY);
      if (accum >= THRESHOLD) release(dir);
    };

    const onWheel = (e: WheelEvent) => {
      if (isCoarse || !gated) return; // free scroll handled by Lenis
      e.preventDefault();
      tryBreak(e.deltaY, Math.sign(e.deltaY));
    };

    const onKey = (e: KeyboardEvent) => {
      if (isCoarse || !gated) return; // free scroll when not gated
      const k = e.key;
      const down = k === "ArrowDown" || k === "PageDown" || (k === " " && !e.shiftKey);
      const up = k === "ArrowUp" || k === "PageUp" || (k === " " && e.shiftKey);
      if (down || up) {
        e.preventDefault();
        tryBreak(140, down ? 1 : -1);
      }
    };

    // smooth glide for in-page anchor clicks (dock, hero buttons, feature links)
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const target = e.target as HTMLElement;
      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector<HTMLElement>(id);
      if (!el) return;
      e.preventDefault();
      gated = false;
      lenis.start();
      // suspend the gate for the whole glide so it isn't caught at a boundary
      // it passes through on the way to the target
      programmatic = true;
      releasedTop = Math.round(
        el.getBoundingClientRect().top + window.scrollY
      );
      const endProgrammatic = () => {
        programmatic = false;
        prev = lenis.scroll;
      };
      // re-enable the gate when the glide finishes — with a timeout fallback so
      // an interrupted glide (onComplete never fires) can't disable it forever
      clearTimeout(progTimer);
      progTimer = setTimeout(endProgrammatic, 1700);
      lenis.scrollTo(el, { offset: 0, duration: 1.4, onComplete: endProgrammatic });
    };

    const onResize = () => computeTops();

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    document.addEventListener("click", onClick);

    const t0 = setTimeout(computeTops, 500);
    const t1 = setTimeout(computeTops, 1500); // recompute after images settle

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(progTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("click", onClick);
      lenis.off("scroll", onScroll);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [pathname]);

  return null;
}
