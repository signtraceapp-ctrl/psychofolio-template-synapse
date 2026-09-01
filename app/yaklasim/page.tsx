import { getContent } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Yaklaşım" };

export default function ApproachPage() {
  const c = getContent();
  return (
    <div className="font-sans bg-bg text-fg">
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl space-y-16">
            <h1 className="font-display text-4xl font-bold text-center tracking-tight text-fg">{c.approach.title}</h1>
            <p className="text-center text-lg text-fg-muted leading-relaxed max-w-xl mx-auto">
              {c.approach.intro}
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              {c.approach.principles.map((p, i) => (
                <div key={i} className="rounded-[20px] bg-bg-secondary p-7 space-y-3 border border-border/30">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary/10 text-sm font-bold text-primary font-display">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-display text-lg font-bold text-fg">{p.title}</h3>
                  <p className="text-sm text-fg-muted leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
