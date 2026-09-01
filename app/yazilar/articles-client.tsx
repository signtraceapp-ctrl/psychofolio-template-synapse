"use client";

import { useState } from "react";
import { SynapseShell, useSynapseReveal } from "@/components/page-shell";
import type { SiteContent } from "@/lib/content";

const VIOLET = "#7b6cf0";
const PINK = "#ee7ab5";

export function ArticlesClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useSynapseReveal();
  const articles = c.articles;
  const [featured, ...rest] = articles;
  const cats = ["Tumu", ...Array.from(new Set(rest.map((n) => n.category)))];
  const [cat, setCat] = useState("Tumu");
  const shown = cat === "Tumu" ? rest : rest.filter((n) => n.category === cat);

  return (
    <SynapseShell scopeRef={scopeRef} kicker="yazilar" title="Beyin" accent="kutuphanesi." siteName={c.site.name}>
      <section className="relative z-[1] pb-6 pt-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p data-reveal className="mx-auto max-w-xl text-center text-[14px] font-light leading-[1.9] text-[#5a6070]">
            Beyniniz hakkinda merak ettikleriniz. Jargonsuz, korkutmadan,
            arastirmalara dayanarak.
          </p>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="relative z-[1] pb-10 pt-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <article
              data-reveal
              className="group mx-auto max-w-3xl cursor-pointer overflow-hidden rounded-3xl border border-[#7b6cf0]/20 bg-white p-8 shadow-[0_18px_48px_rgba(123,108,240,0.10)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_64px_rgba(123,108,240,0.16)] md:p-10"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#ee7ab5]/10 px-3 py-1 text-[11px] font-semibold text-[#d6538e]">{featured.category}</span>
                <span className="text-[11px] font-light text-[#6a7080]">{featured.readTime} okuma{featured.date ? ` - ${featured.date}` : ""}</span>
              </div>
              <h2 className="mt-4 max-w-xl text-2xl font-semibold leading-[1.3] tracking-tight transition-colors duration-500 group-hover:text-[#7b6cf0] sm:text-3xl">
                {featured.title}
              </h2>
              <svg className="mt-6 h-4 w-full max-w-[260px]" viewBox="0 0 260 16" fill="none" aria-hidden="true">
                <path d="M2 8 H60" stroke={VIOLET} strokeWidth="1.6" strokeLinecap="round" className="transition-opacity duration-300 group-hover:opacity-0" />
                <path d="M2 8 H210 M210 8 C 224 4, 234 3, 248 2 M210 8 C 224 12, 234 13, 248 14" stroke={VIOLET} strokeWidth="1.6" strokeLinecap="round" className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </svg>
            </article>
          </div>
        </section>
      )}

      {/* Library */}
      <section className="relative z-[1] pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-reveal className="mx-auto mb-6 flex max-w-3xl flex-wrap items-center gap-2">
            {cats.map((ct) => (
              <button
                key={ct}
                onClick={() => setCat(ct)}
                className={`rounded-full px-4 py-2 text-[12px] font-medium transition-[background-color,color,box-shadow] duration-300 ${
                  cat === ct
                    ? "text-white shadow-[0_8px_20px_rgba(123,108,240,0.3)]"
                    : "bg-white text-[#5a6070] shadow-[0_4px_14px_rgba(22,24,31,0.05)] hover:text-[#7b6cf0]"
                }`}
                style={cat === ct ? { background: `linear-gradient(92deg,${PINK},${VIOLET})` } : undefined}
              >
                {ct}
              </button>
            ))}
            <span className="ml-auto text-[11px] font-light text-[#6a7080]">{shown.length} yazi</span>
          </div>
          <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
            {shown.map((n) => (
              <article
                key={n.title}
                data-reveal
                className="group cursor-pointer rounded-3xl border border-[#16181f]/6 bg-white p-6 shadow-[0_10px_28px_rgba(22,24,31,0.05)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-[#7b6cf0]/30 hover:shadow-[0_20px_48px_rgba(22,24,31,0.09)]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="rounded-full bg-[#7b6cf0]/8 px-2.5 py-0.5 text-[10px] font-semibold text-[#7b6cf0]">{n.category}</span>
                  <span className="text-[10px] font-light text-[#6a7080]">{n.readTime}</span>
                </div>
                <h3 className="mt-3 text-[16px] font-semibold leading-snug tracking-tight transition-colors duration-500 group-hover:text-[#7b6cf0]">
                  {n.title}
                </h3>
                <p className="mt-4 flex items-center justify-between text-[11px] font-light text-[#6a7080]">
                  {n.date}
                  <span className="translate-x-0 text-[#7b6cf0]/0 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-[#7b6cf0]" aria-hidden="true">&rarr;</span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SynapseShell>
  );
}
