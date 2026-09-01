"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SynapseHeader } from "./synapse-header";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const VIOLET = "#7b6cf0";
const PINK = "#ee7ab5";

/* -- Shared reveal + counter hook ----------------------------------------- */
export function useSynapseReveal() {
  const scopeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    const scope = scopeRef.current;
    if (!scope) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 36,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count || 0);
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () =>
            gsap.fromTo(
              el,
              { innerText: 0 },
              { innerText: target, duration: 1.4, snap: { innerText: 1 }, ease: "power2.out" },
            ),
        });
      });
    }, scope);
    return () => ctx.revert();
  }, []);
  return scopeRef;
}

/* -- Mini waveform -------------------------------------------------------- */
export function Waveform({ color = VIOLET, className = "" }: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M0 12 H18 L24 12 L28 4 L34 20 L40 8 L46 16 L52 12 H70 L76 2 L82 22 L88 12 H120"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* -- Neural ambient canvas ------------------------------------------------ */
export function NeuralAmbient() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    let W = 0;
    let H = 0;
    const resize = () => {
      W = cv.width = window.innerWidth;
      H = cv.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const N = 42;
    let seed = 13;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const nodes = Array.from({ length: N }, () => ({
      x: rand() * 1600,
      y: rand() * 1000,
      vx: (rand() - 0.5) * 0.22,
      vy: (rand() - 0.5) * 0.22,
      r: 1.4 + rand() * 2,
      hue: rand(),
    }));
    let mx = -9999;
    let my = -9999;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    if (!coarse) window.addEventListener("pointermove", onMove);

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, W, H);
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = W + 20;
        if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20;
        if (n.y > H + 20) n.y = -20;
      }
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 150 * 150) {
            const d = Math.sqrt(d2);
            const cx = (a.x + b.x) / 2;
            const cy = (a.y + b.y) / 2;
            const md = Math.hypot(cx - mx, cy - my);
            const boost = Math.max(0, 1 - md / 260);
            const alpha = (1 - d / 150) * (0.05 + boost * 0.22);
            ctx.strokeStyle = `rgba(123,108,240,${alpha})`;
            ctx.lineWidth = 1 + boost;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        const md = Math.hypot(n.x - mx, n.y - my);
        const boost = Math.max(0, 1 - md / 260);
        const r = n.hue < 0.5 ? 238 : 123;
        const g = n.hue < 0.5 ? 122 : 108;
        const b2 = n.hue < 0.5 ? 181 : 240;
        ctx.fillStyle = `rgba(${r},${g},${b2},${0.18 + boost * 0.5})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + boost * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      if (!coarse) window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}

/* -- Neuron divider ------------------------------------------------------- */
export function NeuronDivider({ w = 180 }: { w?: number }) {
  return (
    <svg width={w} height="26" viewBox="0 0 180 26" fill="none" className="mx-auto" aria-hidden="true">
      <defs>
        <linearGradient id="syn-nd" x1="0" y1="0" x2="180" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ee7ab5" />
          <stop offset="1" stopColor="#7b6cf0" />
        </linearGradient>
      </defs>
      <path d="M4 13 H74" stroke="url(#syn-nd)" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="79" cy="13" r="4" fill="#ee7ab5" fillOpacity=".8" />
      <circle cx="89" cy="9" r="1.5" fill="#7b6cf0" fillOpacity=".7" />
      <circle cx="91" cy="15" r="1.5" fill="#7b6cf0" fillOpacity=".5" />
      <circle cx="87" cy="17" r="1.2" fill="#ee7ab5" fillOpacity=".6" />
      <circle cx="99" cy="13" r="4" fill="#7b6cf0" fillOpacity=".8" />
      <path d="M103 13 H174" stroke="url(#syn-nd)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M160 13 C 166 7, 170 6, 176 4 M160 13 C 166 19, 170 20, 176 22" stroke="#7b6cf0" strokeOpacity=".5" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

/* -- Shared page scaffold ------------------------------------------------- */
export function SynapseShell({
  kicker,
  title,
  accent,
  children,
  scopeRef,
  siteName,
}: {
  kicker: string;
  title: string;
  accent?: string;
  children: React.ReactNode;
  scopeRef: React.RefObject<HTMLDivElement | null>;
  siteName?: string;
}) {
  return (
    <div
      ref={scopeRef}
      className="synapse-root min-h-screen font-sans text-[#16181f] selection:bg-[#7b6cf0]/20"
      style={{
        colorScheme: "light",
        background:
          "radial-gradient(820px 420px at 82% 6%, rgba(123,108,240,0.10), transparent 60%), radial-gradient(700px 420px at 12% 96%, rgba(238,122,181,0.09), transparent 60%), #f4f5f8",
      }}
    >
      <style>{`.synapse-root :is(h1,h2,h3){font-family:var(--font-synapse),var(--font-sans),sans-serif;letter-spacing:-0.015em}`}</style>
      <NeuralAmbient />
      <SynapseHeader siteName={siteName} />

      <header className="relative z-[1] pt-40 pb-14 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p
            data-reveal
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#16181f]/8 bg-white/70 px-5 py-2 text-[11px] font-medium tracking-[0.08em] text-[#6a7080]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#7b6cf0]" aria-hidden="true" />
            {kicker}
          </p>
          <h1 data-reveal className="mx-auto mt-7 max-w-3xl text-4xl leading-[1.04] tracking-[-0.025em] sm:text-5xl md:text-7xl">
            <span className="font-light">{title}</span>{" "}
            {accent && (
              <span
                className="bg-clip-text font-bold text-transparent"
                style={{ backgroundImage: `linear-gradient(92deg,${PINK},${VIOLET})` }}
              >
                {accent}
              </span>
            )}
          </h1>
          <div data-reveal className="mt-7">
            <NeuronDivider />
          </div>
        </div>
      </header>

      {children}

      <footer className="border-t border-[#16181f]/8 py-10 text-center">
        <p className="text-xs text-[#6a7080]">
          {siteName || "SYNAPSE"} · beyin değişebilir, biz bu değişimin bilimiyle çalışırız
        </p>
      </footer>
    </div>
  );
}
