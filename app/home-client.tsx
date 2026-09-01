"use client";

import { motion } from "framer-motion";
import { Brain, Quote, ArrowRight } from "lucide-react";
import type { SiteContent } from "@/lib/content";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export function HomeClient({ content: c }: { content: SiteContent }) {
  return (
    <div className="font-sans selection:bg-primary/15 bg-bg text-fg">
      {/* Hero - split layout with gradient accent */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-bg to-accent/5" />
        <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-primary/4 blur-[200px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-3xl text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-[20px] bg-primary/8 px-5 py-2 text-xs font-bold tracking-wider text-primary uppercase">
              <Brain className="h-3.5 w-3.5" /> {c.home.badge}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-fg leading-[1.1]">
              {c.home.headline}<br />
              <span className="text-primary">{c.home.headlineAccent}</span> {c.home.headlineSuffix}
            </h1>
            <p className="mx-auto max-w-lg text-base leading-relaxed text-fg-muted">
              {c.home.description}
            </p>
            <div className="pt-2">
              <a
                href="/iletisim"
                className="inline-flex items-center justify-center gap-2 rounded-[20px] px-10 py-3.5 text-sm font-bold shadow-lg shadow-primary/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/15 bg-primary text-primary-fg hover:bg-primary-hover"
              >
                {c.home.cta}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-20 bg-bg-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mx-auto max-w-2xl text-center space-y-6"
          >
            <Quote className="h-8 w-8 text-primary/20 mx-auto" />
            <p className="font-display text-xl md:text-2xl leading-relaxed text-fg/80 font-medium">
              &ldquo;{c.home.quote}&rdquo;
            </p>
            <p className="text-xs tracking-[0.2em] uppercase text-fg-muted">{c.home.quoteAuthor}</p>
          </motion.div>
        </div>
      </section>

      {/* Services - numbered grid */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-14">
            <div className="text-center space-y-4">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-fg tracking-tight">Calisma Alanlari</h2>
              <p className="text-sm text-fg-muted">Seans bilgisi icin iletisime gecin.</p>
            </div>
            <motion.div
              variants={stagger}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid gap-5 sm:grid-cols-2"
            >
              {c.services.map((s, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="group rounded-[20px] border border-border/60 bg-bg p-8 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary/10 text-xs font-bold text-primary font-display">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-display text-lg font-bold text-fg group-hover:text-primary transition-colors">{s.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-fg-muted leading-relaxed pl-11">{s.desc}</p>
                    <div className="flex items-center gap-3 text-xs text-fg-muted/70 pl-11">
                      <span>{s.duration}</span>
                      <span className="text-border">|</span>
                      <span>{s.method}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-24 bg-bg-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-14">
            <h2 className="font-display text-3xl font-bold text-center text-fg tracking-tight">Yazilar</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {c.articles.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group rounded-[20px] border border-border/50 bg-bg p-6 hover:shadow-md hover:border-primary/25 transition-all duration-300 cursor-pointer"
                >
                  <span className="inline-block text-[10px] tracking-wider uppercase text-primary-fg bg-primary rounded-[10px] px-3 py-1 font-bold mb-4">
                    {a.category}
                  </span>
                  <h3 className="font-display text-base font-bold text-fg group-hover:text-primary transition-colors leading-snug">
                    {a.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-fg-muted">
                    <span>{a.readTime}</span>
                    <span className="text-border">|</span>
                    <span>{a.date}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
