"use client";

import { useState } from "react";
import { SynapseShell, useSynapseReveal } from "@/components/page-shell";
import type { SiteContent } from "@/lib/content";

export function FaqClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useSynapseReveal();
  const [query, setQuery] = useState("");
  const q = query.trim().toLocaleLowerCase("tr");
  const allFaqs = c.faq.map((f, i) => ({ ...f, id: `soru-${i + 1}` }));
  const shown = q
    ? allFaqs.filter(
        (f) =>
          f.q.toLocaleLowerCase("tr").includes(q) ||
          f.a.toLocaleLowerCase("tr").includes(q),
      )
    : allFaqs;

  return (
    <SynapseShell scopeRef={scopeRef} kicker="merak edilenler" title="Aklınızdaki" accent="sorular." siteName={c.site.name}>
      <section className="relative z-[1] pb-28 pt-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-reveal className="mx-auto mb-8 max-w-4xl">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Sorunuzu yazın..."
                className="w-full rounded-2xl border border-[#16181f]/8 bg-white py-4 pl-5 pr-5 text-sm shadow-[0_10px_30px_rgba(22,24,31,0.05)] outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-[#9aa0ae] focus:border-[#7b6cf0]/50 focus:ring-2 focus:ring-[#7b6cf0]/15"
              />
              {q && (
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[11px] font-light text-[#6a7080]">
                  {shown.length} sonuç
                </span>
              )}
            </div>
          </div>
          <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-[240px_1fr]">
            {/* Sticky index */}
            <nav data-reveal className="hidden h-fit md:sticky md:top-28 md:block" aria-label="Soru dizini">
              <p className="text-[11px] font-semibold text-[#6a7080]">Sorular</p>
              <ol className="mt-3 space-y-1.5 border-l border-[#16181f]/10">
                {shown.map((f) => (
                  <li key={f.id}>
                    <a
                      href={`#${f.id}`}
                      className="-ml-px block border-l-2 border-transparent py-1 pl-4 text-[12px] font-light text-[#6a7080] transition-colors duration-200 hover:border-[#7b6cf0] hover:text-[#16181f]"
                    >
                      {f.q.length > 34 ? f.q.slice(0, 34) + "..." : f.q}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* Answer blocks */}
            <div className="space-y-6">
              {shown.length === 0 && (
                <p className="rounded-2xl bg-white p-6 text-sm font-light text-[#6a7080]">
                  Bu konuda hazır bir yanıt yok - iletişim sayfasından sorabilirsiniz,
                  bir iş günü içinde dönüş yapılır.
                </p>
              )}
              {shown.map((f, i) => (
                <article
                  key={f.id}
                  id={f.id}
                  data-reveal
                  className="scroll-mt-28 rounded-2xl border border-[#16181f]/6 bg-white p-6 shadow-[0_10px_28px_rgba(22,24,31,0.05)] transition-colors duration-300 hover:border-[#7b6cf0]/30 md:p-7"
                >
                  <p className="text-[11px] font-semibold text-[#7b6cf0]">
                    Soru {i + 1}
                  </p>
                  <h3 className="mt-1.5 text-[16px] font-semibold tracking-tight">{f.q}</h3>
                  <p className="mt-3 text-[13px] font-light leading-[1.9] text-[#5a6070]">{f.a}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SynapseShell>
  );
}
