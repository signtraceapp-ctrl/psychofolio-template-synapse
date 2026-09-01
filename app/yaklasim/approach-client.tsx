"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SynapseShell, useSynapseReveal } from "@/components/page-shell";
import type { SiteContent } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const VIOLET = "#7b6cf0";
const PINK = "#ee7ab5";

const plasticSteps = [
  { k: "1", t: "Fark et", d: "Sizi yoran düşünce ve davranış döngülerini birlikte görünür kılarız. Beyin, fark edilmeyen alışkanlığı değiştiremez." },
  { k: "2", t: "Yeni deneyim", d: "Seans içinde ve dışında, eski döngünün yerine geçecek yeni, küçük deneyimler tasarlarız. Her yeni deneyim zayıf bir bağlantı kurar." },
  { k: "3", t: "Tekrar", d: "Yeni bağlantı ancak tekrarla güçlenir, nöroplastisitenin altın kuralı budur. Ev uygulamaları bu yüzden vardır." },
  { k: "4", t: "Kalıcı yol", d: "Zamanla yeni yol, eskisinden daha kolay yürünür hale gelir. Terapinin bittiği yer, beynin yeni varsayılanının başladığı yerdir." },
];

export function ApproachClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useSynapseReveal();
  const railRef = useRef<HTMLDivElement>(null);
  const axonRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    const axon = axonRef.current;
    const glow = glowRef.current;
    if (!rail || !axon || !glow) return;
    const st = ScrollTrigger.create({
      trigger: rail,
      start: "top 55%",
      end: "bottom 60%",
      scrub: 0.4,
      onUpdate: (self) => {
        const p = self.progress;
        axon.setAttribute("stroke-width", String(1.5 + p * 5));
        glow.setAttribute("stroke-width", String(4 + p * 14));
        glow.setAttribute("stroke-opacity", String(0.08 + p * 0.3));
        setActive(Math.min(3, Math.floor(p * 4)));
      },
    });
    return () => st.kill();
  }, []);

  return (
    <SynapseShell scopeRef={scopeRef} kicker="yaklaşım" title="Beyin değişir," accent="biz eşlik ederiz." siteName={c.site.name}>
      <section className="relative z-[1] pb-14 pt-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p data-reveal className="mx-auto max-w-xl text-center text-[15px] font-light leading-[2] text-[#5a6070]">
            {c.approach.intro}
          </p>
        </div>
      </section>

      <section className="relative z-[1] pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div ref={railRef} className="mx-auto grid max-w-4xl gap-14 md:grid-cols-[5fr_7fr]">
            {/* Sticky synapse visual */}
            <div className="relative hidden md:block">
              <div className="sticky top-32">
                <svg viewBox="0 0 300 340" fill="none" className="w-full max-w-[300px]" aria-hidden="true">
                  <defs>
                    <linearGradient id="syn-ax" x1="0" y1="0" x2="0" y2="340" gradientUnits="userSpaceOnUse">
                      <stop stopColor={PINK} />
                      <stop offset="1" stopColor={VIOLET} />
                    </linearGradient>
                  </defs>
                  <circle cx="150" cy="52" r="26" fill={PINK} fillOpacity=".16" />
                  <circle cx="150" cy="52" r="14" fill={PINK} fillOpacity=".85" />
                  <path d="M150 52 C 110 30, 90 20, 60 14 M150 52 C 190 30, 210 20, 240 14 M150 52 C 120 44, 100 40, 70 42" stroke={PINK} strokeOpacity=".45" strokeWidth="1.6" strokeLinecap="round" />
                  <path ref={glowRef} d="M150 66 C 130 130, 170 210, 150 274" stroke={VIOLET} strokeOpacity=".08" strokeWidth="4" strokeLinecap="round" />
                  <path ref={axonRef} d="M150 66 C 130 130, 170 210, 150 274" stroke="url(#syn-ax)" strokeWidth="1.5" strokeLinecap="round" />
                  <circle r="4" fill="#fff" stroke={VIOLET} strokeWidth="1.5">
                    <animateMotion dur="2.6s" repeatCount="indefinite" path="M150 66 C 130 130, 170 210, 150 274" />
                  </circle>
                  <circle cx="150" cy="288" r="26" fill={VIOLET} fillOpacity=".16" />
                  <circle cx="150" cy="288" r="14" fill={VIOLET} fillOpacity=".85" />
                  <path d="M150 288 C 110 310, 90 320, 60 326 M150 288 C 190 310, 210 320, 240 326 M150 288 C 180 296, 200 300, 230 298" stroke={VIOLET} strokeOpacity=".45" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <p className="mt-3 text-center text-[11px] font-light text-[#6a7080]">
                  adım {active + 1}/4 · bağlantı güçleniyor
                </p>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-16 md:space-y-32 md:py-10">
              {plasticSteps.map((p, i) => (
                <div key={p.k} data-reveal className="relative">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white transition-[background-color] duration-300"
                    style={{
                      background:
                        active >= i
                          ? `linear-gradient(135deg,${PINK},${VIOLET})`
                          : "rgba(22,24,31,0.15)",
                    }}
                    aria-hidden="true"
                  >
                    {p.k}
                  </span>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight">{p.t}</h3>
                  <p className="mt-3 max-w-md text-[14px] font-light leading-[2] text-[#5a6070]">{p.d}</p>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal className="mx-auto mt-8 max-w-2xl rounded-3xl bg-white p-8 text-center shadow-[0_14px_40px_rgba(22,24,31,0.06)]">
            <p className="text-[15px] font-light leading-[2] text-[#4a5060]">
              Bu döngünün her adımını <span className="font-medium text-[#7b6cf0]">düzenli ölçümlerle</span> birlikte
              izleriz. Çünkü değişimi görmek, değişimi hızlandırır.
            </p>
          </div>
        </div>
      </section>
    </SynapseShell>
  );
}
