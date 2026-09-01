"use client";

import { useState } from "react";
import { SynapseShell, useSynapseReveal } from "@/components/page-shell";
import type { SiteContent } from "@/lib/content";

const VIOLET = "#7b6cf0";
const PINK = "#ee7ab5";

const matrix = {
  cols: [
    { code: "P-01", name: "Bilissel Davranisci Terapi", color: VIOLET },
    { code: "P-02", name: "Noropsikolojik Degerlendirme", color: PINK },
    { code: "P-03", name: "Performans & Odak", color: "#57b9e9" },
  ],
  rows: [
    { k: "hedef", v: ["Kaygi, depresyon, OKB", "Dikkat, bellek, yurutucu islev haritasi", "Bilissel yuk altinda dayaniklilik"] },
    { k: "format", v: ["Bire bir seans", "Test bataryasi + gorusme", "Bire bir kocluk"] },
    { k: "sure", v: ["50 dk - haftalik", "2 oturum - toplam ~4 saat", "45 dk - iki haftada bir"] },
    { k: "olcum", v: ["4 haftada bir standardize olcek", "Standardize normlarla rapor", "Oturum basi performans takibi"] },
    { k: "cikti", v: ["Surec + nuks onleme plani", "Ayrintili rapor - 10 is gunu", "Kisisel odak protokolu"] },
    { k: "kime uygun", v: ["Belirti odakli calismak isteyenler", "Somut bilissel yakinmasi olanlar", "Sporcular, yogun bilissel is yuku"] },
  ],
};

const triage = [
  { label: "Kaygi, mutsuzluk ya da takintilar", rec: 0, note: "Duygu odakli yakinmalarda ilk adim genellikle P-01'dir: yapilandirilmis, olcumle izlenen terapi." },
  { label: "Dikkat, bellek ya da odaklanma sorunlari", rec: 1, note: "Somut bilissel yakinmalarda once haritayi cikarmak gerekir: P-02 kapsamli bir degerlendirme sunar." },
  { label: "Performansimi bir ust seviyeye tasimak istiyorum", rec: 2, note: "Klinik bir yakinma olmadan gelisim hedefi icin P-03 odak koclugu uygundur." },
  { label: "Emin degilim / birden fazlasi", rec: 0, note: "Sorun degil, ilk degerlendirme gorusmesinde birlikte netlestiririz. Baslangic icin P-01 iyi bir kapidir." },
];

export function ServicesClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useSynapseReveal();
  const [hover, setHover] = useState(-1);
  const [picked, setPicked] = useState(-1);
  const rec = picked >= 0 ? triage[picked].rec : -1;
  const lit = (i: number) => hover === i || rec === i;

  // Use content services to populate matrix column names
  const cols = matrix.cols.map((col, i) => ({
    ...col,
    name: c.services[i]?.title || col.name,
  }));

  return (
    <SynapseShell scopeRef={scopeRef} kicker="hizmetler" title="Hangisi size" accent="uygun?" siteName={c.site.name}>
      {/* Guide - single question recommendation */}
      <section className="relative z-[1] pb-10 pt-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-reveal className="mx-auto max-w-3xl rounded-3xl border border-[#16181f]/8 bg-white p-7 shadow-[0_14px_40px_rgba(22,24,31,0.06)] md:p-8">
            <p className="text-[15px] font-semibold tracking-tight">Sizi buraya getiren en cok hangisi?</p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {triage.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setPicked(picked === i ? -1 : i)}
                  className={`rounded-xl border px-4 py-3 text-left text-[13px] font-medium transition-[border-color,background-color,color] duration-300 ${
                    picked === i
                      ? "border-[#7b6cf0] bg-[#7b6cf0]/[0.06] text-[#7b6cf0]"
                      : "border-[#16181f]/10 text-[#4a5060] hover:border-[#7b6cf0]/40"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {picked >= 0 && (
              <div className="mt-4 flex items-start gap-3 rounded-2xl bg-[#7b6cf0]/[0.06] p-4">
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ background: `linear-gradient(135deg,${PINK},${VIOLET})` }}
                >
                  {cols[triage[picked].rec].code.slice(-1)}
                </span>
                <p className="text-[13px] font-light leading-[1.8] text-[#3c4250]">
                  <span className="font-semibold text-[#7b6cf0]">
                    Onerimiz: {cols[triage[picked].rec].name}.
                  </span>{" "}
                  {triage[picked].note} Asagidaki tabloda onerilen sutun isaretli.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="relative z-[1] pb-28 pt-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-reveal className="mx-auto max-w-5xl overflow-x-auto rounded-3xl border border-[#16181f]/8 bg-white shadow-[0_14px_40px_rgba(22,24,31,0.06)]">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#16181f]/8">
                  <th className="w-36 px-6 py-5 text-[11px] font-medium text-[#6a7080]">
                    kriter
                  </th>
                  {cols.map((col, i) => (
                    <th
                      key={col.code}
                      className={`px-6 py-5 transition-colors duration-300 ${lit(i) ? "bg-[#7b6cf0]/[0.06]" : ""}`}
                      onMouseEnter={() => setHover(i)}
                      onMouseLeave={() => setHover(-1)}
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: col.color }}>
                        {col.code}
                      </p>
                      <p className="mt-1 text-[15px] font-semibold tracking-tight">{col.name}</p>
                      {rec === i && (
                        <span className="mt-1.5 inline-block rounded-full bg-[#7b6cf0] px-2.5 py-0.5 text-[9px] font-semibold text-white">
                          size onerilen
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.rows.map((r, ri) => (
                  <tr key={r.k} className={ri < matrix.rows.length - 1 ? "border-b border-[#16181f]/6" : ""}>
                    <td className="px-6 py-4 text-[11px] font-medium text-[#6a7080]">{r.k}</td>
                    {r.v.map((cell, i) => (
                      <td
                        key={i}
                        className={`px-6 py-4 text-[13px] font-light leading-[1.7] text-[#3c4250] transition-colors duration-300 ${lit(i) ? "bg-[#7b6cf0]/[0.06]" : ""}`}
                        onMouseEnter={() => setHover(i)}
                        onMouseLeave={() => setHover(-1)}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p data-reveal className="mx-auto mt-6 max-w-2xl text-center text-xs font-light leading-relaxed text-[#6a7080]">
            Hangi protokolun uygun olduguna ilk degerlendirme gorusmesinde
            birlikte karar verilir; protokoller gerektiginde birlestirilir.
          </p>
        </div>
      </section>
    </SynapseShell>
  );
}
