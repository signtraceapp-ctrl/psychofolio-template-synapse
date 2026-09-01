"use client";

import { useState } from "react";
import { SynapseShell, Waveform, useSynapseReveal } from "@/components/page-shell";
import type { SiteContent } from "@/lib/content";

const VIOLET = "#7b6cf0";
const PINK = "#ee7ab5";

const topics = ["kaygi / duygudurum", "dikkat & bellek", "performans", "diger"];

export function ContactClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useSynapseReveal();
  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <SynapseShell scopeRef={scopeRef} kicker="iletisim" title="Ilk adimi" accent="birlikte atalim." siteName={c.site.name}>
      <section className="relative z-[1] pb-28 pt-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-[7fr_5fr]">
            {/* 3-step form */}
            <div data-reveal className="overflow-hidden rounded-3xl border border-[#16181f]/8 bg-white shadow-[0_14px_40px_rgba(22,24,31,0.06)]">
              <div className="flex items-center justify-between border-b border-[#16181f]/6 px-6 py-3 text-[11px] font-medium text-[#6a7080]">
                <span>gorusme talebi</span>
                <span>{sent ? "alindi" : `adim ${step + 1}/3`}</span>
              </div>

              {!sent && (
                <div className="flex gap-1.5 px-6 pt-5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1 flex-1 rounded-full transition-colors duration-400"
                      style={{
                        background:
                          i <= step ? `linear-gradient(92deg,${PINK},${VIOLET})` : "rgba(22,24,31,0.07)",
                      }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              )}

              {sent ? (
                <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 p-8 text-center">
                  <Waveform className="h-6 w-40" />
                  <p className="text-xl font-semibold tracking-tight">{name ? `Tesekkurler ${name.split(" ")[0]} -` : ""} mesajiniz bize ulasti.</p>
                  <p className="max-w-sm text-[13px] font-light leading-[1.9] text-[#5a6070]">
                    Bir is gunu icinde uygun saat secenekleriyle donus yapilir.
                    (Bu bir sablon onizlemesidir - mesaj gonderilmedi.)
                  </p>
                </div>
              ) : (
                <form
                  className="p-6 md:p-8"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (step < 2) setStep(step + 1);
                    else setSent(true);
                  }}
                >
                  {step === 0 && (
                    <div className="space-y-5">
                      <p className="text-[11px] font-semibold text-[#7b6cf0]">1 - Size nasil ulasalim?</p>
                      {[
                        { id: "sc-ad", label: c.contact.formName, type: "text", val: name, set: setName },
                        { id: "sc-eposta", label: c.contact.formEmail, type: "email", val: email, set: setEmail },
                      ].map((f) => (
                        <div key={f.id}>
                          <label htmlFor={f.id} className="text-[11px] font-medium text-[#4a5060]">{f.label}</label>
                          <input
                            id={f.id}
                            type={f.type}
                            required
                            value={f.val}
                            onChange={(e) => f.set(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-[#16181f]/10 bg-[#f8f9fb] px-4 py-3 text-sm outline-none transition-[border-color,background-color,box-shadow] duration-300 focus:border-[#7b6cf0]/60 focus:bg-white focus:ring-2 focus:ring-[#7b6cf0]/15"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {step === 1 && (
                    <div>
                      <p className="text-[11px] font-semibold text-[#7b6cf0]">2 - Sizi en cok ne yoruyor?</p>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        {topics.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTopic(t)}
                            className={`rounded-xl border px-4 py-3.5 text-left text-[13px] font-medium transition-[border-color,background-color,color] duration-300 ${
                              topic === t
                                ? "border-[#7b6cf0] bg-[#7b6cf0]/[0.06] text-[#7b6cf0]"
                                : "border-[#16181f]/10 text-[#4a5060] hover:border-[#7b6cf0]/40"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {step === 2 && (
                    <div>
                      <div className="mb-4 flex flex-wrap gap-2 rounded-2xl bg-[#f8f9fb] p-3 text-[11px] text-[#5a6070]">
                        <span className="rounded-full bg-white px-3 py-1 shadow-sm">{name || "-"}</span>
                        <span className="rounded-full bg-white px-3 py-1 shadow-sm">{email || "-"}</span>
                        <span className="rounded-full bg-white px-3 py-1 font-medium text-[#7b6cf0] shadow-sm">{topic || "konu secilmedi"}</span>
                      </div>
                      <p className="text-[11px] font-semibold text-[#7b6cf0]">3 - Birkac cumleyle anlatin</p>
                      <textarea
                        rows={5}
                        required
                        placeholder={c.contact.formMessage}
                        className="mt-3 w-full resize-none rounded-xl border border-[#16181f]/10 bg-[#f8f9fb] px-4 py-3 text-sm outline-none transition-[border-color,background-color,box-shadow] duration-300 placeholder:text-[#9aa0ae] focus:border-[#7b6cf0]/60 focus:bg-white focus:ring-2 focus:ring-[#7b6cf0]/15"
                      />
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(Math.max(0, step - 1))}
                      className={`text-xs font-medium text-[#6a7080] transition-opacity ${step === 0 ? "pointer-events-none opacity-0" : "hover:text-[#16181f]"}`}
                    >
                      &larr; geri
                    </button>
                    <button
                      type="submit"
                      disabled={step === 1 && !topic}
                      className="rounded-xl px-8 py-3 text-sm font-medium text-white transition-transform duration-300 hover:scale-[1.02] disabled:opacity-40"
                      style={{ background: `linear-gradient(92deg,${PINK},${VIOLET})` }}
                    >
                      {step < 2 ? "devam &rarr;" : c.contact.formSubmit}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* SLA panel */}
            <div className="space-y-4">
              {[
                { k: "Ne zaman donus alirsiniz?", v: "1 is gunu icinde", d: "Tum mesajlara ayni gun ya da ertesi gun yanit verilir." },
                { k: "Ilk gorusme ne zaman?", v: "genellikle ayni hafta", d: "Degerlendirme gorusmeleri cogunlukla 5 gun icinde planlanir." },
                { k: "Nasil gorusuruz?", v: "cevrim ici ya da yuz yuze", d: `${c.site.address} - testlerin bir kismi yuz yuze uygulanir.` },
              ].map((x) => (
                <div key={x.k} data-reveal className="rounded-3xl border border-[#16181f]/6 bg-white p-6 shadow-[0_10px_28px_rgba(22,24,31,0.05)]">
                  <p className="text-[11px] font-semibold text-[#6a7080]">{x.k}</p>
                  <p className="mt-1 text-xl font-semibold tracking-tight" style={{ color: VIOLET }}>{x.v}</p>
                  <p className="mt-1.5 text-[12px] font-light leading-[1.7] text-[#5a6070]">{x.d}</p>
                </div>
              ))}
              <p data-reveal className="px-2 text-[11px] font-light leading-[1.8] text-[#6a7080]">
                Acil bir kriz durumundaysaniz lutfen 112&apos;yi arayin; bu form acil
                mudahale icin uygun degildir.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SynapseShell>
  );
}
