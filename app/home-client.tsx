"use client";

/**
 * SYNAPSE - Ana sayfa: holografik beyin, cananan sinaps baglantilari,
 * scroll ile cizilen sinyal dalgasi ve sayacli kanit blogu.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SynapseHeader } from "@/components/synapse-header";
import { Waveform, useSynapseReveal } from "@/components/page-shell";
import { LazyBrainScene } from "@/components/three/lazy-brain-scene";
import type { SiteContent } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const VIOLET = "#7b6cf0";
const PINK = "#ee7ab5";
const CYAN = "#57b9e9";

/* -- Vigilance task (PVT-adapted reaction time demo) ---------------------- */
function VigilanceTask() {
  const TRIALS = 5;
  const [state, setState] = useState<
    "intro" | "fixation" | "stimulus" | "feedback" | "report"
  >("intro");
  const [trial, setTrial] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [early, setEarly] = useState(0);
  const [lastMs, setLastMs] = useState(0);
  const goAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const startFixation = (nextTrial: number) => {
    setTrial(nextTrial);
    setState("fixation");
    clear();
    timer.current = setTimeout(() => {
      goAt.current = performance.now();
      setState("stimulus");
    }, 2000 + Math.random() * 2000);
  };

  const begin = () => {
    setTimes([]);
    setEarly(0);
    startFixation(1);
  };

  const respond = () => {
    if (state === "fixation") {
      clear();
      setEarly((n) => n + 1);
      startFixation(trial);
      return;
    }
    if (state !== "stimulus") return;
    const ms = Math.round(performance.now() - goAt.current);
    setLastMs(ms);
    const next = [...times, ms];
    setTimes(next);
    setState("feedback");
    clear();
    timer.current = setTimeout(() => {
      if (next.length >= TRIALS) setState("report");
      else startFixation(next.length + 1);
    }, 900);
  };

  useEffect(() => clear, []);

  const mean = times.length
    ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
    : 0;
  const best = times.length ? Math.min(...times) : 0;
  const sd = times.length
    ? Math.round(
        Math.sqrt(
          times.reduce((a, b) => a + (b - mean) ** 2, 0) / times.length,
        ),
      )
    : 0;
  const pos = (v: number) =>
    `${Math.min(100, Math.max(0, ((v - 150) / 350) * 100))}%`;

  return (
    <section className="relative z-[1] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div data-reveal className="text-center">
            <p className="text-[11px] font-semibold tracking-[0.08em] text-[#7b6cf0]">
              kucuk bir deneyim - tepki suresi gorevi
            </p>
            <h2 className="mt-4 text-3xl tracking-[-0.025em] md:text-4xl">
              <span className="font-light">Olcum nasil hissettirir,</span>{" "}
              <span
                className="bg-clip-text font-bold text-transparent"
                style={{ backgroundImage: `linear-gradient(92deg,${PINK},${VIOLET})` }}
              >
                bir deneyin.
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[13px] font-light leading-[1.9] text-[#5a6070]">
              Psikomotor vijilans gorevinden uyarlanmis {TRIALS} denemelik kisa
              bir uygulama: fiksasyon isaretine odaklanin, daire belirdigi an
              yanit verin.
            </p>
          </div>

          <div
            data-reveal
            className="mt-8 overflow-hidden rounded-3xl border border-[#16181f]/8 bg-white shadow-[0_14px_40px_rgba(22,24,31,0.06)]"
          >
            <div className="flex items-center justify-between border-b border-[#16181f]/6 px-6 py-3 text-[11px] font-medium text-[#6a7080]">
              <span>uygulama alani</span>
              <span>
                {state === "report"
                  ? "tamamlandi"
                  : state === "intro"
                    ? "hazir"
                    : `deneme ${trial}/${TRIALS}`}
              </span>
            </div>

            {state !== "report" ? (
              <button
                onClick={state === "intro" ? begin : respond}
                className="flex min-h-[240px] w-full flex-col items-center justify-center gap-4 outline-none"
                aria-label="Uygulama alani"
              >
                {state === "intro" && (
                  <>
                    <span className="rounded-full border border-[#7b6cf0]/40 px-7 py-3 text-sm font-medium text-[#7b6cf0]">
                      Uygulamayi baslat
                    </span>
                    <span className="font-mono text-[10px] text-[#6a7080]">
                      daire belirdiginde alana tiklayin
                    </span>
                  </>
                )}
                {state === "fixation" && (
                  <span className="font-mono text-4xl font-light text-[#16181f]/60">+</span>
                )}
                {state === "stimulus" && (
                  <span
                    className="h-24 w-24 rounded-full"
                    style={{ background: `radial-gradient(circle at 35% 30%, ${PINK}, ${VIOLET})` }}
                    aria-hidden="true"
                  />
                )}
                {state === "feedback" && (
                  <span className="font-mono text-2xl font-medium text-[#7b6cf0]">
                    {lastMs} ms
                  </span>
                )}
              </button>
            ) : (
              <div className="p-7 md:p-9">
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    ["ortalama", `${mean} ms`],
                    ["en iyi", `${best} ms`],
                    ["degiskenlik (ss)", `+/- ${sd} ms`],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-2xl bg-[#f6f7fa] p-4">
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#6a7080]">{k}</p>
                      <p className="mt-1 text-xl font-semibold tracking-tight">{v}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-7">
                  <div className="flex justify-between font-mono text-[9px] text-[#6a7080]">
                    <span>150 ms</span>
                    <span>tipik yetiskin araligi</span>
                    <span>500 ms</span>
                  </div>
                  <div className="relative mt-1.5 h-3 rounded-full bg-[#16181f]/6">
                    <span
                      className="absolute inset-y-0 rounded-full bg-[#7b6cf0]/15"
                      style={{ left: pos(200), width: `calc(${pos(350)} - ${pos(200)})` }}
                      aria-hidden="true"
                    />
                    <span
                      className="absolute top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full"
                      style={{ left: pos(mean), background: `linear-gradient(180deg,${PINK},${VIOLET})` }}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {early > 0 && (
                  <p className="mt-4 font-mono text-[10px] text-[#6a7080]">
                    not: {early} erken yanit kaydedildi (uyarandan once)
                  </p>
                )}
                <p className="mt-5 text-[12px] font-light leading-[1.9] text-[#6a7080]">
                  Bu uygulama bir tani araci degildir; tek oturumluk sonuclar
                  uyku, kafein ve o anki dikkat durumundan etkilenir. Dikkat ve
                  tepki sureclerinin kapsamli degerlendirmesi icin{" "}
                  <span className="font-medium text-[#7b6cf0]">P-02 Noropsikolojik Degerlendirme</span>{" "}
                  protokolune bakin.
                </p>
                <button
                  onClick={begin}
                  className="mt-5 rounded-full border border-[#16181f]/10 px-6 py-2.5 text-xs font-medium text-[#16181f] transition-colors hover:border-[#7b6cf0]/50 hover:text-[#7b6cf0]"
                >
                  Yeniden uygula
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -- Journey phases ------------------------------------------------------- */
const journeyPhases = [
  {
    t: "Beyniniz",
    a: "degisebilir.",
    d: "Buna noroplastisite denir. Kanitini gormek icin kaydirin, sizi beynin icine goturuyoruz.",
    tag: "disaridan bakis",
  },
  {
    t: "Her dusunce,",
    a: "bir yol izler.",
    d: "Su an bu cumleyi okurken bile milyonlarca baglanti atesleniyor. Beyin, en cok kullanilan yollari guclendirir.",
    tag: "beynin icindesiniz",
  },
  {
    t: "Kaygi, cok yurunmus",
    a: "bir yoldur.",
    d: "Su kapali donguye bakin: endise tekrar ettikce yol derinlesir ve beyin onu otomatik yurumeye baslar. Suc sizde degil, yol asinmis.",
    tag: "kaygi dongusu",
  },
  {
    t: "Terapi, yeni bir",
    a: "yol acar.",
    d: "Her seans, her yeni deneyim mor baglantiyi biraz daha guclendiriyor. Ve bakin, eski dongu kullanilmadikca sessizlesiyor.",
    tag: "yeni baglanti gucleniyor",
  },
  {
    t: "Beyniniz degisebilir.",
    a: "Bilim bunun kaniti.",
    d: "Bilissel davranisci terapi ve noropsikolojik degerlendirmeyle bu degisime birlikte eslik ediyoruz.",
    tag: "yeniden butun",
  },
];

/* -- Main component ------------------------------------------------------- */
export function HomeClient({ content: c }: { content: SiteContent }) {
  const scopeRef = useSynapseReveal();
  const waveSectionRef = useRef<HTMLDivElement>(null);
  const wavePathRef = useRef<SVGPathElement>(null);

  const journeyRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const journeyProgressRef = useRef(0);
  const [journeyPhase, setJourneyPhase] = useState(0);
  const [journeyWidth, setJourneyWidth] = useState(0);

  const onJourney = useCallback((self: ScrollTrigger) => {
    const p = self.progress;
    journeyProgressRef.current = p;
    setJourneyWidth(p);
    setJourneyPhase(p < 0.18 ? 0 : p < 0.42 ? 1 : p < 0.6 ? 2 : p < 0.86 ? 3 : 4);
  }, []);

  useEffect(() => {
    const section = journeyRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      pin,
      scrub: 0.8,
      onUpdate: onJourney,
    });
    return () => trigger.kill();
  }, [onJourney]);

  /* Scroll-drawn EEG wave */
  useEffect(() => {
    const path = wavePathRef.current;
    const section = waveSectionRef.current;
    if (!path || !section) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = String(len);
    path.style.strokeDashoffset = String(len);
    const tween = gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: { trigger: section, start: "top 75%", end: "bottom 55%", scrub: 0.5 },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const protocols = [
    { k: "01 / BDT", t: c.services[0]?.title || "Bilissel Davranisci Terapi", d: c.services[0]?.desc || "", w: "86%" },
    { k: "02 / NORO", t: c.services[1]?.title || "Noropsikolojik Degerlendirme", d: c.services[1]?.desc || "", w: "72%" },
    { k: "03 / ODAK", t: c.services[2]?.title || "Performans & Odak", d: c.services[2]?.desc || "", w: "91%" },
  ];

  return (
    <div
      ref={scopeRef}
      className="synapse-root min-h-screen font-sans text-[#16181f] selection:bg-[#7b6cf0]/20"
      style={{
        colorScheme: "light",
        background:
          "radial-gradient(900px 500px at 78% 10%, rgba(123,108,240,0.13), transparent 60%), radial-gradient(800px 500px at 18% 92%, rgba(238,122,181,0.11), transparent 60%), #f4f5f8",
      }}
    >
      <style>{`.synapse-root :is(h1,h2,h3){font-family:var(--font-synapse),var(--font-sans),sans-serif;letter-spacing:-0.015em}`}</style>
      <SynapseHeader siteName={c.site.name} />

      {/* BRAIN JOURNEY - full page pinned 3D */}
      <section
        ref={journeyRef}
        className="relative"
        style={{ height: "420vh" }}
        aria-label="Beynin icine yolculuk"
      >
        <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
          <div className="absolute inset-0">
            <LazyBrainScene progressRef={journeyProgressRef} />
          </div>

          <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
            <div className="relative h-72 w-full max-w-2xl text-center">
              {journeyPhases.map((ph, i) => (
                <div
                  key={i}
                  className="absolute inset-x-0 transition-[opacity,transform] duration-300 ease-out"
                  style={{
                    opacity: journeyPhase === i ? 1 : 0,
                    transform:
                      journeyPhase === i
                        ? "translateY(0)"
                        : journeyPhase > i
                          ? "translateY(-32px)"
                          : "translateY(32px)",
                    pointerEvents: journeyPhase === i ? "auto" : "none",
                  }}
                >
                  {i === 0 && (
                    <p className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[#16181f]/8 bg-white/70 px-5 py-2 text-[11px] font-medium tracking-[0.08em] text-[#6a7080] backdrop-blur">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7b6cf0]" aria-hidden="true" />
                      {c.site.name} - {c.home.badge.toLowerCase()}
                    </p>
                  )}
                  <h1
                    className={`mx-auto tracking-[-0.025em] ${
                      i === 0 || i === 4
                        ? "max-w-3xl text-4xl leading-[1.02] sm:text-6xl md:text-8xl"
                        : "max-w-2xl text-3xl leading-[1.12] sm:text-4xl md:text-6xl"
                    }`}
                  >
                    <span className="font-light">{ph.t}</span>{" "}
                    <span
                      className="bg-clip-text font-bold text-transparent"
                      style={{ backgroundImage: `linear-gradient(92deg,${PINK},${VIOLET} 60%,${CYAN})` }}
                    >
                      {ph.a}
                    </span>
                  </h1>
                  <p className="mx-auto mt-5 max-w-md rounded-2xl bg-white/55 px-5 py-3 text-[14px] font-light leading-[1.9] text-[#4a5060] backdrop-blur-[2px]">
                    {ph.d}
                  </p>
                  {i === 4 && (
                    <div className="mt-8 flex items-center justify-center gap-4">
                      <a
                        href="#deneyim"
                        className="rounded-full px-9 py-4 text-sm font-medium text-white shadow-[0_16px_40px_rgba(123,108,240,0.35)] transition-transform duration-300 hover:-translate-y-0.5"
                        style={{ background: `linear-gradient(92deg,${PINK},${VIOLET})` }}
                      >
                        {c.home.cta}
                      </a>
                      <a
                        href="#sinyal"
                        className="rounded-full border border-[#16181f]/10 bg-white/80 px-8 py-4 text-sm text-[#16181f] backdrop-blur transition-colors duration-300 hover:border-[#7b6cf0]/50 hover:text-[#7b6cf0]"
                      >
                        Yontemi incele
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom progress bar */}
          <div className="absolute bottom-8 left-1/2 z-10 w-40 -translate-x-1/2">
            <div className="h-0.5 overflow-hidden rounded-full bg-[#16181f]/8">
              <div
                className="h-full rounded-full transition-[width] duration-200"
                style={{
                  width: `${Math.round(journeyWidth * 100)}%`,
                  background: `linear-gradient(92deg,${PINK},${VIOLET})`,
                }}
              />
            </div>
            <p className="mt-2 text-center text-[10px] font-light text-[#6a7080]">
              {journeyPhase === 0 ? "kaydir - beynin icine gir" : journeyPhases[journeyPhase].tag}
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="deneyim" className="relative z-[1] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { n: 11, s: "+", l: "yil klinik deneyim" },
              { n: 3800, s: "+", l: "tamamlanmis seans" },
              { n: 4, s: " haftada bir", l: "duzenli sonuc olcumu" },
              { n: 14, s: "", l: "bilimsel yayin & bildiri" },
            ].map((x) => (
              <div key={x.l} data-reveal className="rounded-2xl border border-white bg-white/75 p-6 shadow-[0_12px_34px_rgba(22,24,31,0.06)] backdrop-blur">
                <p className="text-4xl font-bold tracking-tight" style={{ fontFamily: "var(--font-synapse), var(--font-sans), sans-serif" }}>
                  <span data-count={x.n}>0</span>
                  <span className="bg-clip-text text-lg text-transparent" style={{ backgroundImage: `linear-gradient(92deg,${PINK},${VIOLET})` }}>
                    {x.s}
                  </span>
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[#6a7080]">{x.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <VigilanceTask />

      {/* SIGNAL - scroll-drawn EEG wave */}
      <section id="sinyal" ref={waveSectionRef} className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p data-reveal className="text-[11px] font-semibold tracking-[0.08em] text-[#7b6cf0]">
              yontem
            </p>
            <h2 data-reveal className="mx-auto mt-4 max-w-2xl text-3xl tracking-[-0.025em] md:text-5xl">
              <span className="font-light">Degisimi hissetmekle kalmayin,</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(92deg,${PINK},${VIOLET})` }}>
                <span className="font-bold">gorun.</span>
              </span>
            </h2>
            <div data-reveal className="mt-12 overflow-hidden rounded-3xl border border-[#16181f]/6 bg-white p-8 shadow-[0_14px_40px_rgba(22,24,31,0.06)] md:p-12">
              <svg viewBox="0 0 900 140" fill="none" className="w-full" aria-hidden="true">
                <path d="M0 70 H900" stroke="#16181f" strokeOpacity=".06" strokeWidth="1" />
                <path
                  ref={wavePathRef}
                  d="M0 70 H90 L110 70 L124 30 L142 112 L160 44 L178 90 L196 70 H300 L318 12 L338 128 L356 70 H480 L498 46 L514 92 L530 70 H640 L658 24 L678 116 L696 70 H900"
                  stroke="url(#syn-wave)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="syn-wave" x1="0" y1="0" x2="900" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stopColor={PINK} />
                    <stop offset=".55" stopColor={VIOLET} />
                    <stop offset="1" stopColor={CYAN} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="mt-8 grid gap-6 text-left md:grid-cols-3">
                {[
                  ["Baslangic haritasi", "Standardize olcekler ve klinik gorusmeyle net bir sifir noktasi."],
                  ["Gorunur ilerleme", "Dort haftada bir olcum; grafikler danisanla birlikte okunur."],
                  ["Veriyle ayar", "Islemeyen strateji degisir, tahminle degil kayitla."],
                ].map(([t, d]) => (
                  <div key={t} data-reveal>
                    <h3 className="text-sm font-semibold tracking-tight">{t}</h3>
                    <p className="mt-2 text-[13px] font-light leading-[1.85] text-[#5a6070]">{d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROTOCOLS */}
      <section id="protokoller" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div data-reveal className="text-center">
              <p className="text-[11px] font-semibold tracking-[0.08em] text-[#7b6cf0]">hizmetler</p>
              <h2 className="mt-4 text-3xl tracking-[-0.025em] md:text-4xl">
                <span className="font-light">Uc hizmet, tek standart:</span>{" "}
                <span className="bg-clip-text font-bold text-transparent" style={{ backgroundImage: `linear-gradient(92deg,${PINK},${VIOLET})` }}>kanit.</span>
              </h2>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {protocols.map((p) => (
                <div
                  key={p.k}
                  data-reveal
                  className="group relative overflow-hidden rounded-3xl border border-[#16181f]/6 bg-white p-8 shadow-[0_12px_36px_rgba(22,24,31,0.05)] transition-[transform,box-shadow] duration-300 hover:-translate-y-2 hover:shadow-[0_26px_60px_rgba(22,24,31,0.10)]"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-1 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: `linear-gradient(92deg,${PINK},${VIOLET},${CYAN})` }}
                    aria-hidden="true"
                  />
                  <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#7b6cf0]">{p.k}</p>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">{p.t}</h3>
                  <p className="mt-3 text-[13px] font-light leading-[1.85] text-[#5a6070]">{p.d}</p>
                  <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-[#16181f]/5">
                    <span
                      className="block h-full origin-left scale-x-0 rounded-full transition-transform duration-1000 ease-out group-hover:scale-x-100"
                      style={{ width: p.w, background: `linear-gradient(92deg,${PINK},${VIOLET})` }}
                    />
                  </div>
                  <p className="mt-2 text-[10px] text-[#6a7080]">danisan memnuniyeti - ic olcum</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            data-reveal
            className="relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] p-12 text-center text-white shadow-[0_30px_70px_rgba(123,108,240,0.35)] md:p-16"
            style={{ background: `linear-gradient(120deg,${PINK},${VIOLET} 60%,${CYAN})` }}
          >
            <Waveform color="rgba(255,255,255,.5)" className="mx-auto h-6 w-44" />
            <h2 className="mt-6 text-3xl tracking-[-0.025em] md:text-4xl">
              <span className="font-light">Ilk sinyali</span> <span className="font-bold">bugun gonderin.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm font-light leading-[1.9] text-white/85">
              {c.contact.intro}
            </p>
            <a
              href="/iletisim"
              className="mt-8 inline-block rounded-full bg-white px-10 py-4 text-sm font-semibold text-[#16181f] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Randevu Al
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#16181f]/8 py-10 text-center">
        <p className="text-xs text-[#6a7080]">{c.site.name} - beyin degisebilir, biz bu degisimin bilimiyle calisiriz</p>
      </footer>
    </div>
  );
}
