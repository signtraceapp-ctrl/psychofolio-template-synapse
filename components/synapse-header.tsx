"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const VIOLET = "#7b6cf0";
const PINK = "#ee7ab5";

const navLinks = [
  { label: "Hakkinda", path: "/hakkimda" },
  { label: "Hizmetler", path: "/hizmetler" },
  { label: "Yaklasim", path: "/yaklasim" },
  { label: "Yazilar", path: "/yazilar" },
  { label: "SSS", path: "/sss" },
] as const;

interface SynapseHeaderProps {
  siteName?: string;
}

export function SynapseHeader({ siteName = "SYNAPSE" }: SynapseHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY.current && y > 200 && !menuOpen);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-5 z-40 flex justify-center px-4 transition-[transform,opacity] duration-300 ${
          hidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="flex items-center gap-1 rounded-full border border-white/80 bg-white/70 p-1.5 shadow-[0_14px_44px_rgba(22,24,31,0.10)] backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2.5 pl-4 pr-3">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: `linear-gradient(135deg,${PINK},${VIOLET})` }}
              aria-hidden="true"
            />
            <span
              className="text-sm font-bold tracking-[0.14em] text-[#16181f]"
              style={{ fontFamily: "var(--font-synapse), var(--font-sans), sans-serif" }}
            >
              {siteName}
            </span>
          </Link>
          <nav className="hidden items-center lg:flex" aria-label="Site menusu">
            {navLinks.map((l) => (
              <Link
                key={l.path}
                href={l.path}
                className={`rounded-full px-4 py-2 text-xs transition-colors duration-300 ${
                  isActive(l.path)
                    ? "bg-[#16181f] text-white"
                    : "text-[#6a7080] hover:bg-[#16181f]/5 hover:text-[#16181f]"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/iletisim"
            className="ml-1 hidden rounded-full px-5 py-2.5 text-xs font-medium text-white transition-transform duration-300 hover:scale-[1.03] lg:block"
            style={{ background: `linear-gradient(92deg,${PINK},${VIOLET})` }}
          >
            Randevu Al
          </Link>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#16181f] lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Menuyu kapat" : "Menuyu ac"}
            aria-expanded={menuOpen}
          >
            <span className="relative block h-3 w-4" aria-hidden="true">
              <span className={`absolute left-0 top-0 h-px w-full bg-current transition-[top,transform] duration-300 ${menuOpen ? "top-1/2 rotate-45" : ""}`} />
              <span className={`absolute left-0 top-1/2 h-px w-full bg-current transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-px w-full bg-current transition-[bottom,transform] duration-300 ${menuOpen ? "bottom-1/2 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-30 flex flex-col items-center justify-center gap-1 bg-[#f4f5f8]/97 backdrop-blur-xl transition-opacity duration-300 lg:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        {[{ label: "Ana Sayfa", path: "/" }, ...navLinks, { label: "Randevu", path: "/iletisim" }].map((l, i) => (
          <Link
            key={l.path}
            href={l.path}
            onClick={() => setMenuOpen(false)}
            className={`py-2.5 text-xl font-medium transition-[color,transform,opacity] duration-300 ${
              isActive(l.path) ? "text-[#7b6cf0]" : "text-[#16181f]/80"
            } ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            style={{ transitionDelay: menuOpen ? `${80 + i * 45}ms` : "0ms" }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </>
  );
}
