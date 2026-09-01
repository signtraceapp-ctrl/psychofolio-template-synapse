"use client";

import { useState } from "react";
import { SynapseShell, useSynapseReveal, NeuronDivider } from "@/components/page-shell";
import type { SiteContent } from "@/lib/content";

const VIOLET = "#7b6cf0";
const PINK = "#ee7ab5";

const bioNodes = [
  { t: "Eğitim", d: "Psikoloji lisansı ve klinik psikoloji yüksek lisansı; nöropsikoloji alanında uzmanlaşma.", pos: { left: "8%", top: 30 } },
  { t: "Klinik Deneyim", d: "11 yılda 3.800'ün üzerinde seans; kaygı, duygudurum ve dikkat alanlarında yoğun pratik.", pos: { right: "8%", top: 30 } },
  { t: "Araştırma", d: "14 bilimsel yayın ve bildiri; iki çok merkezli çalışmada araştırmacı.", pos: { left: "8%", bottom: 10 } },
  { t: "Süpervizyon", d: "Genç klinisyenlere düzenli süpervizyon; etik kurul deneyimi.", pos: { right: "8%", bottom: 10 } },
];

export function AboutClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useSynapseReveal();
  const [active, setActive] = useState(-1);

  return (
    <SynapseShell scopeRef={scopeRef} kicker="hakkında" title="Bağlantıların" accent="hikayesi." siteName={c.site.name}>
      <section className="relative z-[1] pb-16 pt-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p data-reveal className="mx-auto max-w-xl text-center text-[15px] font-light leading-[2] text-[#5a6070]">
            {c.about.intro}
          </p>
        </div>
      </section>

      <section className="relative z-[1] pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Neuron network - desktop */}
          <div data-reveal className="relative mx-auto hidden max-w-4xl md:block" style={{ height: 400 }}>
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 400" fill="none" preserveAspectRatio="none" aria-hidden="true">
              {[
                "M400 200 C 300 180, 220 120, 130 70",
                "M400 200 C 500 180, 580 120, 670 70",
                "M400 200 C 300 220, 220 280, 130 330",
                "M400 200 C 500 220, 580 280, 670 330",
              ].map((d, i) => (
                <g key={i}>
                  <path
                    d={d}
                    stroke={active === i ? VIOLET : "#7b6cf0"}
                    strokeOpacity={active === i ? 0.7 : 0.22}
                    strokeWidth={active === i ? 2.4 : 1.4}
                    strokeDasharray="5 6"
                    className="transition-[stroke,stroke-opacity,stroke-width] duration-300"
                  />
                  <circle r={active === i ? 5 : 3} fill={i % 2 === 0 ? PINK : VIOLET} opacity={active === i ? 0.9 : 0.45}>
                    <animateMotion dur={`${2.2 + i * 0.4}s`} repeatCount="indefinite" path={d} />
                  </circle>
                </g>
              ))}
            </svg>

            {/* Center neuron */}
            <div className="absolute left-1/2 top-1/2 w-60 -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-[#7b6cf0]/30 bg-white p-6 text-center shadow-[0_20px_50px_rgba(123,108,240,0.16)]">
              <span
                className="mx-auto block h-3 w-3 animate-pulse rounded-full"
                style={{ background: `linear-gradient(135deg,${PINK},${VIOLET})` }}
                aria-hidden="true"
              />
              <p className="mt-3 text-[15px] font-semibold tracking-tight">
                {c.site.name}
              </p>
              <p className="mt-1 text-[11px] font-light text-[#6a7080]">
                {c.site.title}
              </p>
            </div>

            {/* Satellite neurons */}
            {bioNodes.map((n, i) => (
              <div
                key={n.t}
                className={`absolute w-52 cursor-pointer rounded-2xl border bg-white p-4 transition-[transform,border-color,box-shadow] duration-300 ${
                  active === i
                    ? "-translate-y-1 border-[#7b6cf0]/50 shadow-[0_18px_44px_rgba(123,108,240,0.18)]"
                    : "border-[#16181f]/8 shadow-[0_10px_28px_rgba(22,24,31,0.05)]"
                }`}
                style={n.pos as React.CSSProperties}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(-1)}
              >
                <p className="text-[13px] font-semibold tracking-tight" style={{ color: active === i ? VIOLET : "#16181f" }}>
                  {n.t}
                </p>
                <p className="mt-1.5 text-[11.5px] font-light leading-[1.7] text-[#5a6070]">{n.d}</p>
              </div>
            ))}
          </div>

          {/* Mobile */}
          <div className="mx-auto max-w-md space-y-3 md:hidden">
            <div data-reveal className="rounded-3xl border border-[#7b6cf0]/30 bg-white p-6 text-center shadow-[0_14px_36px_rgba(123,108,240,0.12)]">
              <p className="text-[15px] font-semibold">{c.site.name}</p>
              <p className="mt-1 text-[11px] font-light text-[#6a7080]">{c.site.title}</p>
            </div>
            {bioNodes.map((n) => (
              <div key={n.t} data-reveal className="rounded-2xl border border-[#16181f]/8 bg-white p-5 shadow-[0_10px_28px_rgba(22,24,31,0.05)]">
                <p className="text-[13px] font-semibold text-[#7b6cf0]">{n.t}</p>
                <p className="mt-1.5 text-[12px] font-light leading-[1.7] text-[#5a6070]">{n.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-[1] pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-reveal className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-[0_14px_40px_rgba(22,24,31,0.06)] md:p-10">
            <NeuronDivider w={120} />
            <p className="mt-5 text-center text-[15px] font-light leading-[2] text-[#4a5060]">
              &ldquo;{c.home.quote}&rdquo;
            </p>
            {c.home.quoteAuthor && (
              <p className="mt-3 text-center text-[11px] font-light text-[#6a7080]">
                - {c.home.quoteAuthor}
              </p>
            )}
          </div>
        </div>
      </section>
    </SynapseShell>
  );
}
