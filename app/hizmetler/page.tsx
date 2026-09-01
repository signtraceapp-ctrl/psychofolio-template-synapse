import { getContent } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Hizmetler" };

export default function ServicesPage() {
  const c = getContent();
  return (
    <div className="font-sans bg-bg text-fg">
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-14">
            <div className="text-center space-y-4">
              <h1 className="font-display text-4xl font-bold tracking-tight text-fg">Terapi Hizmetleri</h1>
              <p className="text-sm text-fg-muted">Seans bilgisi icin iletisime gecin.</p>
            </div>
            <div className="mx-auto max-w-3xl grid gap-5 sm:grid-cols-2">
              {c.services.map((s, i) => (
                <div key={i} className="rounded-[20px] border border-border/50 bg-bg p-8 space-y-4 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary/10 text-xs font-bold text-primary font-display">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-display text-lg font-bold text-fg">{s.title}</h2>
                  </div>
                  <p className="text-sm text-fg-muted leading-relaxed">{s.desc}</p>
                  <div className="flex items-center gap-3 text-xs text-fg-muted/70">
                    <span>{s.duration}</span>
                    <span className="text-border">|</span>
                    <span>{s.method}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
